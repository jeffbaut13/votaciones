import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthFlow } from "@/hooks/use-auth-flow";
import { useVotingStore } from "@/store/voting-store";
import { votingService } from "@/services/voting-service";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/Button";
import { RevealClipText } from "@/components/shared/RevealClipText";
import { Steps } from "./components/Steps";
import { useState } from "react";

const headlineLines = ["Para escribir la historia,", "necesitamos tu firma."];

export function VotingPage() {
  const navigate = useNavigate();
  const [steps, setSteps] = useState(0);

  const { session, error, isLoading, requestOtp, verifyOtp } = useAuthFlow();
  const { currentStep, selectedOption, setStep, selectOption, hydrateSummary } =
    useVotingStore();
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
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="size-full max-w-6xl mx-auto flex justify-center items-center"
    >
      <div
        className={`w-full min-h-135 ${steps >= 1 ? "" : "border"} border-cb rounded-2xl flex justify-center items-center`}
      >
        {steps >= 1 ? (
          <Steps />
        ) : (
          <div className="size-full flex flex-col gap-6 items-center justify-center">
            <RevealClipText
              as="h1"
              lines={headlineLines}
              className="text-4xl md:text-7xl text-center"
              moveDuration={2}
              clipDuration={3}
            />

            <RevealClipText
              as="p"
              lines={[
                "Queremos garantizar que cada voto sea único y transparente, ",
                "necesitamos que te registres como un ciudadano de Inter Rapidísimo.",
              ]}
              className="text-center text-2xl"
              moveDuration={2}
              clipDuration={3}
            />

            <Button
              variant="primary"
              className="mt-6"
              onClick={() => setSteps(1)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 3,
                delay: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Empezar
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
