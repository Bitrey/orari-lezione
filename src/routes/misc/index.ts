import { Router } from "express";

const router = Router();

router.get("/401", (req, res) => {
    res.render("401");
});

router.all("*", (req, res) => {
    res.render("404");
});

export default router;
