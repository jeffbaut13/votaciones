import { apiClient } from "@/lib/api-client";

export const authService = {
  requestOtp: (payload) => apiClient.post("/auth/request-otp", payload),
  verifyOtp: (payload) => apiClient.post("/auth/verify-otp", payload),
};
