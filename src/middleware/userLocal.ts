import { NextFunction, Request, Response } from "express";

export const userLocal = (req: Request, res: Response, next: NextFunction) => {
    res.locals.utente = req.student || null;
    next();
};
