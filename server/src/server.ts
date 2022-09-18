import http from 'http';
import { app } from "./app";
import { loadPlanets } from './models/planets.model';

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    await loadPlanets();

    server.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    });
}

startServer();