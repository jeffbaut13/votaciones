import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Icono } from "@/components/ui/Icono";
import { RefreshCcw } from "lucide-react";
import { RevealClipText } from "@/components/shared/RevealClipText";

const stepLabels = [
  "Datos personales",
  "Verificacion OTP",
  "Acceso confirmado",
];

const otpStatusCopy = {
  none: null,
  expired: {
    title: "El codigo expiro",
    description:
      "Este codigo ya no es valido. Solicita uno nuevo para continuar con tu registro.",
  },
  invalid: {
    title: "Codigo incorrecto",
    description:
      "Los caracteres ingresados no coinciden. Revisa el correo e intenta de nuevo.",
  },
  used: {
    title: "Codigo ya utilizado",
    description:
      "Este codigo ya fue consumido anteriormente. Genera uno nuevo para seguir.",
  },
};

const mockOptions = [
  { value: "success", label: "Correcto" },
  { value: "expired", label: "Vencido" },
  { value: "invalid", label: "Erroneo" },
  { value: "used", label: "Ya usado" },
];

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isPhoneValid(phone) {
  return /^\d{10}$/.test(phone);
}

function formatPhone(phone) {
  const digits = phone.replace(/\D/g, "").slice(0, 10);
  const parts = [];

  if (digits.length > 0) {
    parts.push(digits.slice(0, 3));
  }

  if (digits.length > 3) {
    parts.push(digits.slice(3, 6));
  }

  if (digits.length > 6) {
    parts.push(digits.slice(6, 8));
  }

  if (digits.length > 8) {
    parts.push(digits.slice(8, 10));
  }

  return parts.join(" ");
}

function getStepOneErrors(formData) {
  const errors = {
    fullName: "",
    email: "",
    phone: "",
  };

  if (!formData.fullName.trim()) {
    errors.fullName = "Ingresa tu nombre completo.";
  } else if (formData.fullName.trim().length < 3) {
    errors.fullName = "El nombre debe tener al menos 3 caracteres.";
  }

  if (!formData.email.trim()) {
    errors.email = "Ingresa tu correo electronico.";
  } else if (!isEmailValid(formData.email)) {
    errors.email = "Escribe un correo valido con formato nombre@dominio.com.";
  }

  if (!formData.phone.trim()) {
    errors.phone = "Ingresa tu numero de telefono.";
  } else if (!/^\d+$/.test(formData.phone)) {
    errors.phone = "El telefono solo puede contener numeros.";
  } else if (formData.phone.length !== 10) {
    errors.phone = "El telefono debe tener exactamente 10 digitos.";
  }

  return errors;
}

function getStatusTone(status) {
  switch (status) {
    case "expired":
      return "border-amber-300/30 bg-amber-200/8 text-amber-100";
    case "invalid":
      return "border-rose-300/30 bg-rose-200/8 text-rose-100";
    case "used":
      return "border-sky-300/30 bg-sky-200/8 text-sky-100";
    default:
      return "border-white/10 bg-white/5 text-brand-50";
  }
}

export const Steps = () => {
  const [step, setStep] = useState(1);
  const [mockResult, setMockResult] = useState("success");
  const [otpStatus, setOtpStatus] = useState("none");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    phone: false,
  });
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);
  const stepOneErrors = getStepOneErrors(formData);

  const isStepOneValid =
    !stepOneErrors.fullName && !stepOneErrors.email && !stepOneErrors.phone;

  const isOtpComplete = otpValues.every((value) => value.length === 1);

  const resetOtpStep = () => {
    setOtpValues(["", "", "", "", "", ""]);
    setOtpStatus("none");
    window.requestAnimationFrame(() => {
      otpRefs.current[0]?.focus();
    });
  };

  const handleChangeField = (key, value) => {
    setFormData((current) => ({
      ...current,
      [key]: key === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value,
    }));
  };

  const handleBlurField = (key) => {
    setTouched((current) => ({
      ...current,
      [key]: true,
    }));
  };

  const handleContinueFromProfile = () => {
    if (!isStepOneValid) {
      setTouched({
        fullName: true,
        email: true,
        phone: true,
      });
      return;
    }

    setStep(2);
    setOtpStatus("none");
    window.requestAnimationFrame(() => {
      otpRefs.current[0]?.focus();
    });
  };

  const handleOtpChange = (index, rawValue) => {
    const cleanValue = rawValue
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(-1);

    setOtpStatus("none");
    setOtpValues((current) => {
      const next = [...current];
      next[index] = cleanValue;
      return next;
    });

    if (cleanValue && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6)
      .split("");

    if (!pasted.length) {
      return;
    }

    const next = ["", "", "", "", "", ""];
    pasted.forEach((char, index) => {
      next[index] = char;
    });

    setOtpStatus("none");
    setOtpValues(next);
    const nextIndex = Math.min(pasted.length, 5);
    window.requestAnimationFrame(() => {
      otpRefs.current[nextIndex]?.focus();
    });
  };

  const handleValidateOtp = () => {
    if (!isOtpComplete) {
      return;
    }

    if (mockResult === "success") {
      setOtpStatus("none");
      setStep(3);
      return;
    }

    setOtpStatus(mockResult);
  };

  const currentStatus = otpStatusCopy[otpStatus];
  const headlineLines = ["Tu voto es único", "y está protegido."];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex-1 w-full max-w-xl flex justify-center items-center"
    >
      <>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex-1 flex flex-col gap-18"
            >
              <div className="flex flex-col gap-6 text-start">
                <label className="space-y-2">
                  <span className="hidden text-xs uppercase tracking-[0.24em] text-brand-50/45">
                    Nombre completo
                  </span>
                  <Input
                    value={formData.fullName}
                    onChange={(event) =>
                      handleChangeField("fullName", event.target.value)
                    }
                    onBlur={() => handleBlurField("fullName")}
                    placeholder="Nombre completo"
                    className={`input-style ${
                      touched.fullName && stepOneErrors.fullName
                        ? "border-rose-400/70 focus:border-rose-300"
                        : "border-white/10 focus:border-accent"
                    }`}
                  />
                  {touched.fullName && stepOneErrors.fullName && (
                    <p className="text-sm text-rose-300">
                      {stepOneErrors.fullName}
                    </p>
                  )}
                </label>

                <label className="space-y-2 ">
                  <span className="hidden text-xs uppercase tracking-[0.24em] text-brand-50/45">
                    Correo electronico
                  </span>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(event) =>
                      handleChangeField("email", event.target.value)
                    }
                    onBlur={() => handleBlurField("email")}
                    placeholder="nombre@correo.com"
                    className={`input-style ${
                      touched.email && stepOneErrors.email
                        ? "border-rose-400/70 focus:border-rose-300"
                        : "border-white/10 focus:border-accent"
                    }`}
                  />
                  {touched.email && stepOneErrors.email && (
                    <p className="text-sm text-rose-300">
                      {stepOneErrors.email}
                    </p>
                  )}
                </label>

                <label className="space-y-2">
                  <span className="hidden text-xs uppercase tracking-[0.24em] text-brand-50/45">
                    Teléfono
                  </span>
                  <Input
                    type="tel"
                    value={formatPhone(formData.phone)}
                    onChange={(event) =>
                      handleChangeField("phone", event.target.value)
                    }
                    onBlur={() => handleBlurField("phone")}
                    placeholder="300 123 45 67"
                    inputMode="numeric"
                    className={`input-style ${
                      touched.phone && stepOneErrors.phone
                        ? "border-rose-400/70 focus:border-rose-300"
                        : "border-white/10 focus:border-accent"
                    }`}
                  />
                  {touched.phone && stepOneErrors.phone && (
                    <p className="text-sm text-rose-300">
                      {stepOneErrors.phone}
                    </p>
                  )}
                </label>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="arrow"
                  onClick={handleContinueFromProfile}
                  disabled={!isStepOneValid}
                >
                  Enviar código
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-96 flex-1 flex flex-col justify-between gap-8 space-y-18"
            >
              <h2 className="text-xl text-brand-50 text-center">
                Ingresa el código de verificación
              </h2>

              <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
                <div className="flex justify-center gap-2 md:gap-3">
                  {otpValues.map((value, index) => (
                    <input
                      key={`otp-${index}`}
                      ref={(element) => {
                        otpRefs.current[index] = element;
                      }}
                      value={value}
                      onChange={(event) =>
                        handleOtpChange(index, event.target.value)
                      }
                      onKeyDown={(event) => handleOtpKeyDown(index, event)}
                      onPaste={handleOtpPaste}
                      autoFocus={index === 0}
                      inputMode="text"
                      maxLength={1}
                      className="h-14 w-12 rounded-2xl border border-cb text-center text-2xl uppercase text-brand-50 outline-none transition focus:border-brand-50 md:h-16 md:w-14 md:text-2xl"
                    />
                  ))}
                </div>

                <Button
                  variant="third"
                  onClick={resetOtpStep}
                  className="group"
                >
                  Volver a enviar código
                  <Icono
                    color="primary"
                    size="sm"
                    customclass={
                      "ml-2 opacity-60 group-hover:opacity-100 transition ease-in-out duration-500"
                    }
                  >
                    <RefreshCcw />
                  </Icono>
                </Button>
                {/* <div className="rounded-2xl border border-brand-50/10 bg-white/3 p-4">
                  <p className="mb-3 text-xs uppercase tracking-[0.22em] text-brand-50/45">
                    Resultado simulado para maqueta
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {mockOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setMockResult(option.value)}
                        className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.18em] transition ${
                          mockResult === option.value
                            ? "border-brand-50 bg-brand-50 text-brand-950"
                            : "border-brand-50/15 text-brand-50/60 hover:border-brand-50/30 hover:text-brand-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div> */}

                <AnimatePresence mode="wait">
                  {currentStatus && (
                    <motion.div
                      key={otpStatus}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className={`rounded-xl border p-5 ${getStatusTone(otpStatus)}`}
                    >
                      <h3 className="text-lg font-semibold">
                        {currentStatus.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 opacity-85">
                        {currentStatus.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="arrow"
                  back
                  onClick={() => {
                    setStep(1);
                    setOtpStatus("none");
                  }}
                >
                  Volver
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    variant="arrow"
                    onClick={handleValidateOtp}
                    disabled={!isOtpComplete}
                  >
                    Votar
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-18 text-center"
            >
              <div className="space-y-3">
                <RevealClipText
                  as="h2"
                  lines={headlineLines}
                  className="text-4xl md:text-7xl text-center"
                  moveDuration={2}
                  clipDuration={3}
                />
              </div>
              <div className="w-full flex-1 flex items-center justify-center gap-12 md:gap-24">
                <div className="group flex-1 flex flex-col items-center justify-center gap-4">
                  <RevealClipText
                    as="p"
                    lines={["Opción A"]}
                    className="text-center text-2xl"
                    moveDuration={2}
                    clipDuration={3}
                  />
                  <motion.picture
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: 1,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="w-80 h-40 inline-flex border border-cb group-hover:border-brand-50 rounded-2xl p-14 transition ease-in-out duration-500"
                  >
                    <img
                      className="invert"
                      src="/icons/logo-antiguo.svg"
                      alt="logo antiguo"
                    />
                  </motion.picture>
                </div>
                <div className="group flex-1 flex flex-col items-center justify-center gap-4">
                  <RevealClipText
                    as="p"
                    lines={["Opción B"]}
                    className="text-center text-2xl"
                    moveDuration={2}
                    clipDuration={3}
                  />
                  <motion.picture
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: 1,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="w-80 h-40 inline-flex border border-cb group-hover:border-brand-50 rounded-2xl p-13 transition ease-in-out duration-500"
                  >
                    <img src="/icons/logo-nuevo.svg" alt="logo nuevo" />
                  </motion.picture>
                </div>
              </div>

              <div className="w-full flex items-center justify-between">
                <Button variant="arrow" back onClick={() => setStep(2)}>
                  Volver
                </Button>
                <Button variant="arrow">Registrar</Button>
              </div>

              <RevealClipText
                as="p"
                lines={[
                  "Las votaciones están siendo monitoreadas y revisadas por la prestigiosa firma de servicio y auditoría PricewaterhouseCoopers (PwC), todo con el objetivo de brindar confianza a nuestros votantes.",
                ]}
                className="text-center text-xs opacity-80 w-full"
                moveDuration={2}
                clipDuration={3}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </>
    </motion.section>
  );
};

function SummaryItem({ label, value }) {
  return (
    <div className="space-y-2 rounded-2xl border border-brand-50/10 bg-brand-950/35 p-4">
      <p className="text-[10px] uppercase tracking-[0.22em] text-brand-50/45">
        {label}
      </p>
      <p className="text-sm text-brand-50">{value}</p>
    </div>
  );
}
