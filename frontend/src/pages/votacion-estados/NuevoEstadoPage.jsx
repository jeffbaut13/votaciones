import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ConfirmVoteModal } from "@/components/shared/ConfirmVoteModal";

const options = [
  {
    id: "logo-antiguo",
    label: "Logo antiguo",
    className: "bg-black",
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
    className: "bg-black",
    content: (
      <img
        src="/icons/logo-nuevo-blanco.svg"
        alt="Inter Rapidisimo logo nuevo"
        className="size-full object-contain"
      />
    ),
  },
];

export function NuevoEstadoPage() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelectOption = (optionId) => {
    setSelectedOption(optionId);

    /* Aca va la funcion de registro de voto anonimo no debe incluir id del usuario, aparte cambiar estado de "ya voto" del usuario */
    /* Luego realizar la redireccion */

    navigate("/registro-de-voto");
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

        <div className="grid max-w-4xl w-full grid-cols-1 gap-8 md:grid-cols-2 justify-items-center">
          {options.map((option) => {
            const isSelected = selectedOption === option.id;
            const shouldInvertSelection = option.id == "logo-antiguo";

            return (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => handleSelectOption(option.id)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`group relative h-56 max-w-100 overflow-hidden rounded-4xl border transition-all duration-300 ${
                  isSelected ? "bg-brand-50 " : option.className
                } ${
                  isSelected
                    ? "border-brand-50"
                    : "border-cb hover:border-brand-50/50  group hover:bg-brand-50"
                }`}
              >
                <div className="relative flex h-full w-full cursor-pointer items-center justify-center px-6">
                  <picture
                    className={`p-6 transition duration-300 group-hover:opacity-0  ${isSelected ? "invert" : ""}`}
                  >
                    {option.content}
                  </picture>

                  <span
                    className={`pointer-events-none absolute text-5xl font-semibold uppercase tracking-wide text-brand-100 opacity-0 transition duration-300 group-hover:opacity-100`}
                  >
                    Votar
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.section>
    </>
  );
}
