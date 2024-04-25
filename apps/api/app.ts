import express from 'express';
import Routes from './routes';
import mongoSanitize from 'express-mongo-sanitize';

export const app: express.Application = express();

app.use(express.json({ limit: '50mb' }));
app.use(mongoSanitize());

Routes(app);
