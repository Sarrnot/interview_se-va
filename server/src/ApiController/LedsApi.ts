import express from "express";

const LedsApi = express.Router();

LedsApi.get("/:id/state", async (_, res: express.Response) => {
    res.send("Get LED State");
});

LedsApi.put(
    "/:id/state",
    async (req: express.Request, res: express.Response) => {
        res.send("Put LED State");
    }
);

LedsApi.get("/:id/interval", async (_, res: express.Response) => {
    res.send("Get LED Interval");
});

LedsApi.put(
    "/:id/interval",
    async (req: express.Request, res: express.Response) => {
        res.send("Put LED Interval");
    }
);

export default LedsApi;
