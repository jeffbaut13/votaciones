<<<<<<< HEAD
export default function Button({
  children,
  loading = false,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          Procesando...
        </span>
      ) : (
        children
      )}
    </button>
=======
import {
  AnimatePresence,
  delay,
  motion,
  scale,
  useAnimationControls,
} from "framer-motion";
import { cn } from "@/utils/class-names";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Boton reutilizable con variantes visuales y animacion opcional de flecha.
 *
 * Variantes disponibles:
 * - primary: fondo claro y texto oscuro.
 * - secondary: borde claro con fondo transparente.
 * - third: estilo minimal sin borde.
 * - arrow: estilo minimal con flecha animada.
 * - ghost: fondo suave con borde tenue.
 *
 * Flujo de animacion de flecha al hacer click:
 * 1) Sale del centro hacia un lado (to).
 * 2) Se reposiciona fuera de pantalla del lado opuesto (from).
 * 3) Entra de nuevo al centro (quiet).
 *
 * Ejemplos de uso:
 * <Button variant="primary">Ver mas</Button>
 * <Button variant="secondary">Secundario</Button>
 * <Button variant="third">Terciario</Button>
 * <Button variant="arrow">Continuar</Button>
 * <Button variant="arrow" back>Atras</Button>
 * <Button variant="primary" disabled>Disabled</Button>
 *
 * @param {object} props
 * @param {() => void} [props.onClick] Callback de click.
 * @param {import("react").ReactNode} props.children Contenido del boton.
 * @param {string} [props.className] Clases extra para personalizacion.
 * @param {"sm" | "base" | "xl"} [props.size="xl"] Tamano tipografico.
 * @param {boolean} [props.disabled=false] Estado deshabilitado.
 * @param {"primary" | "secondary" | "third" | "arrow"} [props.variant="primary"] Variante visual.
 * @param {boolean} [props.back=false] Invierte direccion/icono de flecha.
 */

export function Button({
  onClick,
  children,
  className,
  size = "xl",
  disabled = false,
  variant = "primary",
  back = false,
  ...props
}) {
  const arrowControls = useAnimationControls();

  const arrow = variant === "arrow";
  const noPadding = variant === "third" || arrow;

  const types = () => {
    switch (variant) {
      case "primary":
        return "bg-brand-50 text-brand-950 hover:!opacity-70";
      case "secondary":
        return "border border-brand-50/30 text-brand-50 hover:bg-brand-50 hover:text-brand-100";
      case "third":
        return "text-brand-50/60 hover:text-brand-50";
      case "arrow":
        return "text-brand-50/60 hover:text-brand-50";
      default:
        return "";
    }
  };

  const sizes = () => {
    switch (size) {
      case "sm":
        return "text-sm";
      case "base":
        return "text-base";
      case "xl":
        return "text-xl";
      case "2xl":
        return "text-2xl";
      default:
        return "";
    }
  };

  const disabledStyles =
    disabled && "disabled:cursor-not-allowed disabled:opacity-60";

  const transition = `transition-all ease-in-out duration-500`;
  const baseStyle = `cursor-pointer rounded-lg font-ppmedium font-semibold overflow-hidden flex items-center justify-center ${sizes()} ${disabledStyles} ${transition}  ${noPadding ? "" : "px-7 py-1.5"}`;

  const handleClick = async () => {
    onClick && onClick();

    if (!arrow && !back) {
      return;
    }

    await arrowControls.start("to");
    arrowControls.set("from");
    await arrowControls.start("quiet");
  };
  const variants = {
    quiet: {
      x: 0,
      scale: 1,
      opacity: 1,
      transition: {
        x: { ease: "easeOut" },
        opacity: { ease: "easeOut" },
        scale: { duration: 0.4, ease: "anticipate" },
      },
    },
    from: { x: back ? "200%" : "-200%", scale: 0, opacity: 0 },
    to: {
      x: back ? "-200%" : "200%",
      scale: 0,
      opacity: 0,
      transition: { duration: 0.45, ease: "easeIn" },
    },
  };

  return (
    <motion.button
      onClick={handleClick}
      className={cn(baseStyle, types(), className)}
      disabled={disabled}
      {...props}
    >
      <AnimatePresence>
        {!back ? (
          <>
            {children}
            {arrow && (
              <motion.span className="w-8 h-8 overflow-hidden relative inline-block">
                <motion.span
                  variants={variants}
                  initial="quiet"
                  animate={arrowControls}
                  className={`overflow-hidden inline-flex items-center justify-center w-full h-full`}
                >
                  <ArrowRight className={`absolute w-full h-auto`} />
                </motion.span>
              </motion.span>
            )}
          </>
        ) : (
          <>
            <motion.span className="w-8 h-8 overflow-hidden relative inline-block">
              <motion.span
                variants={variants}
                initial="quiet"
                animate={arrowControls}
                className={`overflow-hidden inline-flex items-center justify-center w-full h-full`}
              >
                <ArrowLeft className={`absolute w-full h-auto`} />
              </motion.span>
            </motion.span>
            {children}
          </>
        )}
      </AnimatePresence>
    </motion.button>
>>>>>>> origin/front
  );
}
