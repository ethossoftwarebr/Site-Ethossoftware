import { cn } from "@/lib/utils";
import type React from "react";

interface ShinyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  "data-testid"?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function ShinyButton({
  children,
  onClick,
  className = "",
  style,
  "data-testid": testId,
  type = "button",
  disabled,
}: ShinyButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      className={cn("shiny-cta", className)}
      style={{ padding: "0.85rem 2rem", ...style }}
    >
      <span>{children}</span>
    </button>
  );
}
