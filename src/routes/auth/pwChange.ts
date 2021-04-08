import { Router } from "express";
import { logger, sendError } from "../../shared";
import bcrypt from "bcryptjs";
import { isLoggedIn } from "../../middleware/isLoggedIn";
import { INTERNAL_SERVER_ERROR } from "http-status";
import { saveToken } from "../../shared/saveToken";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/cambia-password", isLoggedIn, (req, res) => {
    res.render("changePw");
});

router.post("/cambia-password", isLoggedIn, async (req, res) => {
    if (!req.student) {
        logger.error("No req.user with middleware in post /cambia-password");
        return sendError(res, "Errore sconosciuto", INTERNAL_SERVER_ERROR);
    }

    const { password } = req.body;
    if (typeof password !== "string") {
        return sendError(res, "Password mancante");
    } else if (password.length < 8) {
        return sendError(res, "La password deve essere di almeno 8 caratteri");
    }

    req.student.isTempPassword = false;
    req.student.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    try {
        await req.student.save();
    } catch (err) {
        logger.error(err);
        return sendError(res, "Errore sconosciuto", INTERNAL_SERVER_ERROR);
    }

    // Generate an access token
    const token = jwt.sign(
        { _id: req.student._id },
        process.env.JWT_SECRET as string
    );

    logger.debug(`'${req.student.username}' changed password`);

    saveToken(res, token);

    res.json(req.student.toObject());
});

export default router;
