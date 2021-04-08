import path from "path";
import { logger } from ".";

const ORARI_PATH = path.join(__dirname, "../orari", "/orari.json");

export let orari: any;
try {
    orari = require(ORARI_PATH);
} catch (err) {
    logger.error("Impossibile impostare gli orari nel path " + ORARI_PATH);
    process.exit(1);
}
