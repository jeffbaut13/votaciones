import { otpService } from "../services/otp-service.js";

export const authController = {
  async register(request, response, next) {
    try {
      const { nombre, email, telefono } = request.body;

      if (!nombre || !email || !telefono) {
        return response.status(400).json({ message: "Nombre, email y telefono son requeridos." });
      }

      const data = await otpService.register({ nombre, email, telefono });
      response.json({ data });
    } catch (error) {
      next(error);
    }
  },

  async verifyOtp(request, response, next) {
    try {
      const { userId, code } = request.body;

      if (!userId || !code) {
        return response.status(400).json({ message: "userId y code son requeridos." });
      }

      const data = await otpService.verifyOtp({ userId, code });
      response.json({ data });
    } catch (error) {
      next(error);
    }
  },

  async resendOtp(request, response, next) {
    try {
      const { userId } = request.body;

      if (!userId) {
        return response.status(400).json({ message: "userId es requerido." });
      }

      const data = await otpService.resendOtp({ userId });
      response.json({ data });
    } catch (error) {
      next(error);
    }
  },
};
