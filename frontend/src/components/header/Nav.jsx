import { usePopOpenStore } from "@/store/video-pop-store";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/votacion", label: "Votar", action: "openPop" },
  { to: "/votacion", label: "Registrarse" },
  { to: "/registro-de-voto", label: "Reporte votaciones" },
  { to: "/terminos-y-condiciones", label: "Términos y condiciones" },
];

export const Nav = ({ isOpen, setIsNavOpen }) => {
  const { openPop } = usePopOpenStore();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="bg-black/40 backdrop-blur-sm fixed z-20 w-full h-dvh top-0 left-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsNavOpen(false)}
            />
            <motion.nav
              className="fixed w-120 pl-12 bg-brand-100 h-dvh right-0 top-0 z-30 flex flex-col items-start justify-center gap-8 shadow-lg"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {links.map((link) => {
                if (link.action === "openPop") {
                  return (
                    <button
                      key={link.label}
                      type="button"
                      onClick={() => {
                        setIsNavOpen(false);
                        openPop();
                      }}
                      className="rounded-lg px-4 py-2 text-4xl text-brand-50/40 transition hover:bg-brand-50/4 hover:text-brand-50"
                    >
                      {link.label}
                    </button>
                  );
                }

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsNavOpen(false)}
                    className={({ isActive }) =>
                      `rounded-lg px-4 py-2 text-4xl transition ${
                        isActive
                          ? " text-brand-50"
                          : "text-brand-50/40 hover:text-brand-50 hover:bg-brand-50/4"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                );
              })}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
