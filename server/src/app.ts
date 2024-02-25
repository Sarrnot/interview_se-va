import Database from "./Database/Database";
import express from "express";
import cors from "cors";
import LedsApi from "./ApiController/LedsApi";
import LogsApi from "./ApiController/LogsApi";

const exitListener = async () => {
    await Database.$disconnect();
    process.exit();
};

process.on("SIGINT", exitListener);
// TODO: handle other exit types

const app = express();

app.use(cors());
app.use(express.json());

app.use("/leds", LedsApi);
app.use("/logs", LogsApi);
app.use("*", (_, res) => {
    res.status(404);
    res.json({ error: "Not found" });
});

export default app;
