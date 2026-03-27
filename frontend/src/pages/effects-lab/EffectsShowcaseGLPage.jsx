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

export function EffectsShowcaseGLPage({ children }) {
  const isDesktop = useIsDesktop();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden">
      <StarDustBackgroundGL
        className="opacity-100"
        particleMultiplier={0.5}
        reducedMotion={prefersReducedMotion}
        magnetRadius={isDesktop ? 280 : 0}
        magnetStrength={isDesktop ? 0.34 : 0}
        driftStrength={prefersReducedMotion ? 0.4 : 1}
      />
      <MagneticCursor
        disabled={!isDesktop}
        reducedMotion={prefersReducedMotion}
      />
      <main className="relative z-0 mx-auto h-full w-full px-6">{children}</main>
    </div>
  );
}
