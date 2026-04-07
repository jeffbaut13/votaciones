import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function RegistroDeVotoPage() {
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
          <h1 className="text-5xl leading-tight text-brand-50">
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

                <div className="text-sm uppercase tracking-wider text-brand-50/70">
                  {option.votes.toLocaleString("es-CO")} VOTOS
                </div>

                <div className="h-32 w-full rounded-2xl border border-brand-50/20 bg-brand-100/50 flex items-center justify-center">
                  <img
                    src={option.logo}
                    alt={option.label}
                    className="h-16 w-auto"
                  />
                </div>

                <p className="text-center text-xl text-brand-50">
                  {option.label}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="border-t border-brand-50/20 pt-12 text-center">
            <p className="text-4xl text-brand-50">
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
          <Button variant="secondary" size="xl">
            Finalizar
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
