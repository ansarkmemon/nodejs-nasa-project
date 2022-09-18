import { Request, Response } from "express";
import { getAllPlanets } from "../../models/planets.model";

export const httpGetAllPlanets = (req: Request, res: Response) => {
    res.status(200).json(getAllPlanets());
}