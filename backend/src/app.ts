import express from 'express';
import cors from 'cors';
import { playersRouter } from './routes/players';
import { clubsRouter } from './routes/clubs';
import { rumorsRouter } from './routes/rumors';
import { contractsRouter } from './routes/contracts';
import { transfersRouter } from './routes/transfers';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/players', playersRouter);
app.use('/api/clubs', clubsRouter);
app.use('/api/rumors', rumorsRouter);
app.use('/api/contracts', contractsRouter);
app.use('/api/transfers', transfersRouter);

app.get('/api/health', (req, res) => {
  res.json({ data: { status: 'ok', timestamp: new Date().toISOString() }, error: null });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ data: null, error: err.message || 'Internal Server Error' });
});

export { app };
