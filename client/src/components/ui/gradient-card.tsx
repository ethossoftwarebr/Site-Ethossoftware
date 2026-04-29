import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GradientCard({ children, className, onClick }: GradientCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotation({
      x: -(y / rect.height) * 6,
      y: (x / rect.width) * 6,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className={cn("relative rounded-[24px] overflow-hidden cursor-pointer", className)}
      style={{
        backgroundColor: "#0d0d14",
        transformStyle: "preserve-3d",
        boxShadow: "0 -6px 60px 4px rgba(162, 41, 242, 0.18), 0 0 10px 0 rgba(0,0,0,0.5)",
      }}
      animate={{
        y: isHovered ? -6 : 0,
        rotateX: rotation.x,
        rotateY: rotation.y,
      }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
    >
      {/* Glass reflection */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.03) 100%)",
        }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay z-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Purple glow bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-2/3 z-20 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at bottom right, rgba(162,41,242,0.55) -10%, rgba(83,27,140,0) 70%),
            radial-gradient(ellipse at bottom left,  rgba(83,27,140,0.45) -10%, rgba(162,41,242,0) 70%)
          `,
          filter: "blur(36px)",
        }}
        animate={{ opacity: isHovered ? 1 : 0.75 }}
        transition={{ duration: 0.35 }}
      />

      {/* Central glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-2/3 z-[21] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at bottom center, rgba(162,41,242,0.55) -20%, rgba(83,27,140,0) 60%)",
          filter: "blur(40px)",
        }}
        animate={{ opacity: isHovered ? 0.9 : 0.7, y: isHovered ? "8%" : "12%" }}
        transition={{ duration: 0.35 }}
      />

      {/* Bottom border glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1.5px] z-[25] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0.04) 100%)",
        }}
        animate={{
          boxShadow: isHovered
            ? "0 0 18px 3px rgba(162,41,242,0.85), 0 0 28px 5px rgba(83,27,140,0.65)"
            : "0 0 12px 2px rgba(162,41,242,0.7),  0 0 20px 4px rgba(83,27,140,0.5)",
          opacity: isHovered ? 1 : 0.85,
        }}
        transition={{ duration: 0.35 }}
      />

      {/* Left corner edge */}
      <motion.div
        className="absolute bottom-0 left-0 h-1/4 w-[1px] z-[25] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0) 80%)",
        }}
        animate={{
          boxShadow: isHovered
            ? "0 0 16px 3px rgba(162,41,242,0.8)"
            : "0 0 10px 2px rgba(162,41,242,0.6)",
          opacity: isHovered ? 1 : 0.85,
        }}
        transition={{ duration: 0.35 }}
      />

      {/* Right corner edge */}
      <motion.div
        className="absolute bottom-0 right-0 h-1/4 w-[1px] z-[25] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0) 80%)",
        }}
        animate={{
          boxShadow: isHovered
            ? "0 0 16px 3px rgba(162,41,242,0.8)"
            : "0 0 10px 2px rgba(162,41,242,0.6)",
          opacity: isHovered ? 1 : 0.85,
        }}
        transition={{ duration: 0.35 }}
      />

      {/* Content */}
      <div className="relative z-40">{children}</div>
    </motion.div>
  );
}
