import launchesDB from './launches.mongo';
import planets from './planets.mongo';
import axios from "axios";

export type Launch = {
    flightNumber: number;
    mission: string;
    rocket: string;
    launchDate: Date;
    destination?: string;
    customers: string[];
    upcoming: boolean;
    success: boolean;
}

const DEFAULT_FLIGHT_NUMBER = 100;

const saveLaunch = async (launch: Launch) => {
    await launchesDB.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, { upsert: true })
}

const getLatestFlightNumber = async () => {
    const latestLaunch = await launchesDB.findOne().sort('-flightNumber');
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

export const getAllLaunches = async (skip: number, limit: number) => {
    return await launchesDB.find({}, { "__v": 0, "_id": 0 }).sort({ flightNumber: 1 }).skip(skip).limit(limit);
}

export const scheduleNewLaunch = async (launch: Launch) => {
    const planet = await planets.findOne({ keplerName: launch.destination });

    if (!planet) {
        throw new Error('No matching planet found');
    }

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

const SPACEX_API_URL = "https://api.spacexdata.com/v4";

export const findLaunch = async (filter: Partial<Launch>) => {
    return await launchesDB.findOne(filter);
}

export const populateLaunches = async () => {
    const response = await axios.post(`${SPACEX_API_URL}/launches/query`, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    });

    if (response.status !== 200) {
        console.log('Problem downloading the data');
        throw new Error('Launch data downlaod failed');
    }

    const launchDocs = response.data.docs;

    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload: any) => {
            return payload['customers'];
        })

        const launch: Launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        };

        await saveLaunch(launch)
    }
}

export const loadLaunchData = async () => {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });

    if (firstLaunch) {
        console.log('data already loaded');
    } else {
        await populateLaunches();
    }

}