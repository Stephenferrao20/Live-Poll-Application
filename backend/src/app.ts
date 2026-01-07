import express from 'express';
import cors from 'cors';
import pollRoutes from './routes/poll.routes.ts'

const app = express();

app.use(cors());
app.use(express.json());

app.use(pollRoutes);

export default app;