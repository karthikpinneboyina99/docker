import { Router } from 'express';
import { prisma } from '../prisma';
import { z } from 'zod';

export const contractsRouter = Router();

const contractsQuerySchema = z.object({
  withinMonths: z.string().transform(Number).optional(),
});

contractsRouter.get('/expiring', async (req, res) => {
  try {
    const query = contractsQuerySchema.parse(req.query);
    const where: any = {};

    if (query.withinMonths) {
      const now = new Date();
      const futureDate = new Date();
      futureDate.setMonth(now.getMonth() + query.withinMonths);
      
      where.contractExpiry = {
        gte: now,
        lte: futureDate
      };
    } else {
      // Exclude already expired by default? Let's just return all ascending
    }

    const players = await prisma.player.findMany({
      where,
      orderBy: { contractExpiry: 'asc' },
      include: { currentClub: true }
    });

    res.json({ data: players, error: null });
  } catch (error: any) {
    res.status(400).json({ data: null, error: error.message });
  }
});
