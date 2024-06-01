import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import searchRoutes from './routes/search';
import audioRoutes from './routes/audio';
import recommendationRoutes from './routes/recommendations';

const app = express();
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/search', searchRoutes);
app.use('/audio', audioRoutes);
app.use('/recommendations', recommendationRoutes);

export default app;
