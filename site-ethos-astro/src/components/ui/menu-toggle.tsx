import { motion } from "framer-motion";

interface MenuToggleProps {
  open: boolean;
  strokeWidth?: number;
  className?: string;
}

export function MenuToggle({ open, strokeWidth = 2, className = "" }: MenuToggleProps) {
  return (
    <span className={`flex flex-col items-center justify-center gap-[5px] pointer-events-none ${className}`}>
      <motion.span
        className="block bg-current origin-center"
        style={{ width: "18px", height: `${strokeWidth}px`, display: "block" }}
        animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      />
      <motion.span
        className="block bg-current origin-center"
        style={{ width: "18px", height: `${strokeWidth}px`, display: "block" }}
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      />
      <motion.span
        className="block bg-current origin-center"
        style={{ width: "18px", height: `${strokeWidth}px`, display: "block" }}
        animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      />
    </span>
  );
}
