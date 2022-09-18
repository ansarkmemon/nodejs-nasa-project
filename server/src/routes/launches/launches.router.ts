import express from "express";
import { getAllLaunches } from "./launches.controller";

export const launchesRouter = express.Router();

launchesRouter.get('/launches', getAllLaunches);