import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => console.log('connection ready'));
mongoose.connection.on('error', (err) => console.error(err))

export const mongoConnect = async () => {
    await mongoose.connect(MONGO_URL);
}

export const mongoDisconnect = async () => {
    await mongoose.disconnect();
}