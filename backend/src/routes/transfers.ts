import { Router } from 'express';
import { prisma } from '../prisma';

export const transfersRouter = Router();

transfersRouter.get('/', async (req, res) => {
  try {
    const transfers = await prisma.transferRecord.findMany({
      orderBy: { date: 'desc' },
      include: { 
        player: true,
        fromClub: true,
        toClub: true
      },
      take: 20
    });
    
    res.json({ data: transfers, error: null });
  } catch (error: any) {
    res.status(400).json({ data: null, error: error.message });
  }
});
