import crypto from "node:crypto";
import { env } from "../config/env.js";
import { userRepository } from "../modules/user/user-repository.js";
import { n8nService } from "./n8n-service.js";

// Solo mayúsculas y números, sin caracteres ambiguos (0/O, 1/I) para mayor claridad en el correo
// 6 caracteres → 32^6 ≈ 1.000M combinaciones, resistente a brute-force incluso con 4M votantes
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const OTP_LENGTH = 6;

function generateOtp() {
  let otp = "";
  const bytes = crypto.randomBytes(OTP_LENGTH);
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += CHARS[bytes[i] % CHARS.length];
  }
  return otp;
}

function hashOtp(code) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export const otpService = {
  async register({ nombre, email, telefono }) {
    const existing = await userRepository.findByEmailOrPhone(email, telefono);

    if (existing) {
      if (existing.estado === "ya_voto") {
        return { estado: "ya_voto" };
      }

      if (existing.estado === "habilitado") {
        return { estado: "habilitado", userId: existing.id };
      }

      const code = generateOtp();
      const otpHash = hashOtp(code);
  // TTL = OTP_EXPIRES_IN_SECONDS (default 60s). Debe coincidir con el contador del frontend.
  // Al expirar el contador, el codigo ya no es valido. Al hacer resend, el hash se sobreescribe
  // de inmediato, invalidando el codigo anterior aunque no haya expirado aun.
  const otpExpiresAt = new Date(Date.now() + env.otpExpiresInSeconds * 1000);

      await userRepository.updateOtp(existing.id, { otpHash, otpExpiresAt });
      await n8nService.sendOtp({ email: existing.email, nombre: existing.nombre, codigo: code });

      return { estado: "pendiente", userId: existing.id };
    }

    const code = generateOtp();
    const otpHash = hashOtp(code);
    const otpExpiresAt = new Date(Date.now() + env.otpExpiresInSeconds * 1000);

    const { id } = await userRepository.create({
      nombre,
      email,
      telefono,
      otpHash,
      otpExpiresAt,
    });

    await n8nService.sendOtp({ email, nombre, codigo: code });

    return { estado: "pendiente", userId: id };
  },

  async verifyOtp({ userId, code }) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("Usuario no encontrado.");
    if (user.estado === "ya_voto") throw new Error("El usuario ya voto.");
    if (user.estado === "habilitado") return { estado: "habilitado" };

    const expiresAt = user.otpExpiresAt.toDate
      ? user.otpExpiresAt.toDate()
      : new Date(user.otpExpiresAt);

    if (Date.now() > expiresAt.getTime()) {
      throw new Error("El codigo OTP ha expirado. Solicita uno nuevo.");
    }

    if (hashOtp(code) !== user.otpHash) {
      throw new Error("Codigo OTP incorrecto.");
    }

    await userRepository.updateEstado(userId, "habilitado");
    return { estado: "habilitado" };
  },

  async resendOtp({ userId }) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("Usuario no encontrado.");
    if (user.estado === "ya_voto") throw new Error("El usuario ya voto.");
    if (user.estado === "habilitado") throw new Error("El usuario ya esta habilitado.");

    const code = generateOtp();
    const otpHash = hashOtp(code);
    const otpExpiresAt = new Date(Date.now() + env.otpExpiresInSeconds * 1000);

    await userRepository.updateOtp(userId, { otpHash, otpExpiresAt });
    await n8nService.sendOtp({ email: user.email, nombre: user.nombre, codigo: code });

    return { message: "Nuevo codigo OTP enviado." };
  },
};
