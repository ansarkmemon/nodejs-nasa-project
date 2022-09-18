const launches = new Map<number, Launch>();

export type Launch = {
    flightNumber: number;
    mission: string;
    rocket: string;
    launchDate: Date;
    destination: string;
    customer: string[];
    upcoming: boolean;
    success: boolean;
}

const launch: Launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    destination: "Kepler-442 b",
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
};

launches.set(launch.flightNumber, launch);
let latestFlightNumber = 100;

export const getAllLaunches = () => Array.from(launches.values());

export const addNewLaunch = (launch: Launch) => {
    latestFlightNumber++;
    launches.set(latestFlightNumber, Object.assign(launch, {
        upcoming: true,
        success: true,
        customer: ["Ansar", "NASA"],
        flightNumber: latestFlightNumber
    }));
}

export const isLaunchPresent = (launchId: number) => launches.has(launchId);

export const deleteLaunch = (launchId: number): Launch => {
    const mission = launches.get(launchId);
    mission.upcoming = false;
    mission.success = false;
    return mission;
}
