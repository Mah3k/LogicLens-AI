import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import "./Button.css";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  full = false,
  onClick,
  type = "button",
  className = "",
}) {
  return (
    <motion.button
      type={type}
      className={`btn btn-${variant} btn-${size} ${full ? "btn-full" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
    >
      {loading ? (
        <Loader2 className="btn-spinner" size={16} />
      ) : (
        <>
          {Icon && <Icon size={16} />}
          <span>{children}</span>
          {IconRight && <IconRight size={16} />}
        </>
      )}
    </motion.button>
  );
}
