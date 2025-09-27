import express from "express";
import { connectToMongo, disconnectToMongo } from "./db/connection";
import categoryRoute from './routers/categoryRoute';
import expenseRoute from './routers/expenseRouter';
import z from "zod";
import { it } from "zod/locales";

z.config(it());

const app = express();
const port = process.env.PORT || '3000';

app.use(express.json());

app.use('/categories', categoryRoute);
app.use('/expense', expenseRoute);

app.use('/', (req, res) => {
    res.send('Benvenuto in Track My Money!');
});

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