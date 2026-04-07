import { env } from "../config/env.js";

export const n8nService = {
  async sendOtp({ email, nombre, codigo }) {
    if (!env.n8nWebhookUrl) {
      console.log(`[n8n mock] OTP para ${email}: ${codigo}`);
      return { provider: "mock", codigo };
    }

    const response = await fetch(env.n8nWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nombre, codigo }),
    });

    if (!response.ok) {
      throw new Error("Error al enviar OTP via n8n.");
    }

    return { provider: "n8n" };
  },
};
