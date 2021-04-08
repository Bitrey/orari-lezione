import { Router } from "express";
import { logger } from "../../shared";

const router = Router();

router.get("/logout", (req, res) => {
    logger.debug(`'${req.student?.username}' logging out`);
    if (req.student) req.student = null;
    res.clearCookie("token");
    res.redirect("/");
});

export default router;
