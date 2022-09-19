import request from "supertest";
import { app } from "../../app";
import { mongoConnect, mongoDisconnect } from "../../services/mongo";

const launchBody = {
    mission: "Kepler Exploration X",
    rocket: "Explorer IS1",
    destination: "Kepler-442 b"
}

const launchDate = "23 January, 2030";

describe('Launches API', () => {
    beforeAll(async () => {
        await mongoConnect();
    });

    describe('Test GET /launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app).get('/v1/launches?page=1&limit=5');
            expect(response.statusCode).toBe(200)
        })
    });

    describe('Test POST /launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app).post('/v1/launches').send({ ...launchBody, launchDate });

            expect(new Date(launchDate).valueOf()).toBe(new Date(response.body.launchDate).valueOf());

            expect(response.statusCode).toBe(201);
            expect(response.body).toMatchObject(launchBody);

        });

        test('It should catch missing required properties', async () => {
            const response = await request(app).post('/v1/launches').send(launchBody);
            expect(response.statusCode).toBe(400);
            expect(response.body).toMatchObject({ message: "Missing required launch property" });
        })

        test('It should catch invalid dates', async () => {
            const response = await request(app).post('/v1/launches').send({ ...launchBody, launchDate: "Hello" });
            expect(response.statusCode).toBe(400);
            expect(response.body).toMatchObject({ message: "Invalid date format" });
        });
    });
})
