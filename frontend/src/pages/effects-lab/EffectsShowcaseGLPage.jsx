import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";

import { MagneticCursor } from "@/components/effects/MagneticCursor";
import { StarDustBackgroundGL } from "@/components/effects/StarDustBackgroundGL";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Icono } from "@/components/ui/Icono";
import { Prospero } from "@/components/ui/Prospero";

const cardAnimation = {
  hidden: { opacity: 0, y: 36 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: 0.12 * index,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function EffectsShowcaseGLPage() {
  const isDesktop = useIsDesktop();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-[#02040a] text-slate-100 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
      <StarDustBackgroundGL
        className="opacity-100"
        particleMultiplier={1.12}
        reducedMotion={prefersReducedMotion}
        magnetRadius={isDesktop ? 280 : 0}
        magnetStrength={isDesktop ? 0.34 : 0}
        driftStrength={prefersReducedMotion ? 0.4 : 1}
      />
      <MagneticCursor
        disabled={!isDesktop}
        reducedMotion={prefersReducedMotion}
      />
      <div className="pointer-events-none absolute inset-0 z-1 bg-[linear-gradient(180deg,rgba(255,255,255,0.012),rgba(0,0,0,0.08)_24%,rgba(0,0,0,0.18))]" />

      <section className="relative z-10 mx-auto flex w-full flex-col justify-between px-6 py-10 md:px-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-slate-300">
            <Sparkles className="size-3.5" />
            Visual Effects Lab <Prospero />
            <Prospero nuevo={false} />
          </div>
          <h1 className="max-w-4xl font-['Georgia'] text-5xl leading-[0.95] tracking-[-0.04em] text-white md:text-7xl">
            Fondo nebuloso premium con cursor magnetico y respuesta suave.
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
            Esta ruta existe para probar el sistema visual en aislamiento:
            particulas en canvas por capas, atraccion ligera por proximidad y
            cursor custom con API por data attributes.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
          <motion.article
            custom={0}
            initial="hidden"
            animate="visible"
            variants={cardAnimation}
            className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-md md:p-8"
          >
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                data-cursor="play"
                aria-label="Play visual reel"
                className="group inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/8 px-5 py-3 text-sm text-white transition hover:border-white/30 hover:bg-white/12"
              >
                <span className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/8">
                  <Play className="size-4 fill-current" />
                </span>
                Reproducir reel
              </button>
              <a
                href="#cursor-api"
                data-cursor="next"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm text-slate-200 transition hover:border-white/30 hover:bg-white/8"
              >
                Ver API del cursor
                <ArrowRight className="size-4" />
              </a>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Capa lejana",
                  text: "Menos brillo, menos velocidad y mas niebla para sostener profundidad.",
                },
                {
                  title: "Capa media",
                  text: "Da el cuerpo visual de la nube y sostiene la lectura del fondo.",
                },
                {
                  title: "Capa cercana",
                  text: "Ligeramente mas visible y mas sensible al iman del cursor.",
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  data-cursor="view"
                  data-cursor-label="OPEN"
                  className="rounded-[22px] border border-white/10 bg-black/20 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    0{index + 1}
                  </p>
                  <h2 className="mt-5 text-lg text-white">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.article>

          <motion.aside
            custom={1}
            initial="hidden"
            animate="visible"
            variants={cardAnimation}
            id="cursor-api"
            className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md md:p-8"
          >
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">
              Cursor API
            </p>
            <div className="mt-6 space-y-4">
              <div
                data-cursor="drag"
                className="rounded-[20px] border border-dashed border-white/15 bg-white/[0.03] p-5"
              >
                <p className="text-sm text-white">
                  `data-cursor=&quot;drag&quot;`
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Muestra estado de arrastre con label interno y circulo
                  ampliado.
                </p>
              </div>
              <div
                data-cursor="next"
                data-cursor-label="NEXT"
                className="rounded-[20px] border border-dashed border-white/15 bg-white/[0.03] p-5"
              >
                <p className="text-sm text-white">
                  `data-cursor=&quot;next&quot;
                  data-cursor-label=&quot;NEXT&quot;`
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Sobrescribe icono por texto corto sin agregar listeners por
                  componente.
                </p>
              </div>
              <div
                data-cursor="play"
                data-cursor-icon="spark"
                className="rounded-[20px] border border-dashed border-white/15 bg-white/[0.03] p-5"
              >
                <p className="text-sm text-white">
                  `data-cursor=&quot;play&quot;
                  data-cursor-icon=&quot;spark&quot;`
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Permite reutilizar el mismo variant con iconografia distinta.
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>
    </div>
  );
}
