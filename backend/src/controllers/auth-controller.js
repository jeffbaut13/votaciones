import { otpService } from "../services/otp-service.js";

export const authController = {
  async requestOtp(request, response, next) {
    try {
      const data = await otpService.requestOtp(request.body.phone);
      response.json({ message: "OTP procesado", data });
    } catch (error) {
      next(error);
    }
  },
  verifyOtp(request, response, next) {
    try {
      const data = otpService.verifyOtp(request.body);
      response.json({ message: "OTP validado", data });
    } catch (error) {
      next(error);
    }
  },
};
