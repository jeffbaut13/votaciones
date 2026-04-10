import { useState } from "react";
import { motion } from "framer-motion";
import { Prospero } from "../ui/Prospero";
import { Nav } from "./Nav";
import { Link } from "react-router-dom";

export const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  return (
    <>
      <header className="sticky w-full z-1 top-0 bg-brand-950/85 h-auto">
        <div className="full flex items-center justify-between px-6">
          <div className="full flex items-center justify-between border-b border-cb py-4">
            <Link
              to="/"
              className="cursor-pointer w-fit h-full flex gap-2 max-h-7 items-center"
            >
              <Prospero nuevo={false} />
              <span className="w-px h-full bg-cb inline-flex" />
              <Prospero />
            </Link>

            <BurgerAnimation isActive={isNavOpen} onToggle={handleNav} />
          </div>
        </div>
        <Nav isOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
      </header>
    </>
  );
};

const transition = { duration: 0.25, ease: "easeInOut" };

const BurgerAnimation = ({ isActive, onToggle }) => {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label={isActive ? "Cerrar menu" : "Abrir menu"}
      aria-expanded={isActive}
      className="group cursor-pointer relative z-40 inline-flex h-8 w-6 items-center justify-between"
      whileTap={{ scale: 0.92 }}
    >
      {Array.from({ length: 3 }).map((_, index) => {
        const animation =
          index === 0
            ? isActive
              ? { rotate: 45, y: 0 }
              : { rotate: 0, y: -8 }
            : index === 1
              ? isActive
                ? { opacity: 0, scaleX: 0 }
                : { opacity: 1, scaleX: 1 }
              : isActive
                ? { rotate: -45, y: 0 }
                : { rotate: 0, y: 8 };

        return (
          <motion.span
            key={index}
            className="absolute h-px w-full bg-cb group-hover:bg-brand-50 transition-all ease-in-out"
            animate={animation}
            transition={transition}
          />
        );
      })}
    </motion.button>
  );
};
