import { Request, Response } from "express";
import { scheduleNewLaunch, deleteLaunch, getAllLaunches, isLaunchPresent, Launch } from "../../models/launches.model";
import { getPagination } from "../../services/query";

export const httpGetAllLaunches = async (req: Request, res: Response) => {
    const { skip, limit } = getPagination(req.query);
    return res.status(200).json(await getAllLaunches(skip, limit));
}

export const httpAddNewLaunch = async (req: Request, res: Response) => {
    const launch: Launch = req.body;
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.destination) {
        return res.status(400).json({ message: "Missing required launch property" });
    }
    launch.launchDate = new Date(launch.launchDate);
    if (!(launch.launchDate instanceof Date) || isNaN(launch.launchDate.valueOf())) {
        return res.status(400).json({ message: "Invalid date format" });
    }
    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

export const httpDeleteLaunch = async (req: Request, res: Response) => {
    const isPresent = await isLaunchPresent(+req.params.launchId);

    if (!isPresent) return res.status(404).json({ message: `The launch with id ${req.params.launchId} was not found.` });

    const abortedMission = await deleteLaunch(+req.params.launchId);
    if (!abortedMission) {
        return res.status(400).json({ message: 'Something went wrong' });
    }

    return res.status(200).json({ ok: true });
}