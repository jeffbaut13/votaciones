import { useState } from "react";
import StepIndicator from "../components/ui/StepIndicator.jsx";
import RegisterStep from "../components/steps/RegisterStep.jsx";
import OtpStep from "../components/steps/OtpStep.jsx";
import VoteStep from "../components/steps/VoteStep.jsx";
import ResultStep from "../components/steps/ResultStep.jsx";

const STEP = {
  REGISTER: 0,
  OTP: 1,
  VOTE: 2,
  DONE: 3,
  ALREADY_VOTED: 4,
};

export default function VotingFlow() {
  const [step, setStep] = useState(STEP.REGISTER);
  const [userId, setUserId] = useState(null);

  function handleRegisterResult({ estado, userId: id }) {
    if (estado === "ya_voto") {
      setStep(STEP.ALREADY_VOTED);
    } else if (estado === "habilitado") {
      setUserId(id);
      setStep(STEP.VOTE);
    } else {
      setUserId(id);
      setStep(STEP.OTP);
    }
  }

  const showIndicator = step < STEP.DONE;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Sistema de Votaciones</h1>
          <p className="text-slate-500 text-sm mt-1">Nueva Imagen</p>
        </div>

        {/* Step indicator */}
        {showIndicator && (
          <div className="mb-6">
            <StepIndicator current={step} />
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          {step === STEP.REGISTER && (
            <RegisterStep onResult={handleRegisterResult} />
          )}
          {step === STEP.OTP && (
            <OtpStep
              userId={userId}
              onVerified={() => setStep(STEP.VOTE)}
            />
          )}
          {step === STEP.VOTE && (
            <VoteStep userId={userId} onDone={() => setStep(STEP.DONE)} />
          )}
          {step === STEP.DONE && <ResultStep type="done" />}
          {step === STEP.ALREADY_VOTED && <ResultStep type="already_voted" />}
        </div>
      </div>
    </div>
  );
}
