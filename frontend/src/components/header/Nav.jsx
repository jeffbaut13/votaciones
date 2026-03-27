import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/auth-sms", label: "Auth SMS" },
  { to: "/votacion", label: "Votacion" },
  { to: "/registro-de-votaciones", label: "Registros" },
 
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
              className="fixed w-96 bg-brand-100 h-dvh right-0 top-0 z-30 flex flex-col items-center justify-center gap-8 p-6 shadow-lg"
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
                    `rounded-full px-4 py-2 transition ${
                      isActive
                        ? "bg-brand-50 text-brand-100"
                        : "text-brand-50 hover:bg-brand-50/10"
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
