import express from "express";
import { z } from "zod";
import Database from "../Database/Database";
import createHttpError from "http-errors";

const LedsApi = express.Router();

const idSchema = z.number().int();

LedsApi.get("/:id/state", async (req, res) => {
    const id = idSchema.parse(Number(req.params.id));

    const led = await Database.led.findFirst({
        where: { id },
        select: { ledState: true },
    });

    if (!led) {
        throw createHttpError(404, "LED not found");
    }

    res.status(200).send(led.ledState.state);
});

LedsApi.put("/:id/state", async (req, res) => {
    res.send("Put LED State");
});

LedsApi.get("/:id/interval", async (req, res) => {
    const id = idSchema.parse(Number(req.params.id));

    const led = await Database.led.findFirst({
        where: { id },
        select: { ledConfiguration: true },
    });

    if (!led) {
        throw createHttpError(404, "LED not found");
    }
    if (!led.ledConfiguration) {
        throw createHttpError(
            500,
            "Internal server error: LED doesn't have a configuration."
        );
    }

    res.status(200).send(`${led.ledConfiguration.blink_rate}`);
});

LedsApi.put("/:id/interval", async (req, res) => {
    res.send("Put LED Interval");
});

export default LedsApi;
