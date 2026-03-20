import { Router } from "express";
import { authRoutes } from "./auth-routes.js";
import { voteRoutes } from "./vote-routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/votes", voteRoutes);

export { router as apiRoutes };
