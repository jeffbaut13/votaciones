import crypto from "node:crypto";
import { env } from "../config/env.js";
import { voteRepository } from "../modules/vote/vote-repository.js";
import { smsService } from "./sms-service.js";

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export const otpService = {
  async requestOtp(phone) {
    const existingVote = voteRepository.findVoteByPhone(phone);
    if (existingVote) {
      return {
        hasVoted: true,
        requestId: "",
      };
    }

    const requestId = crypto.randomUUID();
    const session = {
      requestId,
      phone,
      code: generateOtp(),
      expiresAt: Date.now() + env.otpExpiresInMinutes * 60 * 1000,
    };

    voteRepository.saveOtpSession(session);
    await smsService.sendOtp({
      phone,
      code: session.code,
    });

    return {
      hasVoted: false,
      requestId,
    };
  },
  verifyOtp({ requestId, phone, code }) {
    const session = voteRepository.findOtpSession(requestId);

    if (!session || session.phone !== phone) {
      throw new Error("Sesion OTP invalida.");
    }

    if (Date.now() > session.expiresAt) {
      voteRepository.consumeOtpSession(requestId);
      throw new Error("El codigo expiro.");
    }

    if (session.code !== code) {
      throw new Error("Codigo OTP incorrecto.");
    }

    voteRepository.consumeOtpSession(requestId);
    return { verified: true };
  },
};
