import { apiClient } from "../lib/api-client.js";

export const authService = {
  register: (data) => apiClient.post("/api/auth/register", data),
  verifyOtp: (data) => apiClient.post("/api/auth/verify-otp", data),
  resendOtp: (data) => apiClient.post("/api/auth/resend-otp", data),
};
