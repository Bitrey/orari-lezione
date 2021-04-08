import { Router } from "express";
import validator from "validator";
import { logger, sendError, sendMail } from "../../shared";
import bcrypt from "bcryptjs";
import Student from "../../models/Student";
import { INTERNAL_SERVER_ERROR } from "http-status";
import PasswordReset from "../../models/PasswordReset";
import moment from "moment";
import Mail from "nodemailer/lib/mailer";

const router = Router();

router.get("/reset-password", async (req, res) => {
    if (req.student) return res.redirect("/");
    res.render("newResetPw");
});

router.post("/nuovo-reset-password", async (req, res) => {
    if (req.student) return res.redirect("/");

    // Trova email
    const { email } = req.body;
    if (typeof email !== "string" || !validator.isEmail(email)) {
        return sendError(res, "Email non valida");
    }

    let student;
    try {
        student = await Student.findOne({ email }).exec();
    } catch (err) {
        logger.error(err);
        return sendError(res, "Errore sconosciuto", INTERNAL_SERVER_ERROR);
    }

    if (!student) {
        return sendError(res, "Nessun utente trovato con quella email");
    }

    // Se esiste già un PasswordReset dello studente non scaduto
    const query = {
        $and: [
            { hasBeenUsed: false },
            { student: student._id },
            { expiryDate: { $gt: new Date() } }
        ]
    };

    let passwordReset;

    try {
        passwordReset = await PasswordReset.findOne(query).exec();
    } catch (err) {
        logger.error(err);
        return sendError(res, "Errore sconosciuto", INTERNAL_SERVER_ERROR);
    }

    if (passwordReset) {
        moment.locale("it");
        const prefix = "Hai già un reset della password in sospeso di circa ";
        return sendError(res, prefix + moment().fromNow());
    }

    passwordReset = new PasswordReset({ student: student._id });

    try {
        await passwordReset.save();
    } catch (err) {
        logger.error(err);
        return sendError(res, "Errore sconosciuto", INTERNAL_SERVER_ERROR);
    }

    const fullURL = `https://lezioni.bitrey.it/reset-password/${passwordReset.url}/${passwordReset.secret}`;
    const message: Mail.Options = {
        from: `"Orari Lezioni 4F" ${process.env.SEND_EMAIL_FROM}`,
        to: email,
        subject: "Cambio password Orari Lezioni 4F",
        html:
            "<p>Ciao " +
            student.username +
            ", hai richiesto il cambio password su " +
            "lezioni.bitrey.it.<br>Se sei stato tu, prosegui cliccando questo link: " +
            `<a href="${fullURL}">${fullURL}</a><br>Il link scade tra 1 ora.<br>Buona giornata!</p>`
    };

    await sendMail(message);
    logger.info("Email reset password inviata a " + student.username);

    res.json(passwordReset);
});

router.get("/reset-password/:url/:secret", async (req, res) => {
    if (req.student) return res.redirect("/");

    let passwordReset;

    try {
        passwordReset = await PasswordReset.findOne({
            url: req.params.url
        }).exec();
    } catch (err) {
        logger.error(err);
        return sendError(res, "Errore sconosciuto", INTERNAL_SERVER_ERROR);
    }

    if (!passwordReset) {
        return sendError(res, "URL del reset password non valido");
    } else if (passwordReset.secret !== req.params.secret) {
        return sendError(res, "Segreto del reset password non valido");
    }

    res.render("resetPw");
});

router.post("/reset-password/:url/:secret", async (req, res) => {
    if (req.student) return res.redirect("/");

    const { password } = req.body;
    const { url, secret } = req.params;

    if (typeof password !== "string") {
        return sendError(res, "Password mancante");
    } else if (password.length < 8) {
        return sendError(res, "La password deve essere di almeno 8 caratteri");
    } else if (typeof url !== "string") {
        return sendError(res, "URL del reset password non valido");
    } else if (typeof secret !== "string") {
        return sendError(res, "Segreto del reset password non valido");
    }

    let passwordReset;

    try {
        passwordReset = await PasswordReset.findOne({ url }).exec();
    } catch (err) {
        logger.error(err);
        return sendError(res, "Errore sconosciuto", INTERNAL_SERVER_ERROR);
    }

    if (!passwordReset) {
        return sendError(res, "URL del reset password non valido");
    } else if (passwordReset.secret !== secret) {
        return sendError(res, "Segreto del reset password non valido");
    }

    let student;

    try {
        student = await Student.findOne({ _id: passwordReset.student }).exec();
    } catch (err) {
        logger.error(err);
        return sendError(res, "Errore sconosciuto", INTERNAL_SERVER_ERROR);
    }

    if (!student) {
        logger.error("student not found in reset password");
        return sendError(res, "Errore sconosciuto", INTERNAL_SERVER_ERROR);
    }

    student.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    student.isTempPassword = false;

    passwordReset.hasBeenUsed = true;

    try {
        passwordReset.save();
        student.save();
    } catch (err) {
        logger.error(err);
        return sendError(res, "Errore sconosciuto", INTERNAL_SERVER_ERROR);
    }

    return res.json(student);
});

export default router;
