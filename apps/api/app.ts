import express from 'express';
import Routes from './routes';

export const app: express.Application = express();
app.use(express.json({ limit: '50mb' }));

Routes(app);
