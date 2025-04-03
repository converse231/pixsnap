import React from "react";
import { motion } from "framer-motion";

const ActionButton = ({
  onClick,
  children,
  icon,
  variant = "primary",
  disabled = false,
  className = "",
}) => {
  // Determine styles based on variant
  const getButtonStyles = () => {
    const baseStyles =
      "font-bold py-2 px-5 sm:px-7 rounded-full flex items-center justify-center gap-1 sm:gap-2 shadow-lg text-xs sm:text-sm";

    switch (variant) {
      case "primary":
        return `${baseStyles} bg-purple-600 hover:bg-purple-700 text-white`;
      case "danger":
        return `${baseStyles} bg-red-600 hover:bg-red-700 text-white`;
      case "secondary":
        return `${baseStyles} bg-white/10 hover:bg-white/15 text-white/90`;
      case "simple":
        return `${baseStyles} bg-gray-200 hover:bg-gray-300 text-gray-800`;
      default:
        return `${baseStyles} bg-purple-600 hover:bg-purple-700 text-white`;
    }
  };

  return (
    <motion.button
      className={`${getButtonStyles()} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {icon &&
        React.cloneElement(icon, {
          size: 16,
          className: "sm:size-18 md:size-5",
        })}
      <span>{children}</span>
    </motion.button>
  );
};

export default ActionButton;
