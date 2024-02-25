import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.env.WEB_PORT);

if (isNaN(PORT)) {
    throw new Error("Missing or invalid WEB_PORT environment variable.");
}

app.listen(PORT, () => {});
