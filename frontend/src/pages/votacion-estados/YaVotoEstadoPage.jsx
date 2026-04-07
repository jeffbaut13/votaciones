import { motion } from "framer-motion";

export function YaVotoEstadoPage() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex h-full w-full max-w-6xl items-center justify-center px-8 py-16"
    >
      <p className="text-4xl text-brand-50/75">Estado: YA_VOTO</p>
    </motion.section>
  );
}
