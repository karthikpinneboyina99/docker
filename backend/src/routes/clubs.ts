import { Router } from 'express';
import { prisma } from '../prisma';

export const clubsRouter = Router();

clubsRouter.get('/', async (req, res) => {
  try {
    const clubs = await prisma.club.findMany({
      orderBy: { name: 'asc' }
    });
    res.json({ data: clubs, error: null });
  } catch (error: any) {
    res.status(500).json({ data: null, error: error.message });
  }
});

clubsRouter.get('/:id/spending', async (req, res) => {
  try {
    const clubId = req.params.id;
    
    // Total spend: purchases (where club is toClub)
    const spendRecords = await prisma.transferRecord.groupBy({
      by: ['window'],
      where: { toClubId: clubId },
      _sum: {
        fee: true,
      },
    });

    // We can also compute income for completeness, but the requirement specifically asks for spending
    const spendByWindow = spendRecords.map((record: any) => ({
      window: record.window,
      totalSpend: record._sum.fee || 0
    }));

    res.json({ data: spendByWindow, error: null });
  } catch (error: any) {
    res.status(500).json({ data: null, error: error.message });
  }
});
