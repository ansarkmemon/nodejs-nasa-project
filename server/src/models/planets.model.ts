import fs from "fs";
import path from "path";
import { parse } from "csv-parse";

type Planet = {
    'koi_disposition': "CONFIRMED" | string;
    'koi_insol': number;
    'koi_prad': number;
    'kepler_name': string;
}

const habitablePlanets: Planet[] = [];

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
            .on('data', (data) => {
                if (isHabitablePlanet(data)) {
                    habitablePlanets.push(data);
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('end', () => {
                console.log(`${habitablePlanets.length} habitable planets found!`);
                resolve();
            });
    })
}


export { habitablePlanets as planets, loadPlanets };