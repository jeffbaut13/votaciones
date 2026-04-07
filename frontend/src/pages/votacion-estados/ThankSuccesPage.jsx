import { motion } from "framer-motion";

export function ThankSuccesPage() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex h-full w-full items-center justify-center px-6 py-16 md:px-10"
    >
      <div className="text-center">
        <h1 className="text-6xl leading-tight text-brand-50 md:text-7xl">
          Gracias por elegir
        </h1>
      </div>
    </motion.section>
  );
}
