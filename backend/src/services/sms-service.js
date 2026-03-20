import { env } from "../config/env.js";
import { getTwilioClient } from "../lib/twilio-client.js";

export const smsService = {
  async sendOtp({ phone, code }) {
    const client = getTwilioClient();

    if (!client || !env.twilioPhoneNumber) {
      return {
        provider: "mock",
        message: `OTP simulado para ${phone}: ${code}`,
      };
    }

    await client.messages.create({
      body: `Tu codigo de votacion es ${code}`,
      from: env.twilioPhoneNumber,
      to: phone,
    });

    return { provider: "twilio" };
  },
};
