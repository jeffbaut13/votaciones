import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function ConfirmVoteModal({ isOpen, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full min-h-96 flex flex-col items-center justify-center max-w-3xl rounded-3xl border border-cb py-12 text-center"
          >
            <h2 className="text-5xl leading-tight text-brand-50">
              ¿Estás seguro de tu voto?
            </h2>

            <div className="mt-12 flex flex-col gap-14 sm:flex-row sm:justify-center">
              <Button variant="secondary" size="xl" onClick={onCancel}>
                No
              </Button>
              <Button variant="secondary" size="xl" onClick={onConfirm}>
                Sí
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
