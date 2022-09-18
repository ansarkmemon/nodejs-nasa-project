const launches = new Map<number, Launch>();

type Launch = {
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

export const getAllLaunches = () => Array.from(launches.values());