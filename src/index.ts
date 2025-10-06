import express from "express";
import { connectToMongo, disconnectToMongo } from "./db/connection";
import categoryRoute from './routers/categoryRoute';
import transactionRoute from './routers/transactionRouter';
import { errorsHandler } from './middlewares/errorsHandler';
import z from "zod";
import { it } from "zod/locales";
import cors from 'cors';

z.config(it());

const app = express();
const port = process.env.PORT || '3000';

app.use(cors({
    origin: '*'
}))

app.use(express.json());

app.use('/categories', categoryRoute);
app.use('/transactions', transactionRoute);

app.use('/', (req, res) => {
    res.send('Benvenuto in Track My Money!');
});

app.use(errorsHandler);

const startServer = async (): Promise<void> => {
    try {
        await connectToMongo();

        app.listen(port, () => {
            console.log('🚀 Server in esecuzione!')
        });
    } catch (error) {
        console.error(`Errore durante l'avvio del server: `, error);
        process.exit(1);
    }
};

// Gestione della chiusura graceful del server
process.on('SIGINT', async () => {
    console.log('\n⏳ Shutting down server gracefully...');
    await disconnectToMongo();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n⏳ Shutting down server gracefully...');
    await disconnectToMongo();
    process.exit(0);
});

startServer();