import express from 'express';
import brandRouter from './routes/brand.js';

const app = express();
app.use(express.json());
app.use('/marcas', brandRouter);
app.listen(3001, () => console.log('API Started!'));
