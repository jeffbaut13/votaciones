import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { authController } from "../controllers/auth-controller.js";

const router = Router();

// Máximo 5 intentos de verificación por IP cada 10 minutos
const verifyOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  message: { message: "Demasiados intentos. Intenta de nuevo en 10 minutos." },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

// Máximo 3 reenvíos por IP cada 10 minutos
const resendOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 3,
  message: { message: "Demasiados reenvíos. Intenta de nuevo en 10 minutos." },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

router.post("/register", authController.register);
router.post("/verify-otp", verifyOtpLimiter, authController.verifyOtp);
router.post("/resend-otp", resendOtpLimiter, authController.resendOtp);

export { router as authRoutes };
