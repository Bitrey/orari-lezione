import { Router } from "express";
import loginRoutes from "./login";
import logoutRoutes from "./logout";
import pwChangeRoutes from "./pwChange";
import pwReseteRoutes from "./pwReset";

const router = Router();

router.use("/", loginRoutes);
router.use("/", logoutRoutes);
router.use("/", pwChangeRoutes);
router.use("/", pwReseteRoutes);

export default router;
