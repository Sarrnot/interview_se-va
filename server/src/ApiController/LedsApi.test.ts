import supertest from "supertest";
import app from "../app";
import Database from "../Database/Database";
import LedState from "../constants/LedState";
import { Led, LedConfiguration } from "@prisma/client";

type LedMock = {
    led: Led;
    config: LedConfiguration;
};

describe("LedsApi", () => {
    const ledMock = <LedMock>{};
    let nonExistingId: number;

    beforeAll(async () => {
        /* Mock database */
        const offState = await Database.ledState.findFirst({
            where: { state: LedState.off },
        });

        if (!offState) {
            throw new Error(
                "OFF LedState not found in database. Run seed first."
            );
        }

        ledMock.led = await Database.led.create({
            data: { ledStateId: offState.id },
        });

        ledMock.config = await Database.ledConfiguration.create({
            data: { blink_rate: 1, gpio_pin: 123456, ledId: ledMock.led.id },
        });

        /* Find non-existing Led.id */
        const lastLed = await Database.led.findFirst({
            orderBy: { id: "desc" },
        });
        nonExistingId = (lastLed?.id ?? 1) + 10;
    });

    describe("/leds/:id/state", () => {
        const createUrl = (ledExists = true) =>
            `/leds/${ledExists ? ledMock.led.id : nonExistingId}/state`;

        test("GET returns LED's state", async () => {
            await supertest(app)
                .get(createUrl())
                .expect(200)
                .expect(LedState.off);
        });

        test("PUT changes LED's state", async () => {
            await supertest(app).put(createUrl()).send(LedState.on);
            const led = await Database.led.findFirst({
                where: { id: ledMock.led.id },
                select: {
                    ledState: true,
                },
            });
            expect(led?.ledState.state).toBe(LedState.on);
        });

        test("GET/PUT non-existing LED returns 404", async () => {
            await supertest(app).get(createUrl(false)).expect(404);
            await supertest(app)
                .put(createUrl(false))
                .send(LedState.blinking)
                .expect(404);
        });

        test("PUT invalid data returns 400", async () => {
            await supertest(app)
                .put(createUrl())
                .send("Some invalid value")
                .expect(400);
            await supertest(app)
                .put(createUrl())
                .send({ invalidRequest: 42 })
                .expect(400);
        });
    });

    describe("/leds/:id/interval", () => {
        const createUrl = (ledExists = true) =>
            `/leds/${ledExists ? ledMock.led.id : nonExistingId}/interval`;

        test("GET returns LED's blink interval", async () => {
            await supertest(app)
                .get(createUrl())
                .expect(200)
                .expect(`${ledMock.config.blink_rate}`);
        });

        test("PUT changes LED's blink interval", async () => {
            await supertest(app).put(createUrl()).send("5");
            const ledConfig = await Database.ledConfiguration.findFirst({
                where: { ledId: ledMock.led.id },
            });
            expect(ledConfig?.blink_rate).toBe(5);
        });

        test("GET/PUT non-existing LED returns 404", async () => {
            await supertest(app).get(createUrl(false)).expect(404);
            await supertest(app).put(createUrl(false)).send("6").expect(404);
        });

        test("PUT invalid data returns 400", async () => {
            await supertest(app)
                .put(createUrl())
                .send("Some invalid value")
                .expect(400);
            await supertest(app)
                .put(createUrl())
                .send({ invalidRequest: 42 })
                .expect(400);
        });
    });

    afterAll(async () => {
        /* Database cleanup */
        await Database.ledConfiguration.delete({
            where: { id: ledMock.config.id },
        });

        await Database.led.delete({ where: { id: ledMock.led.id } });
        await Database.$disconnect();
    });
});
