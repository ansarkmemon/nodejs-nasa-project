import launchesDB from './launches.mongo';
import planets from './planets.mongo';

const launches = new Map<number, Launch>();

export type Launch = {
    flightNumber: number;
    mission: string;
    rocket: string;
    launchDate: Date;
    destination: string;
    customers: string[];
    upcoming: boolean;
    success: boolean;
}

const launch: Launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    destination: "Kepler-442 b",
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
};
const DEFAULT_FLIGHT_NUMBER = 100;

const saveLaunch = async (launch: Launch) => {
    const planet = await planets.findOne({ keplerName: launch.destination });

    if (!planet) {
        throw new Error('No matching planet found');
    }

    await launchesDB.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, { upsert: true })
}

saveLaunch(launch);

const getLatestFlightNumber = async () => {
    const latestLaunch = await launchesDB.findOne().sort('-flightNumber');
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

export const getAllLaunches = async () => {
    return await launchesDB.find({}, { "__v": 0, "_id": 0 });
}

export const scheduleNewLaunch = async (launch: Launch) => {
    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        upcoming: true,
        success: true,
        customers: ["Ansar", "NASA"],
        flightNumber: newFlightNumber
    });
    return await saveLaunch(newLaunch);
}


export const isLaunchPresent = async (launchId: number) => {
    return await launchesDB.findOne({ flightNumber: launchId });
};

export const deleteLaunch = async (launchId: number): Promise<boolean> => {
    const aborted = await launchesDB.updateOne({
        flightNumber: launchId
    }, { upcoming: false, success: false });

    return aborted.acknowledged && aborted.modifiedCount === 1;
}
