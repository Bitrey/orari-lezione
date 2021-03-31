import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();

import helmet from "helmet";
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

import path from "path";

const ORARI_PATH = path.join(__dirname, "/orari", "/orari.json");

app.use(express.static(path.join(__dirname, "/public")));
app.set("views", path.join(__dirname, "/views"));

app.set("view engine", "ejs");

let orari: any;
try {
    orari = require(ORARI_PATH);
} catch (err) {
    console.error("Impossibile impostare gli orari nel path " + ORARI_PATH);
    process.exit(1);
}

app.get("/", (req, res) => {
    res.render("index", { orari: JSON.stringify(orari) });
});

const PORT = Number(process.env.PORT) || 3000;
const IP = process.env.IP || "127.0.0.1";
app.listen(PORT, IP, function () {
    console.log(`Server partito su ${IP}:${PORT}`);
});
