import { cloneElement, isValidElement } from "react";
import { motion } from "framer-motion";

export const Icono = ({
  children,
  size = "md",
  color = "primary",
  customclass,
  onClick,
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded-full";

  const sizeTheme = () => {
    switch (size) {
      case "xs":
        return "size-4";
      case "sm":
        return "size-6";
      case "md":
        return "size-10";
      case "lg":
        return "size-14";
      default:
        return "";
    }
  };

  const colorTheme = () => {
    switch (color) {
      case "primary":
        return "text-brand-50";
      case "secondary":
        return "text-brand-100";
      default:
        return "";
    }
  };

  const iconClassName = `${colorTheme()} size-full inline-flex object-contain`;

  const content = isValidElement(children)
    ? cloneElement(children, {
        className: `${iconClassName} ${children.props.className ?? ""}`.trim(),
      })
    : children;

  return (
    <motion.i
      {...props}
      className={`${sizeTheme()} ${customclass ?? ""} ${baseStyle}`}
      onClick={onClick}
    >
      {content}
    </motion.i>
  );
};
