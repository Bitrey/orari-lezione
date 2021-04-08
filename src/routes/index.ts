import { Router } from "express";
import homepageRoutes from "./homepage";
import authRoutes from "./auth";
import miscRoutes from "./misc";

const router = Router();
router.use("/", homepageRoutes);
router.use("/", authRoutes);
router.use("/", miscRoutes);

export default router;
