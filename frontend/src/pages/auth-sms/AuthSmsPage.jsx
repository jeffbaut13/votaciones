import { useAuthFlow } from "@/hooks/use-auth-flow";
import { PageIntro } from "@/components/layout/PageIntro";
import { Card } from "@/components/ui/Card";
import { PhoneStepForm } from "@/components/forms/PhoneStepForm";
import { OtpStepForm } from "@/components/forms/OtpStepForm";

export function AuthSmsPage() {
  const { session, error, isLoading, requestOtp, verifyOtp } = useAuthFlow();

  async function handlePhoneSubmit(phone) {
    await requestOtp(phone);
  }

  return (
    <div>
      <PageIntro
        eyebrow="Autenticacion"
        title="Flujo OTP desacoplado"
        description="Pantalla base para validar telefono, bloquear usuarios que ya votaron y avanzar a verificacion por codigo."
      />
      <Card className="max-w-2xl">
        {session.verificationStatus === "idle" && (
          <PhoneStepForm
            onSubmit={handlePhoneSubmit}
            isLoading={isLoading}
            feedback={error ? { tone: "error", message: error } : null}
          />
        )}

        {session.verificationStatus === "blocked" && (
          <p className="text-brand-50">Ya no puedes votar. El telefono consultado ya tiene un voto registrado.</p>
        )}

        {session.verificationStatus === "otp-sent" && (
          <OtpStepForm
            onSubmit={verifyOtp}
            isLoading={isLoading}
            feedback={error ? { tone: "error", message: error } : { tone: "info", message: "Codigo enviado. Revisa tu SMS." }}
          />
        )}

        {session.verificationStatus === "verified" && (
          <p className="text-brand-50">Telefono validado. Ya puedes pasar al flujo de votacion.</p>
        )}
      </Card>
    </div>
  );
}
