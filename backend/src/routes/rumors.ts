import { Router } from 'express';
import { prisma } from '../prisma';
import { z } from 'zod';
import { calculateReliabilityScore, calculateTransferProbability } from '../scoring';
import { generateRumorSummary } from '../ai/rumorSummary';

const enhanceRumor = (r: any) => {
  const daysSinceCreated = Math.max(0, (new Date().getTime() - r.createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const contractMonthsRemaining = r.player?.contractExpiry ? 
    (r.player.contractExpiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30.44) : 0;
  
  const reliabilityScore = calculateReliabilityScore(
    r.reports.map((report: any) => ({
      reliabilityWeight: report.source.reliabilityWeight,
      reportedAt: report.reportedAt
    }))
  );

  const transferProbability = calculateTransferProbability({
    reliabilityScore,
    contractMonthsRemaining,
    rumorStatus: r.status,
    daysSinceRumorCreated: daysSinceCreated,
    clubSpendingFitScore: 0.5 // Default placeholder for Phase 5
  });

  return { ...r, reliabilityScore, transferProbability };
};

export const rumorsRouter = Router();

const rumorsQuerySchema = z.object({
  status: z.enum(['RUMOR', 'ADVANCED_TALKS', 'AGREED', 'COMPLETED', 'DENIED', 'DEAD']).optional(),
  club: z.string().optional(),
  minReliability: z.string().transform(Number).optional(),
});

rumorsRouter.get('/', async (req, res) => {
  try {
    const query = rumorsQuerySchema.parse(req.query);
    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }
    
    if (query.club) {
      // Filter by either fromClub or toClub
      where.OR = [
        { fromClubId: query.club },
        { toClubId: query.club },
        { fromClub: { name: { contains: query.club, mode: 'insensitive' } } },
        { toClub: { name: { contains: query.club, mode: 'insensitive' } } }
      ];
    }
    
    if (query.minReliability) {
      // Simple filter: rumor has at least one report from a source with >= minReliability
      where.reports = {
        some: {
          source: {
            reliabilityWeight: { gte: query.minReliability }
          }
        }
      };
    }

    const rumors = await prisma.rumor.findMany({
      where,
      include: {
        player: {
          include: { currentClub: true }
        },
        fromClub: true,
        toClub: true,
        reports: {
          include: { source: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const dataWithCalculatedProbability = rumors.map((r: any) => enhanceRumor(r));

    res.json({ data: dataWithCalculatedProbability, error: null });
  } catch (error: any) {
    res.status(400).json({ data: null, error: error.message });
  }
});

rumorsRouter.get('/:id', async (req, res) => {
  try {
    const rumor = await prisma.rumor.findUnique({
      where: { id: req.params.id },
      include: {
        player: true,
        fromClub: true,
        toClub: true,
        reports: {
          include: { source: true },
          orderBy: { reportedAt: 'desc' }
        }
      }
    });

    if (!rumor) {
      return res.status(404).json({ data: null, error: 'Rumor not found' });
    }

    res.json({ 
      data: enhanceRumor(rumor), 
      error: null 
    });
  } catch (error: any) {
    res.status(500).json({ data: null, error: error.message });
  }
});

rumorsRouter.get('/:id/summary', async (req, res) => {
  try {
    const rumor = await prisma.rumor.findUnique({
      where: { id: req.params.id },
      include: {
        player: true,
        fromClub: true,
        toClub: true,
        reports: {
          include: { source: true },
          orderBy: { reportedAt: 'desc' }
        }
      }
    });

    if (!rumor) {
      return res.status(404).json({ data: null, error: 'Rumor not found' });
    }

    const enhancedRumor = enhanceRumor(rumor);

    const summaryResult = await generateRumorSummary(
      rumor, 
      enhancedRumor.reliabilityScore, 
      enhancedRumor.transferProbability
    );

    res.json({ data: summaryResult, error: null });
  } catch (error: any) {
    res.status(500).json({ data: null, error: error.message });
  }
});
