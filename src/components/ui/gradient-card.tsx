import { cn } from "@/lib/utils";

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GradientCard({ children, className, onClick }: GradientCardProps) {
  return (
    <div
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "relative overflow-hidden rounded-lg border border-[#DED5E0] bg-card",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}
