import { useState, useEffect } from "react";
import { authService } from "../../services/auth-service.js";
import Button from "../ui/Button.jsx";
import Input from "../ui/Input.jsx";

const RESEND_SECONDS = 60;

export default function OtpStep({ userId, onVerified }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.verifyOtp({ userId, code });
      onVerified();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResendLoading(true);
    setError("");
    setResendSuccess(false);
    try {
      await authService.resendOtp({ userId });
      setCode("");
      setCountdown(RESEND_SECONDS);
      setResendSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Verifica tu correo</h2>
        <p className="text-sm text-slate-500 mt-1">
          Ingresa el código de 4 caracteres que enviamos a tu correo.
        </p>
      </div>

      <Input
        label="Código OTP"
        value={code}
        onChange={(e) => {
          setCode(e.target.value.toUpperCase());
          setError("");
        }}
        placeholder="AB3C4D"
        maxLength={6}
        required
        className="text-center text-2xl tracking-[0.4em] font-mono uppercase"
      />

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      {resendSuccess && (
        <p className="text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
          Código reenviado. Revisa tu correo.
        </p>
      )}

      <Button
        type="submit"
        loading={loading}
        className="w-full"
        disabled={code.length !== 6}
      >
        Verificar código
      </Button>

      <div className="text-center pt-1">
        {countdown > 0 ? (
          <p className="text-sm text-slate-400">
            ¿No llegó?{" "}
            <span className="font-medium text-slate-600">
              Reenviar en {countdown}s
            </span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="text-sm text-blue-600 hover:underline disabled:opacity-50"
          >
            {resendLoading ? "Enviando..." : "Reenviar código"}
          </button>
        )}
      </div>
    </form>
  );
}
