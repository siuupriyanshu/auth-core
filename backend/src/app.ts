import express from 'express';
import dotenv from 'dotenv';
import { errorHandler, notFound } from './middleware/errorHandler';
import  authRoutes from './route/authRoute';
import cors from 'cors';
import { config } from './config/config';
dotenv.config();

const app = express();;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: config.allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']   
}));

app.get('/', (req, res) => {
    res.send('Welcome to Multi-Auth Service');
});


app.use("/api/auth", authRoutes);
app.use("/", errorHandler);
app.use("/", notFound);

export default app;

