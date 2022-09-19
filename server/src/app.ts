import express, { Request, Response } from "express";
import cors from "cors";
import { planetsRouter } from "./routes/planets/planets.router";
import path from "path";
import morgan from "morgan";
import { launchesRouter } from "./routes/launches/launches.router";

export const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(morgan('short'))

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use('/v1/planets', planetsRouter);
app.use('/v1/launches', launchesRouter)

app.get('/*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})
