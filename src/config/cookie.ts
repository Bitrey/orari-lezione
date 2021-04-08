import { logger } from "../shared";

if (!process.env.COOKIE_SECRET) {
    logger.error("Missing COOKIE_SECRET env");
    process.exit(1);
}
