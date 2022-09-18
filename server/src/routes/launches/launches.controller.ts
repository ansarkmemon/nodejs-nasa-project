import { Request, Response } from "express";
import { addNewLaunch, deleteLaunch, getAllLaunches, isLaunchPresent, Launch } from "../../models/launches.model";

export const httpGetAllLaunches = (req: Request, res: Response) => {
    return res.status(200).json(getAllLaunches());
}

export const httpAddNewLaunch = (req: Request, res: Response) => {
    const launch: Launch = req.body;
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.destination) {
        return res.status(400).json({ message: "Missing required launch property" });
    }
    launch.launchDate = new Date(launch.launchDate);
    if (!(launch.launchDate instanceof Date) || isNaN(launch.launchDate.valueOf())) {
        return res.status(400).json({ message: "Invalid date format" });
    }
    addNewLaunch(launch);
    return res.status(201).json(launch);
}

export const httpDeleteLaunch = (req: Request, res: Response) => {
    const isPresent = isLaunchPresent(+req.params.launchId);

    if (!isPresent) return res.status(404).json({ message: `The launch with id ${req.params.launchId} was not found.` });

    const abortedMission = deleteLaunch(+req.params.launchId);
    return res.status(200).json(abortedMission);
}