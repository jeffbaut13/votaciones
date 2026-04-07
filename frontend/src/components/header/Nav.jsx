import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/votacion", label: "Votar" },
  { to: "/votacion", label: "Registrarse" },
  { to: "/registro-de-voto", label: "Reporte votaciones" },
];

export const Nav = ({ isOpen, setIsNavOpen }) => {
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
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsNavOpen(false)}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-4xl transition ${
                      isActive
                        ? " text-brand-50"
                        : "text-brand-50/40 hover:text-brand-50 hover:bg-brand-50/10"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
