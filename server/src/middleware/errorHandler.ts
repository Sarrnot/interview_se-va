import express from "express";
import createHttpError from "http-errors";
import { ZodError } from "zod";

const errorHandler = (
    err: unknown,
    _: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    if (createHttpError.isHttpError(err)) {
        res.status(err.status);
        res.send({ error: err.message });
    } else if (err instanceof ZodError) {
        res.status(400);
        res.send({ error: "Invalid data format" });
    } else {
        res.status(500);
        res.send({ error: "Internal server error" });
    }
};

export default errorHandler;
