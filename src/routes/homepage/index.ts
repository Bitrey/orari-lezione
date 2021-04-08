import { Router } from "express";
import { isLoggedIn } from "../../middleware/isLoggedIn";
import { orari } from "../../shared";

const router = Router();

router.get("/", isLoggedIn, (req, res) => {
    if (req.student?.isTempPassword) {
        return res.redirect("/cambia-password?tempPw=true");
    }
    res.render("index", { orari: JSON.stringify(orari) });
});

export default router;
