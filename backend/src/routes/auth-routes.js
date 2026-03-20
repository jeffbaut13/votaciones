import { Router } from "express";
import { authController } from "../controllers/auth-controller.js";

const router = Router();

router.post("/request-otp", authController.requestOtp);
router.post("/verify-otp", authController.verifyOtp);

export { router as authRoutes };
