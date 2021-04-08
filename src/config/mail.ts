import { logger } from "../shared";

if (!process.env.SEND_EMAIL_FROM) {
    logger.error("Missing SEND_EMAIL_FROM env");
    process.exit(1);
}
