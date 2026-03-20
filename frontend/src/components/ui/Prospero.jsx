import { Icono } from "./Icono";

export const Prospero = ({ nuevo = true, size = "xs", invert = true }) => {
  const src = nuevo
    ? "/icons/nuevo-prospero.svg"
    : "/icons/antiguo-prospero.svg";
  return (
    <Icono
      Icon={<img src={src} alt="Logo de Inter Rapidísimo" />}
      size={size}
      color={invert ? "secondary" : "primary"}
      props={{
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5 },
      }}
    />
  );
};
