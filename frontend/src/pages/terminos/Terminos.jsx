import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Icono } from "@/components/ui/Icono";
import { Button } from "@/components/ui/Button";
import terminos from "@/data/terminos.json";

export const Terminos = () => {
  const [openItem, setOpenItem] = useState(1);
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/");
  };

  return (
    <section className="terminos-scroll mx-auto flex h-full w-full max-w-8xl flex-col items-center overflow-y-auto px-6 pb-14 pt-10 text-brand-50 md:px-10 md:pb-16 md:pt-14">
      <div className="w-full max-w-4xl pt-14 sm:pt-16">
        <h1 className="text-center font-ppmedium text-3xl leading-tight tracking-tight text-brand-50 sm:text-4xl md:text-[2.65rem]">
          Términos y condiciones del proceso de votación
          <br />
          <span className="font-ppmedium">
            “Elige nuestro logo” - Inter Rapidísimo
          </span>
        </h1>

        <div className="mx-auto mt-12 w-full max-w-3xl sm:mt-14">
          {terminos.map((item) => {
            const isOpen = openItem === item.id;

            return (
              <article key={item.id} className="border-b border-cb">
                <button
                  type="button"
                  onClick={() => setOpenItem(isOpen ? null : item.id)}
                  className="cursor-pointer flex w-full items-center justify-between gap-4 py-5 text-left sm:py-6"
                  aria-expanded={isOpen}
                >
                  <span className="font-ppmedium text-2xl leading-tight text-brand-50 sm:text-3xl">
                    {item.id}. {item.title}
                  </span>

                  <Icono
                    size="sm"
                    color="primary"
                    customclass={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
                    aria-hidden="true"
                  >
                    <ChevronDown className="size-6 text-brand-50/70" />
                  </Icono>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key={`termino-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div
                        className="pb-6 pr-8 text-base leading-relaxed text-brand-50/80 sm:pb-8 sm:pr-12 sm:text-lg [&_strong]:font-ppbold [&_strong]:font-bold [&_strong]:text-brand-50 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center sm:mt-12">
          <Button onClick={handleGoBack} variant="secondary" size="2xl">
            Volver
          </Button>
        </div>
      </div>
    </section>
  );
};
