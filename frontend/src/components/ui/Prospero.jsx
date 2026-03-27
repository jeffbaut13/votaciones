import { Icono } from "./Icono";

export const Prospero = ({ nuevo = true, size = "sm", invert = true }) => {
  const src = nuevo
    ? "/icons/nuevo-prospero.svg"
    : "/icons/antiguo-prospero.svg";
  return (
    <Icono
      size={size}
      color={invert ? "primary" : "secondary"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <img src={src} alt="Logo de Inter Rapidísimo" />
    </Icono>
  );
};
