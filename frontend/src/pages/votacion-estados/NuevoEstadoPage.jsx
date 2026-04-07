import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ConfirmVoteModal } from "@/components/shared/ConfirmVoteModal";

function SelectedCardMarks() {
  return (
    <>
      <span className="pointer-events-none absolute left-4 top-4 h-px w-20 rotate-27 bg-brand-100 md:left-5 md:top-5 md:w-28" />
      <span className="pointer-events-none absolute right-4 top-4 h-px w-20 -rotate-27 bg-brand-100 md:right-5 md:top-5 md:w-28" />
      <span className="pointer-events-none absolute bottom-4 left-4 h-px w-20 -rotate-27 bg-brand-100 md:bottom-5 md:left-5 md:w-28" />
      <span className="pointer-events-none absolute bottom-4 right-4 h-px w-20 rotate-27 bg-brand-100 md:bottom-5 md:right-5 md:w-28" />
    </>
  );
}

const options = [
  {
    id: "logo-antiguo",
    label: "Logo antiguo",
    className: "bg-brand-100",
    content: (
      <img
        src="/icons/logo-antiguo-blanco.svg"
        alt="Inter Rapidisimo logo antiguo "
        className="size-full object-contain"
      />
    ),
  },
  {
    id: "logo-nuevo",
    label: "Logo nuevo",
    className: "bg-brand-100",
    content: (
      <img
        src="/icons/logo-nuevo-blanco.svg"
        alt="Inter Rapidisimo logo nuevo"
        className="size-full object-contain"
      />
    ),
  },
  {
    id: "voto-blanco",
    label: "Voto en blanco",
    className: "bg-brand-50 hover:bg-brand-100",
    content: <span className="text-4xl text-brand-100">Voto en blanco</span>,
  },
];

export function NuevoEstadoPage() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSelectOption = (optionId) => {
    setSelectedOption(optionId);
    setShowConfirmModal(true);
  };

  const handleConfirmVote = () => {
    setShowConfirmModal(false);
    navigate("/registro-de-voto");
  };

  const handleCancelVote = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex h-full w-full max-w-8xl flex-col items-center justify-center px-8 py-16 md:px-10"
      >
        <h1 className="mb-14 text-center text-6xl leading-none text-brand-50">
          Elige nuestro logo
        </h1>

        <div className="grid max-w-7xl w-full grid-cols-1 gap-8 md:grid-cols-3">
          {options.map((option) => {
            const isSelected = selectedOption === option.id;
            const shouldInvertSelection =
              isSelected && option.id !== "voto-blanco";

            return (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => handleSelectOption(option.id)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`group relative h-56 overflow-hidden rounded-4xl border transition-all duration-300 ${
                  isSelected ? "bg-brand-50" : option.className
                } ${
                  isSelected
                    ? "border-brand-50"
                    : "border-cb hover:border-brand-50/50 hover:bg-brand-50 group"
                }`}
              >
                {isSelected ? <SelectedCardMarks /> : null}

                <div className="flex h-full w-full cursor-pointer items-center justify-center px-6">
                  <picture
                    className={`p-6 transition group-hover:invert duration-300 ${
                      shouldInvertSelection ? "invert" : ""
                    }`}
                  >
                    {option.content}
                  </picture>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      <ConfirmVoteModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmVote}
        onCancel={handleCancelVote}
      />
    </>
  );
}
