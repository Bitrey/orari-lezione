import { Response } from "express";

export function saveToken(res: Response, token: string) {
    res.cookie("token", token, {
        signed: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 3
    });
}
