import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram } from "lucide-react";
import { FacebookShareButton, WhatsappShareButton } from "react-share";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";

const SHARE_TEXT =
  "Este año Inter Rapidísimo cambiará la imagen con la ayuda de todos los colombianos. Vota en";

const btnClass =
  "inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-100 transition-all duration-300 hover:opacity-80 sm:h-14 sm:w-14";

const iconClass = "h-6 w-6 sm:h-7 sm:w-7";

export const Thankiu = () => {
  const navigate = useNavigate();
  const [copyMessage, setCopyMessage] = useState("");

  const shareUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }

    return "https://eligenuestrologo.com";
  }, []);

  const shareTitle = useMemo(() => SHARE_TEXT, []);

  const showCopyMessage = (message) => {
    setCopyMessage(message);
    window.setTimeout(() => setCopyMessage(""), 1800);
  };

  const copyShareText = async (message) => {
    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT} ${shareUrl}`);
      showCopyMessage(message);
    } catch {
      showCopyMessage(message);
    }
  };

  const handleCopyForInstagram = async () => {
    await copyShareText("Texto copiado. Puedes pegarlo en Instagram.");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto flex h-full w-full max-w-8xl items-center justify-center px-6 py-10 md:px-10"
    >
      <div className="w-full max-w-7xl text-center">
        <h1 className="text-4xl leading-none text-brand-50 sm:text-6xl md:text-8xl">
          ¡Gracias por elegir!
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm text-brand-50/80 sm:mt-7 sm:text-2xl">
          Invita a más personas
          <br />a votar por la opción que más les guste.
        </p>

        <div className="mt-7 flex items-center justify-center gap-4 sm:mt-8 sm:gap-5">
          {/* Facebook */}
          <div className={btnClass}>
            <FacebookShareButton
              url={shareUrl}
              quote={shareTitle}
              beforeOnClick={() =>
                copyShareText("Texto copiado. Puedes pegarlo en Facebook.")
              }
              className="inline-flex items-center justify-center"
              aria-label="Compartir en Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={iconClass}
              >
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </FacebookShareButton>
          </div>

          {/* WhatsApp */}
          <div className={btnClass}>
            <WhatsappShareButton
              url={shareUrl}
              title={shareTitle}
              separator=" - "
              className="inline-flex items-center justify-center"
              aria-label="Compartir en WhatsApp"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={iconClass}
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.012 22l4.974-1.303A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.946 7.946 0 01-4.051-1.11l-.29-.173-3.003.787.803-2.927-.19-.301A7.944 7.944 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
              </svg>
            </WhatsappShareButton>
          </div>

          {/* Instagram – copia al portapapeles */}
          <button
            type="button"
            onClick={handleCopyForInstagram}
            className={btnClass}
            aria-label="Copiar texto para Instagram"
          >
            <Instagram className={iconClass} />
          </button>
        </div>

        <div className="mt-10 flex justify-center sm:mt-14">
          <Button variant="secondary" size="2xl" onClick={() => navigate("/")}>
            Salir
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {copyMessage && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none fixed bottom-8 left-1/2 z-30 -translate-x-1/2 rounded-lg border border-emerald-300/40 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-100 backdrop-blur"
            role="status"
            aria-live="polite"
          >
            {copyMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
