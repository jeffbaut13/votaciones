import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, RefreshCcw, AlertCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import cityMunicipalityData from "@/data/colombia-cities-municipios.json";

const TOTAL_STEPS = 4;

const CITY_OPTIONS = cityMunicipalityData;

const DOCUMENT_TYPES = ["Cédula de ciudadanía", "Cédula de extranjería"];

const COUNTRY_CODES = ["+57", "+1", "+52", "+34"];

const OTP_STATUS_TO_ROUTE = {
  ya_voto: "/votacion/estado/ya-voto",
  habilitado: "/votacion/estado/habilitado",
  pendiente: "/votacion/estado/pendiente",
  nuevo: "/votacion/estado/nuevo",
};

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isNameValid(value) {
  // Solo letras, espacios y acentos
  return /^[a-zA-Zá-ýÁ-Ý\s]+$/.test(value);
}

function isDocumentValid(value) {
  // Solo dígitos, mínimo 4
  return /^\d{4,}$/.test(value);
}

function isPhoneValid(value) {
  // Exactamente 10 dígitos
  return /^\d{10}$/.test(value);
}

function formatCountdown(seconds) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function normalizeText(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatPhoneDisplay(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  const first = digits.slice(0, 3);
  const second = digits.slice(3, 6);
  const third = digits.slice(6, 10);

  return [first, second, third].filter(Boolean).join(" ");
}

function DotIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-6">
      {Array.from({ length: TOTAL_STEPS }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;

        return (
          <motion.span
            key={`dot-${stepNumber}`}
            layout
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={`h-3 rounded-full ${
              isActive
                ? "w-8 bg-brand-50/70"
                : "w-3 border border-cb bg-brand-100"
            }`}
          />
        );
      })}
    </div>
  );
}

function StepContainer({ children, stepKey }) {
  return (
    <motion.div
      key={stepKey}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex min-h-136 w-full max-w-3xl flex-col justify-between px-6 py-10 md:px-10 md:py-14"
    >
      {children}
    </motion.div>
  );
}

function LineInput({
  className = "",
  hasError = false,
  errorMessage = "",
  ...props
}) {
  return (
    <div className="relative">
      <input
        {...props}
        autoComplete="nope"
        spellCheck="false"
        data-lpignore="true"
        data-form-type="other"
        className={`w-full border-b bg-transparent pb-3 pr-10 text-4xl leading-none text-brand-50 outline-none transition placeholder:text-brand-50/55 focus:border-brand-50 ${
          hasError ? "border-accent" : "border-cb"
        } ${className}`}
      />
      {hasError && (
        <AlertCircle className="absolute right-0 top-0.5 h-7 w-7 text-accent" />
      )}
      {hasError && errorMessage && (
        <p className="mt-2 text-sm text-accent">{errorMessage}</p>
      )}
    </div>
  );
}

function UnderlineSelect({
  value,
  onChange,
  options,
  placeholder,
  hasError = false,
  errorMessage = "",
}) {
  return (
    <div>
      <div
        className={`relative border-b pb-3 ${hasError ? "border-accent" : "border-cb"}`}
      >
        <select
          value={value}
          onChange={onChange}
          autoComplete="nope"
          data-lpignore="true"
          className="w-full appearance-none bg-transparent pr-10 text-4xl leading-none text-brand-50 outline-none"
        >
          <option value="" className="bg-brand-100 text-brand-50/55">
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-brand-100 text-brand-50"
            >
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          className={`pointer-events-none absolute right-0 top-1 h-7 w-7 transition ${
            hasError ? "text-accent" : "text-brand-50/75"
          }`}
        />
        {hasError && (
          <AlertCircle className="pointer-events-none absolute right-10 top-1 h-7 w-7 text-accent" />
        )}
      </div>
      {hasError && errorMessage && (
        <p className="mt-2 text-sm text-accent">{errorMessage}</p>
      )}
    </div>
  );
}

function SearchableCitySelect({
  value,
  options,
  onSelect,
  placeholder,
  hasError = false,
  onBlur,
  errorMessage = "",
}) {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value || "");

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    const term = normalizeText(query.trim());

    if (!term) {
      return options.slice(0, 140);
    }

    return options
      .filter((option) => {
        const city = normalizeText(option.municipality);
        const department = normalizeText(option.department);
        const label = normalizeText(option.label);
        return (
          city.includes(term) ||
          department.includes(term) ||
          label.includes(term)
        );
      })
      .slice(0, 140);
  }, [options, query]);

  const handleSelect = (option) => {
    setQuery(option.label);
    onSelect(option.label);
    setIsOpen(false);
    onBlur?.();
  };

  return (
    <div>
      <div ref={containerRef} className="relative">
        <div
          className={`relative border-b pb-3 ${hasError ? "border-accent" : "border-cb"}`}
        >
          <input
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onBlur={() => {
              window.setTimeout(() => {
                onBlur?.();
              }, 120);
            }}
            placeholder={placeholder}
            autoComplete="nope"
            spellCheck="false"
            data-lpignore="true"
            data-form-type="other"
            className="w-full bg-transparent pr-10 text-4xl leading-none text-brand-50 outline-none placeholder:text-brand-50/55"
          />
          <ChevronDown
            className={`pointer-events-none absolute right-0 top-1 h-7 w-7 transition ${
              hasError ? "text-accent" : "text-brand-50/75"
            } ${isOpen ? "rotate-180" : "rotate-0"}`}
          />
          {hasError && (
            <AlertCircle className="pointer-events-none absolute right-10 top-1 h-7 w-7 text-accent" />
          )}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 right-0 top-full z-20 mt-3 overflow-hidden rounded-2xl border border-cb bg-brand-100"
            >
              <div className="max-h-72 overflow-y-auto">
                {filteredOptions.length ? (
                  filteredOptions.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSelect(option)}
                      className="flex w-full items-center justify-between gap-6 border-b border-cb px-4 py-3 text-left text-lg text-brand-50 transition hover:bg-brand-50/10"
                    >
                      <span>{option.municipality}</span>
                      <span className="text-sm text-brand-50/60">
                        {option.department}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-5 text-lg text-brand-50/70">
                    No hay resultados para tu busqueda.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {hasError && errorMessage && (
        <p className="mt-2 text-sm text-accent">{errorMessage}</p>
      )}
    </div>
  );
}

export const Steps = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [countdown, setCountdown] = useState(180);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    documentType: "",
    documentNumber: "",
    email: "",
    countryCode: "+57",
    phone: "",
  });
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [touched, setTouched] = useState({});
  const otpRefs = useRef([]);

  useEffect(() => {
    if (step !== 4 || countdown <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [step, countdown]);

  const stepErrors = useMemo(() => {
    const errors = {
      firstName: "",
      lastName: "",
      city: "",
      documentType: "",
      documentNumber: "",
      email: "",
      phone: "",
    };

    if (!formData.firstName.trim()) {
      errors.firstName = "Para continuar, debes escribir tu nombre";
    } else if (!isNameValid(formData.firstName.trim())) {
      errors.firstName = "Para continuar, solo se permiten letras y espacios.";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Para continuar, debes escribir tu apellido";
    } else if (!isNameValid(formData.lastName.trim())) {
      errors.lastName = "Para continuar, solo se permiten letras y espacios.";
    }

    if (!formData.city.trim()) {
      errors.city = "Para continuar, necesitamos saber tu ciudad de residencia";
    }

    if (!formData.documentType.trim()) {
      errors.documentType =
        "Para continuar, necesitamos saber el tipo de documento.";
    }

    if (!formData.documentNumber.trim()) {
      errors.documentNumber =
        "Para continuar, necesitamos saber tu número de documento";
    } else if (!isDocumentValid(formData.documentNumber.trim())) {
      errors.documentNumber =
        "Para continuar, el número de documento debe tener al menos 4 dígitos sin caracteres especiales.";
    }

    if (!formData.email.trim()) {
      errors.email = "Para continuar, debes ingresar tu correo electrónico";
    } else if (!isEmailValid(formData.email.trim())) {
      errors.email =
        "Para continuar debes ingresar un correo válido, incluir @ y dominio.com";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Para continuar, debes ingresar un número de celular";
    } else if (!isPhoneValid(formData.phone.trim())) {
      errors.phone = "El número debe tener exactamente 10 dígitos.";
    }

    return errors;
  }, [formData]);

  const isStepValid = useMemo(() => {
    if (step === 1) {
      return !stepErrors.firstName && !stepErrors.lastName && !stepErrors.city;
    }

    if (step === 2) {
      return !stepErrors.documentType && !stepErrors.documentNumber;
    }

    if (step === 3) {
      return !stepErrors.email && !stepErrors.phone;
    }

    return otpValues.every((value) => value.length === 1);
  }, [step, stepErrors, otpValues]);

  const updateField = (key, value) => {
    let cleanValue = value;

    if (key === "firstName" || key === "lastName") {
      // Solo letras, espacios y acentos
      cleanValue = value.replace(/[^a-zA-Zá-ýÁ-Ý\s]/g, "");
    } else if (key === "documentNumber") {
      // Solo dígitos
      cleanValue = value.replace(/\D/g, "");
    } else if (key === "phone") {
      // Solo dígitos, máximo 10
      cleanValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((current) => ({
      ...current,
      [key]: cleanValue,
    }));
  };

  const touch = (key) => {
    setTouched((current) => ({ ...current, [key]: true }));
  };

  const markStepAsTouched = () => {
    if (step === 1) {
      setTouched((current) => ({
        ...current,
        firstName: true,
        lastName: true,
        city: true,
      }));
      return;
    }

    if (step === 2) {
      setTouched((current) => ({
        ...current,
        documentType: true,
        documentNumber: true,
      }));
      return;
    }

    if (step === 3) {
      setTouched((current) => ({ ...current, email: true, phone: true }));
    }
  };

  const handleNext = () => {
    if (step < 4 && !isStepValid) {
      markStepAsTouched();
      return;
    }

    if (step < 4) {
      const nextStep = step + 1;
      setStep(nextStep);

      if (nextStep === 4) {
        setCountdown(180);
        window.requestAnimationFrame(() => {
          otpRefs.current[0]?.focus();
        });
      }
      return;
    }

    const statusFromQuery = searchParams.get("otpStatus");
    const mockBackendStatus = statusFromQuery || "nuevo";
    const targetRoute = OTP_STATUS_TO_ROUTE[mockBackendStatus];

    if (targetRoute) {
      navigate(targetRoute);
    }
  };

  const handlePrev = () => {
    setStep((current) => Math.max(1, current - 1));
  };

  const handleOtpChange = (index, rawValue) => {
    const cleanValue = rawValue.replace(/\D/g, "").slice(-1);

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
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");

    if (!pasted.length) {
      return;
    }

    const next = ["", "", "", "", "", ""];
    pasted.forEach((char, index) => {
      next[index] = char;
    });

    setOtpValues(next);

    const nextFocusIndex = Math.min(pasted.length, 5);
    window.requestAnimationFrame(() => {
      otpRefs.current[nextFocusIndex]?.focus();
    });
  };

  const resendOtp = () => {
    setCountdown(180);
    setOtpValues(["", "", "", "", "", ""]);
    window.requestAnimationFrame(() => {
      otpRefs.current[0]?.focus();
    });
  };

  const sharedLayout = (
    <div className="mt-12 space-y-8 md:mt-16">
      <DotIndicator currentStep={step} />
      <div
        className={`flex items-center ${step === 1 ? "justify-end" : "justify-between"}`}
      >
        {step > 1 ? (
          <Button variant="secondary" size="xl" onClick={handlePrev}>
            Volver
          </Button>
        ) : (
          <div />
        )}

        <Button variant="secondary" size="xl" onClick={handleNext}>
          Siguiente
        </Button>
      </div>
    </div>
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex h-full w-full max-w-5xl items-center"
    >
      <AnimatePresence mode="wait">
        {step === 1 && (
          <StepContainer stepKey="step-1">
            <div className="space-y-10">
              <LineInput
                placeholder="Nombres"
                value={formData.firstName}
                onChange={(event) =>
                  updateField("firstName", event.target.value)
                }
                onBlur={() => touch("firstName")}
                hasError={Boolean(touched.firstName && stepErrors.firstName)}
                errorMessage={stepErrors.firstName}
              />
              <LineInput
                placeholder="Apellidos"
                value={formData.lastName}
                onChange={(event) =>
                  updateField("lastName", event.target.value)
                }
                onBlur={() => touch("lastName")}
                hasError={Boolean(touched.lastName && stepErrors.lastName)}
                errorMessage={stepErrors.lastName}
              />
              <SearchableCitySelect
                value={formData.city}
                options={CITY_OPTIONS}
                onSelect={(selectedCity) => updateField("city", selectedCity)}
                onBlur={() => touch("city")}
                placeholder="Ciudad de residencia"
                hasError={Boolean(touched.city && stepErrors.city)}
                errorMessage={stepErrors.city}
              />
            </div>

            {sharedLayout}
          </StepContainer>
        )}

        {step === 2 && (
          <StepContainer stepKey="step-2">
            <div className="space-y-10">
              <UnderlineSelect
                value={formData.documentType}
                onChange={(event) =>
                  updateField("documentType", event.target.value)
                }
                options={DOCUMENT_TYPES}
                placeholder="Tipo de documento"
                hasError={Boolean(
                  touched.documentType && stepErrors.documentType,
                )}
                errorMessage={stepErrors.documentType}
              />
              <LineInput
                placeholder="Número de documento"
                value={formData.documentNumber}
                onChange={(event) =>
                  updateField("documentNumber", event.target.value)
                }
                onBlur={() => touch("documentNumber")}
                hasError={Boolean(
                  touched.documentNumber && stepErrors.documentNumber,
                )}
                errorMessage={stepErrors.documentNumber}
              />
            </div>

            {sharedLayout}
          </StepContainer>
        )}

        {step === 3 && (
          <StepContainer stepKey="step-3">
            <div className="space-y-10">
              <LineInput
                type="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={(event) => updateField("email", event.target.value)}
                onBlur={() => touch("email")}
                hasError={Boolean(touched.email && stepErrors.email)}
                errorMessage={stepErrors.email}
              />

              <div>
                <div className="grid grid-cols-[6.5rem_1px_1fr] items-center gap-4 border-b border-cb pb-3">
                  <div className="relative">
                    <select
                      value={formData.countryCode}
                      onChange={(event) =>
                        updateField("countryCode", event.target.value)
                      }
                      autoComplete="nope"
                      data-lpignore="true"
                      className="w-full appearance-none bg-transparent text-4xl leading-none text-brand-50 outline-none"
                    >
                      {COUNTRY_CODES.map((code) => (
                        <option
                          key={code}
                          value={code}
                          className="bg-brand-100 text-brand-50"
                        >
                          {code}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-0 top-1 h-7 w-7 text-brand-50/75" />
                  </div>

                  <span className="h-10 w-px bg-brand-50/25" />

                  <input
                    type="tel"
                    placeholder="300 201 3456"
                    inputMode="numeric"
                    value={formatPhoneDisplay(formData.phone)}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    onBlur={() => touch("phone")}
                    autoComplete="nope"
                    data-lpignore="true"
                    data-form-type="other"
                    className="w-full bg-transparent text-4xl leading-none text-brand-50 placeholder:text-brand-50/55 outline-none"
                  />
                </div>
                {touched.phone && stepErrors.phone && (
                  <p className="mt-2 text-sm text-accent">{stepErrors.phone}</p>
                )}
              </div>
            </div>

            {sharedLayout}
          </StepContainer>
        )}

        {step === 4 && (
          <StepContainer stepKey="step-4">
            <div className="mx-auto mt-8 w-full max-w-3xl space-y-12 text-center">
              <p className="text-4xl leading-tight text-brand-50/80">
                Te hemos enviado un código de seguridad por SMS. Ingrésalo acá:
              </p>

              <div className="flex justify-center gap-3 md:gap-4">
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
                    inputMode="numeric"
                    maxLength={1}
                    autoComplete="nope"
                    data-lpignore="true"
                    data-form-type="other"
                    className="h-20 w-16 rounded-2xl border border-cb bg-brand-100 text-center text-6xl text-brand-50 outline-none transition focus:border-brand-50"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={resendOtp}
                disabled={countdown > 0}
                className="mx-auto inline-flex items-center gap-3 text-3xl text-brand-50/70 transition hover:text-brand-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Volver a enviar SMS en {formatCountdown(countdown)}
                <RefreshCcw className="h-7 w-7" />
              </button>
            </div>

            {sharedLayout}
          </StepContainer>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
