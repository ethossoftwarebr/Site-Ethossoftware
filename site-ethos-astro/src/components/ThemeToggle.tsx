import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "ghost" | "outline";
  /** When true renders light text/border (use over dark backgrounds) */
  light?: boolean;
}

export function ThemeToggle({ className = "", variant = "ghost", light = false }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();

  return (
    <Button
      size="icon"
      variant={variant}
      onClick={toggle}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      data-testid="button-theme-toggle"
      className={`${light ? "text-white/80 hover:text-white border-white/20" : ""} ${className}`}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </Button>
  );
}
