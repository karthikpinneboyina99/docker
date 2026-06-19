import { Router } from 'express';
import { prisma } from '../prisma';
import { z } from 'zod';
import { estimateWage } from '../utils/wage';
import { calculateReliabilityScore, calculateTransferProbability } from '../scoring';

export const playersRouter = Router();

const playersQuerySchema = z.object({
  position: z.string().optional(),
  club: z.string().optional(),
  search: z.string().optional(),
});

playersRouter.get('/', async (req, res) => {
  try {
    const query = playersQuerySchema.parse(req.query);
    const where: any = {};
    
    if (query.position) {
      where.position = query.position;
    }
    if (query.club) {
      // Allow searching by club name or ID
      where.currentClub = {
        OR: [
          { id: query.club },
          { name: { contains: query.club, mode: 'insensitive' } }
        ]
      };
    }
    if (query.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }
    
    const players = await prisma.player.findMany({
      where,
      include: { currentClub: true }
    });
    
    res.json({ data: players, error: null });
  } catch (error: any) {
    res.status(400).json({ data: null, error: error.message });
  }
});
const compareQuerySchema = z.object({
  ids: z.string()
});

playersRouter.get('/compare', async (req, res) => {
  try {
    const query = compareQuerySchema.parse(req.query);
    const ids = query.ids.split(',').slice(0, 3); // max 3
    
    if (!ids.length || !ids[0]) {
      return res.status(400).json({ data: null, error: 'Must provide at least one ID' });
    }

    const players = await prisma.player.findMany({
      where: { id: { in: ids } },
      include: {
        currentClub: true,
        rumors: {
          include: {
            fromClub: true,
            toClub: true,
            reports: {
              include: { source: true }
            }
          }
        }
      }
    });

    const enrichedPlayers = players.map(player => {
      // Calculate top rumor
      let topRumor = null;
      let maxProb = -1;

      const scoredRumors = player.rumors.map(r => {
        const reliabilityScore = calculateReliabilityScore(r.reports.map(rep => ({
          reliabilityWeight: rep.source.reliabilityWeight,
          reportedAt: rep.reportedAt
        })));

        const monthsRemaining = player.contractExpiry ? Math.max(0, (player.contractExpiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)) : 12;
        const daysSinceRumor = Math.max(0, (new Date().getTime() - r.createdAt.getTime()) / (1000 * 60 * 60 * 24));

        const transferProbability = calculateTransferProbability({
          reliabilityScore,
          contractMonthsRemaining: monthsRemaining,
          rumorStatus: r.status,
          daysSinceRumorCreated: daysSinceRumor,
          clubSpendingFitScore: 0.5 // Stub for now
        });

        return { ...r, reliabilityScore, transferProbability };
      });

      scoredRumors.forEach(r => {
        if (['RUMOR', 'ADVANCED_TALKS', 'AGREED'].includes(r.status) && r.transferProbability > maxProb) {
          maxProb = r.transferProbability;
          topRumor = r;
        }
      });

      // Calculate wage
      const { estimatedWage } = estimateWage(player.marketValue, player.position, player.age);

      // Remove full rumors array to keep response clean, just attach topRumor and wage
      const { rumors, ...playerData } = player;
      return {
        ...playerData,
        estimatedWage,
        topRumor
      };
    });

    res.json({ data: enrichedPlayers, error: null });
  } catch (error: any) {
    res.status(400).json({ data: null, error: error.message });
  }
});

playersRouter.get('/:id', async (req, res) => {
  try {
    const player = await prisma.player.findUnique({
      where: { id: req.params.id },
      include: {
        currentClub: true,
        rumors: {
          include: {
            fromClub: true,
            toClub: true,
            reports: {
              include: { source: true }
            }
          }
        }
      }
    });
    if (!player) {
      return res.status(404).json({ data: null, error: 'Player not found' });
    }
    res.json({ data: player, error: null });
  } catch (error: any) {
    res.status(500).json({ data: null, error: error.message });
  }
});

playersRouter.get('/:id/similar', async (req, res) => {
  try {
    const player = await prisma.player.findUnique({ where: { id: req.params.id } });
    if (!player) {
      return res.status(404).json({ data: null, error: 'Player not found' });
    }
    
    const similarPlayers = await prisma.player.findMany({
      where: {
        id: { not: player.id },
        position: player.position,
        age: {
          gte: player.age - 2,
          lte: player.age + 2,
        },
        marketValue: {
          gte: Math.floor(player.marketValue * 0.8),
          lte: Math.ceil(player.marketValue * 1.2),
        }
      },
      include: { currentClub: true },
      take: 5
    });
    
    // TODO Phase 4: Compute reliability score / transfer probability
    
    res.json({ data: similarPlayers, error: null });
  } catch (error: any) {
    res.status(500).json({ data: null, error: error.message });
  }
});

playersRouter.get('/:id/wage-estimate', async (req, res) => {
  try {
    const player = await prisma.player.findUnique({ where: { id: req.params.id } });
    if (!player) {
      return res.status(404).json({ data: null, error: 'Player not found' });
    }

    const estimate = estimateWage(player.marketValue, player.position, player.age);

    res.json({
      data: estimate,
      error: null
    });
  } catch (error: any) {
    res.status(500).json({ data: null, error: error.message });
  }
});
