import http from 'http';
import { app } from "./app";
import { loadPlanets } from './models/planets.model';
import { mongoConnect } from './services/mongo';
import dotenv from "dotenv";
import { loadLaunchData } from './models/launches.model';

dotenv.config();

const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

const startServer = async () => {
    await mongoConnect();
    await loadPlanets();
    await loadLaunchData();

    server.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    });
}

startServer();