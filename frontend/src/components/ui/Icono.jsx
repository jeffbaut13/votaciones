import { cloneElement, isValidElement } from "react";
import { motion } from "framer-motion";
export const Icono = ({ Icon, size = "md", color = "primary", props }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-full";
  const sizeTheme = () => {
    switch (size) {
      case "xs":
        return "size-4";
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

  const renderIcon = () => {
    if (isValidElement(Icon)) {
      const existingClassName = Icon.props?.className ?? "";
      return cloneElement(Icon, {
        className: `${iconClassName} ${existingClassName}`.trim(),
      });
    }

    if (typeof Icon === "function") {
      const IconComponent = Icon;
      return <IconComponent className={iconClassName} />;
    }

    return null;
  };

  return (
    <motion.i {...props} className={`${sizeTheme()}  ${baseStyle}`}>
      {renderIcon()}
    </motion.i>
  );
};
