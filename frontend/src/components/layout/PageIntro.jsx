import { motion } from "framer-motion";

export function PageIntro({ title, description }) {
  return (
    <motion.div className="w-full max-w-3xl text-center space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        dangerouslySetInnerHTML={{ __html: title }}
        className="text-4xl md:text-7xl"
      />
      <motion.p
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        dangerouslySetInnerHTML={{ __html: description }}
        className="mt-4 text-2xl"
      />
    </motion.div>
  );
}
