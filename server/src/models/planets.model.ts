import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
import planets from "./planets.mongo";

type Planet = {
    'koi_disposition': "CONFIRMED" | string;
    'koi_insol': number;
    'koi_prad': number;
    'kepler_name': string;
}

function isHabitablePlanet(planet: Planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

const loadPlanets = () => {
    return new Promise<void>((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true,
            }))
            .on('data', async (data: Planet) => {
                if (isHabitablePlanet(data)) {
                    savePlanet(data);
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('end', async () => {
                const totalPlanets = (await getAllPlanets()).length
                console.log(`${totalPlanets} habitable planets found!`);
                resolve();
            });
    })
}

const getAllPlanets = async () => await planets.find({}, { '__v': 0, '_id': 0 });

const savePlanet = async (data: Planet) => {
    try {
        await planets.updateOne({
            keplerName: data.kepler_name
        }, {
            keplerName: data.kepler_name
        }, { upsert: true });
    } catch (error) {
        console.error(`Could not save planet ${error}`);

    }
}
export { getAllPlanets, loadPlanets };