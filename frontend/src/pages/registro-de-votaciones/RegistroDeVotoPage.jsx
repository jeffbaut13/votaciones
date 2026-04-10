import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function RegistroDeVotoPage() {
  const navigate = useNavigate();

  const voteData = {
    options: [
      {
        id: "logo-antiguo",
        label: "Rapidisimo",
        percentage: 13.6,
        votes: 1829262,
        logo: "/icons/logo-antiguo-blanco.svg",
      },
      {
        id: "logo-nuevo",
        label: "Inter Rapidisimo",
        percentage: 86.4,
        votes: 11621193,
        logo: "/icons/logo-nuevo-blanco.svg",
      },
    ],
    totalVotes: 13450455,
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex h-full w-full flex-col items-center justify-center px-6 py-16 md:px-10"
    >
      <div className="w-full max-w-4xl space-y-16">
        <div className="text-center">
          <h1 className="text-6xl leading-tight text-brand-50">
            Hemos registrado tu voto
          </h1>
        </div>

        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {voteData.options.map((option) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center space-y-6"
              >
                <div className="text-7xl font-bold text-brand-50">
                  {option.percentage}
                  <span className="text-5xl">%</span>
                </div>

                <div className="text-lg uppercase tracking-wider text-brand-50">
                  {option.votes.toLocaleString("es-CO")} VOTOS
                </div>

                <div className="h-32 w-full rounded-2xl flex items-center justify-center">
                  <picture className="w-40 h-auto">
                    <img
                      src={option.logo}
                      alt={option.label}
                      className="size-full object-contain"
                    />
                  </picture>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-6xl leading-tight text-brand-50">
              Votos totales:{" "}
              <span className="font-bold">
                {voteData.totalVotes.toLocaleString("es-CO")}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button variant="secondary" size="xl">
            Descargar certificado
          </Button>
          <Button variant="secondary" size="xl">
            Detalle votaciones
          </Button>
          <Button
            variant="secondary"
            size="xl"
            onClick={() => navigate("/success")}
          >
            Finalizar
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
