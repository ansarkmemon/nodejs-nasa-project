import http from 'http';
import { app } from "./app";
import { loadPlanets } from './models/planets.model';
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => console.log('connection ready'));
mongoose.connection.on('error', (err) => console.error(err))

const startServer = async () => {
    await mongoose.connect(MONGO_URL);
    await loadPlanets();

    server.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    });
}

startServer();