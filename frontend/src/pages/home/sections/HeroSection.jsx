import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="grid gap-10 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-20">
      <div>
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-xs uppercase tracking-[0.35em] text-brand-300">
          Votacion con OTP
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="max-w-3xl font-display text-5xl leading-tight text-brand-50 md:text-7xl"
        >
          Decide si la marca evoluciona o conserva su identidad actual.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="mt-6 max-w-2xl text-lg leading-8 text-brand-100/80"
        >
          Flujo simple, validado por telefono y preparado para operar con backend desacoplado, Twilio y Firebase.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="mt-8 flex flex-wrap gap-4">
          <Link to="/votacion">
            <Button>
              Empezar votacion <ArrowRight className="ml-2 inline-block h-4 w-4" />
            </Button>
          </Link>
          <Link to="/registro-de-votaciones">
            <Button variant="ghost">Ver registros</Button>
          </Link>
        </motion.div>
      </div>
      <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
        <div className="space-y-5">
          {[
            "Validacion de telefono",
            "OTP con backend propio",
            "Persistencia de paso de flujo",
            "Registro de voto y resumen",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl bg-black/10 px-4 py-4">
              <BadgeCheck className="h-5 w-5 text-accent" />
              <span className="text-sm text-brand-50">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
