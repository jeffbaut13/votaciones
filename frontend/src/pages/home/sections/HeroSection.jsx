import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { usePopOpenStore } from "@/store/video-pop-store";

export function HeroSection() {
  const [first, setFirst] = useState(true);

  const { openPop } = usePopOpenStore();
  return (
    <>
      <section className="size-full flex justify-center gap-24 items-center flex-col">
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="text-4xl leading-15 text-center text-brand-50 md:text-6xl"
        >
          38 años nos trajeron hasta aquí <br className="hidden md:block" />
          hoy tu voto tiene el poder de elegir cómo nos veremos
        </motion.h1>

        
        <Button
          aria-label="Ver más"
          size="2xl"
          variant="primary"
          onClick={() => openPop()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.24 }}
        >
          Vota ahora
        </Button>
      </section>
      {/*   <div
        data-cursor="play"
        data-cursor-size="xs"
        data-cursor-icon={first ? "play" : "pause"}
        className=" rounded-4xl border border-white/10 bg-white/5 p-8"
      >
        <div className="space-y-5">
          {[
            "Validacion de telefono",
            "OTP con backend propio",
            "Persistencia de paso de flujo",
            "Registro de voto y resumen",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl bg-black/10 px-4 py-4"
            >
              <BadgeCheck className="h-5 w-5 text-accent" />
              <span className="text-sm text-brand-50">{item}</span>
            </div>
          ))}
        </div>
      </div> */}
    </>
  );
}
