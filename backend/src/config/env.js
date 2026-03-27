import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  firebaseProjectId: process.env.FB_PROJECT_ID || "",
  firebaseClientEmail: process.env.FB_CLIENT_EMAIL || "",
  firebasePrivateKey: (process.env.FB_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  otpExpiresInSeconds: Number(process.env.OTP_EXPIRES_IN_SECONDS || 60),
  n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || "",
};
