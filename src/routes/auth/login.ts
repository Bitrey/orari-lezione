import { Router } from "express";
import validator from "validator";
import Student from "../../models/Student";
import { logger, sendError } from "../../shared";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { saveToken } from "../../shared/saveToken";

const router = Router();

router.get("/login", (req, res) => {
    if (req.student) return res.redirect("/");
    res.render("login");
});

router.post("/login", async (req, res) => {
    if (req.student) return res.redirect("/");

    const { email, password } = req.body;
    if (typeof email !== "string" || !validator.isEmail(email)) {
        return sendError(res, "Email non valida");
    } else if (typeof password !== "string") {
        return sendError(res, "Password mancante");
    } else if (password.length < 8) {
        return sendError(res, "La password deve essere di almeno 8 caratteri");
    }

    const student = await Student.findOne({ email }).exec();
    if (!student) {
        return sendError(res, "Nessun utente trovato con quella email");
    } else if (!bcrypt.compareSync(password, student.password)) {
        return sendError(res, "Password errata");
    }

    // Generate an access token
    const token = jwt.sign(
        { _id: student._id },
        process.env.JWT_SECRET as string
    );

    logger.debug(`'${student.username}' logged in`);

    saveToken(res, token);

    res.json(student.toObject());
});

export default router;
