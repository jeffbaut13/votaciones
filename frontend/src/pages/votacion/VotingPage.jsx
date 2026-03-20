import { useNavigate } from "react-router-dom";
import { PageIntro } from "@/components/layout/PageIntro";
import { Card } from "@/components/ui/Card";
import { StepBadge } from "@/components/shared/StepBadge";
import { PhoneStepForm } from "@/components/forms/PhoneStepForm";
import { OtpStepForm } from "@/components/forms/OtpStepForm";
import { VoteStepForm } from "@/components/forms/VoteStepForm";
import { useAuthFlow } from "@/hooks/use-auth-flow";
import { useVotingStore } from "@/store/voting-store";
import { votingService } from "@/services/voting-service";
import { useAuthStore } from "@/store/auth-store";

export function VotingPage() {
  const navigate = useNavigate();
  const { session, error, isLoading, requestOtp, verifyOtp } = useAuthFlow();
  const { currentStep, selectedOption, setStep, selectOption, hydrateSummary } = useVotingStore();
  const { markVoteCompleted } = useAuthStore();

  async function handlePhoneSubmit(phone) {
    const result = await requestOtp(phone);
    if (result.data.hasVoted) {
      setStep(1);
      return;
    }
    setStep(2);
  }

  async function handleOtpSubmit(code) {
    const result = await verifyOtp(code);
    if (result.data.verified) {
      setStep(3);
    }
  }

  async function handleVoteSubmit() {
    const result = await votingService.submitVote({
      phone: session.phone,
      option: selectedOption,
    });
    hydrateSummary(result.data.summary);
    markVoteCompleted();
    navigate("/registro-de-votaciones");
  }

  return (
    <div>
      <PageIntro
        eyebrow="Votacion"
        title="Flujo persistente por pasos"
        description="La sesion de autenticacion y el paso de votacion quedan modelados para soportar persistencia y reanudacion."
      />
      <div className="mb-6 flex flex-wrap gap-3">
        <StepBadge step={1} label="Telefono" isActive={currentStep === 1} />
        <StepBadge step={2} label="OTP" isActive={currentStep === 2} />
        <StepBadge step={3} label="Voto" isActive={currentStep === 3} />
      </div>
      <Card className="max-w-3xl">
        {currentStep === 1 && (
          <PhoneStepForm
            onSubmit={handlePhoneSubmit}
            isLoading={isLoading}
            feedback={
              session.hasVoted
                ? { tone: "warning", message: "Ya no puedes votar con este numero." }
                : error
                  ? { tone: "error", message: error }
                  : null
            }
          />
        )}

        {currentStep === 2 && (
          <OtpStepForm
            onSubmit={handleOtpSubmit}
            isLoading={isLoading}
            feedback={error ? { tone: "error", message: error } : { tone: "info", message: "Ingresa el codigo enviado por SMS." }}
          />
        )}

        {currentStep === 3 && (
          <VoteStepForm
            selectedOption={selectedOption}
            onSelect={selectOption}
            onSubmit={handleVoteSubmit}
            isSubmitting={false}
          />
        )}
      </Card>
    </div>
  );
}
