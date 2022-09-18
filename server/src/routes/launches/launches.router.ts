import express from "express";
import { httpAddNewLaunch, httpDeleteLaunch, httpGetAllLaunches } from "./launches.controller";

export const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:launchId', httpDeleteLaunch);