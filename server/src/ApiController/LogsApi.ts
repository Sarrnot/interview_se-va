import express from "express";

const LogsApi = express.Router();

LogsApi.get("/", async (_, res: express.Response) => {
    res.send("Get Logs");
});

export default LogsApi;
