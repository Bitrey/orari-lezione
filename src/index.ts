import "./config";
import express from "express";
import path from "path";
import helmet from "helmet";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";
import { DocumentType } from "@typegoose/typegoose";
import Student, { StudentClass } from "./models/Student";
import { isLoggedIn } from "./middleware/isLoggedIn";
import { logger, sendError } from "./shared";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { populateReqUser } from "./middleware/populateReqUser";
import { saveToken } from "./shared/saveToken";
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "http-status";
import transporter from "./shared/transporter";
import Mail from "nodemailer/lib/mailer";

const app = express();

declare global {
    namespace Express {
        interface Request {
            student: DocumentType<StudentClass> | null;
        }
    }
}

// app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (!process.env.COOKIE_SECRET) {
    logger.error("Missing COOKIE_SECRET env");
    process.exit(1);
}
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(populateReqUser);

app.use((req, res, next) => {
    res.locals.utente = req.student || null;
    next();
});

const ORARI_PATH = path.join(__dirname, "/orari", "/orari.json");

app.use(express.static(path.join(__dirname, "/public")));
app.set("views", path.join(__dirname, "/views"));

app.set("view engine", "ejs");

let orari: any;
try {
    orari = require(ORARI_PATH);
} catch (err) {
    logger.error("Impossibile impostare gli orari nel path " + ORARI_PATH);
    process.exit(1);
}

app.get("/", isLoggedIn, (req, res) => {
    if (req.student?.isTempPassword) {
        return res.redirect("/cambia-password?tempPw=true");
    }
    res.render("index", { orari: JSON.stringify(orari) });
});

app.get("/login", (req, res) => {
    if (req.student) return res.redirect("/");
    res.render("login");
});

app.post("/login", async (req, res) => {
    if (req.student) return res.redirect("/");

    const { email, password } = req.body;
    if (typeof email !== "string" || !validator.isEmail(email)) {
        return sendError(res, "Email non valida");
    } else if (typeof password !== "string") {
        return sendError(res, "Password mancante");
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

app.get("/401", (req, res) => {
    res.render("401");
});

app.get("/cambia-password", isLoggedIn, (req, res) => {
    res.render("changePw");
});

app.post("/cambia-password", isLoggedIn, async (req, res) => {
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

app.get("/logout", (req, res) => {
    logger.debug(`'${req.student?.username}' logging out`);
    if (req.student) req.student = null;
    res.clearCookie("token");
    res.redirect("/");
});

app.get("/404", (req, res) => {
    res.status(NOT_FOUND).render("404");
});

app.all("*", (req, res) => {
    res.redirect("/404");
});

const PORT = Number(process.env.PORT) || 3000;
const IP = process.env.IP || "127.0.0.1";
app.listen(PORT, IP, function () {
    logger.info(`Server partito su ${IP}:${PORT}`);
});

if (!process.env.SEND_EMAIL_FROM) {
    logger.error("Missing SEND_EMAIL_FROM env");
    process.exit(1);
}

function nameToEmail(name: string) {
    return name.toLowerCase().split(" ").reverse().join(".") + "@fermi.mo.it";
}

function sendMail(message: Mail.Options): Promise<void> {
    return new Promise(async (resolve, reject) => {
        transporter.sendMail(message, (err, info) => {
            if (err) console.error(err, "\n\n-----\n\n");
            resolve();
        });
    });
}

async function generateAccounts() {
    const studenti: { nome: string; numero: number }[] = [
        { nome: "Amella Alessandro", numero: 1 },
        { nome: "Bigliardi Laura", numero: 2 },
        { nome: "Carnevali Lorenzo", numero: 3 },
        { nome: "Caselli Silvia", numero: 4 },
        { nome: "Casolari Asia", numero: 5 },
        { nome: "Cassanelli Sebastiano", numero: 6 },
        { nome: "Castillo Kiara", numero: 7 },
        { nome: "Chiurazzi Lorenzo", numero: 8 },
        { nome: "Costetti Bianca", numero: 9 },
        { nome: "Fava Alessio", numero: 10 },
        { nome: "Fazioli Filippo", numero: 11 },
        { nome: "Manno Lorenzo", numero: 12 },
        { nome: "Mecugni Davide", numero: 13 },
        { nome: "Oliva Christian", numero: 14 },
        { nome: "Palotti Maxim", numero: 15 },
        { nome: "Pavlik Yaroslav", numero: 16 },
        { nome: "Sergiano Francesco", numero: 17 },
        { nome: "Soli Fatima", numero: 18 },
        { nome: "Vitale Leonardo", numero: 19 }
    ];

    if (await Student.exists({ email: "alessandro.amella@fermi.mo.it" })) {
        logger.warn("Not creating students twice");
        return;
    }

    for (const studente of studenti) {
        const randomPw = randomstring.generate({ length: 12 });
        const email = nameToEmail(studente.nome);

        const studentDB = new Student({
            email,
            isTempPassword: true,
            password: bcrypt.hashSync(randomPw, bcrypt.genSaltSync(10)),
            username: studente.nome
        });
        await studentDB.save();

        const message: Mail.Options = {
            from: `"Orari Lezioni 4F" ${process.env.SEND_EMAIL_FROM}`,
            to: email,
            subject: "Notifica da Orari Lezioni 4F",
            html:
                "Buonasera e buongiorno a tutti,<br>" +
                "stavo per spegnere il computer quando a mezzanotte e mezza " +
                "ho pensato che il miglior sito del mondo, lezioni.bitrey.it, " +
                "era ancora da mettere a posto.<br>" +
                "2 ore e mezza, che sia benedetto il Signore, ho finito.<br><br>" +
                "Qua sotto trovi le tue credenziali per accedere al sito.<br>" +
                "Nota che la password è temporanea e la dovrai cambiare al primo accesso.<br>" +
                "Quella che inserirai verrà hashata con bcrypt quindi tranquillo " +
                "che non ti rubo l'account PayPal.<br><br>" +
                `<h4>Email: <strong>${studentDB.email}</strong></h4><br>` +
                `<h4>Password: <strong>${randomPw}</strong></h4><br>` +
                "<br>Questa è un'email automatica, non rispondere qua.<br>" +
                "CRISTODDIO SE MI PENTO DELLE MIE SCELTE DI VITA"
        };

        // logger.warn("Davvero a " + email);
        // await sendMail(message);

        // await sendMail(message);
        // logger.info("Email inviata a " + studente.nome);
    }
}
// generateAccounts();
