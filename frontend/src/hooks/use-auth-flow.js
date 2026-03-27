import { useState } from "react";
import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

export function useAuthFlow() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { session, setPhoneCheckResult, markVerified } = useAuthStore();

  async function requestOtp(phone) {
    setIsLoading(true);
    setError("");
    try {
      const result = await authService.requestOtp({ phone });
      setPhoneCheckResult({ phone, ...result.data });
      return result;
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyOtp(code) {
    setIsLoading(true);
    setError("");
    try {
      const result = await authService.verifyOtp({
        phone: session.phone,
        requestId: session.requestId,
        code,
      });
      if (result.data.verified) {
        markVerified();
      }
      return result;
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }

  return { session, error, isLoading, requestOtp, verifyOtp };
}
