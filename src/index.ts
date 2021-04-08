import "./config";
import express from "express";
import path from "path";
import helmet from "helmet";
import { DocumentType } from "@typegoose/typegoose";
import { StudentClass } from "./models/Student";
import { logger } from "./shared";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { populateReqUser } from "./middleware/populateReqUser";
import { userLocal } from "./middleware/userLocal";
import routes from "./routes";

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

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(populateReqUser);
app.use(userLocal);

app.use(express.static(path.join(__dirname, "/public")));

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use("/", routes);

const PORT = Number(process.env.PORT) || 3000;
const IP = process.env.IP || "127.0.0.1";
app.listen(PORT, IP, () => {
    logger.info(`Server partito su ${IP}:${PORT}`);
});
