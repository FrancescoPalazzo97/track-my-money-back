import mongoose from "mongoose";

const DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/NOME_DATABASE';

export const connectToMongo = async (): Promise<void> => {
    try {
        await mongoose.connect(DB);
        console.log('✅ Connessione a MongoDB avvenuta con successo!');
    } catch (error) {
        console.error('❌ Errore durante la connessione a MongoDB: ', error);
        process.exit(1);
    }
}

export const disconnectToMongo = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        console.log('✅ Disconnessione avvenuta con successo!');
    } catch (error) {
        console.error('❌ Errore durante la disconnessione: ', error);
    }
}

mongoose.connection.on('connected', () => {
    console.log('🟢 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
    console.error('🔴 Mongoose connection error:', error);
});

mongoose.connection.on('disconnected', () => {
    console.log('🟡 Mongoose disconnected from MongoDB');
});