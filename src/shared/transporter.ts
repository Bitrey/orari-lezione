import nodemailer from "nodemailer";

// Initialize dotenv
import dotenv from "dotenv";
import { logger } from "./logger";
dotenv.config();

if (!process.env.MAIL_SERVER) {
    logger.error("Missing MAIL_SERVER env");
    process.exit(1);
} else if (!process.env.MAIL_USERNAME) {
    logger.error("Missing MAIL_USERNAME env");
    process.exit(1);
} else if (!process.env.MAIL_PASSWORD) {
    logger.error("Missing MAIL_PASSWORD env");
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SERVER,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify((err, success): void => {
    if (err) {
        logger.error(err);
    } else {
        logger.info("Email ready: " + success);
    }
});

export default transporter;
