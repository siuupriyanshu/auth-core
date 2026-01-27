import express from 'express';
import dotenv from 'dotenv';
import { errorHandler, notFound } from './middleware/errorHandler';
import  authRoutes from './route/authRoute';
dotenv.config();

const app = express();;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to Multi-Auth Service');
});


app.use("/api/auth", authRoutes);
app.use("/", errorHandler);
app.use("/", notFound);

export default app;

