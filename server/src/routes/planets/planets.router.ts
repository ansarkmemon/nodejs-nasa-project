import { httpGetAllPlanets } from "./planets.controller";
import express from "express"

const planetsRouter = express.Router();

planetsRouter.get('/', httpGetAllPlanets);

export { planetsRouter };