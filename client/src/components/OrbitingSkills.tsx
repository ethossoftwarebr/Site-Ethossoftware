import { useEffect, useState, memo } from "react";
import type { JSX } from "react";

type GlowColor = "purple" | "violet";

interface SkillConfig {
  id: string;
  orbitRadius: number;
  size: number;
  speed: number;
  iconType: string;
  phaseShift: number;
  glowColor: GlowColor;
  label: string;
  color: string;
}

const techIcons: Record<string, { svg: () => JSX.Element; color: string }> = {
  react: {
    color: "#61DAFB",
    svg: () => (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <circle cx="12" cy="12" r="2.05" fill="#61DAFB" />
          <ellipse cx="12" cy="12" rx="11" ry="4.2" />
          <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(120 12 12)" />
        </g>
      </svg>
    ),
  },
  typescript: {
    color: "#3178C6",
    svg: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect width="24" height="24" rx="3" fill="#3178C6" />
        <path d="M13.5 15.5v1.8c.3.15.65.26 1.05.33.4.07.82.1 1.27.1.43 0 .84-.04 1.23-.13.39-.09.73-.23 1.02-.43.29-.2.52-.46.69-.78.17-.32.26-.71.26-1.17 0-.34-.05-.63-.14-.88-.09-.25-.23-.47-.41-.66-.18-.19-.4-.36-.66-.51-.26-.15-.56-.29-.89-.42-.24-.1-.45-.19-.63-.28-.18-.09-.33-.18-.45-.28-.12-.1-.21-.2-.27-.31-.06-.11-.09-.24-.09-.39 0-.14.03-.26.09-.37.06-.11.14-.2.25-.28.11-.08.24-.14.39-.18.15-.04.32-.06.51-.06.13 0 .27.01.41.03.14.02.28.05.42.1.14.05.27.11.39.19.12.08.23.17.32.28v-1.68c-.27-.1-.57-.18-.9-.23-.33-.05-.69-.07-1.07-.07-.43 0-.84.05-1.22.14-.38.09-.72.24-1 .44-.28.2-.5.46-.66.77-.16.31-.24.68-.24 1.11 0 .55.16 1.01.47 1.38.31.37.78.68 1.4.92.26.1.5.2.7.3.2.1.37.2.51.31.14.11.25.23.32.36.07.13.11.28.11.45 0 .15-.03.28-.08.4-.05.12-.14.22-.25.31-.11.09-.25.15-.42.2-.17.05-.37.07-.6.07-.39 0-.77-.07-1.14-.22-.37-.15-.7-.38-1-.7zM9 13H7v-1.5h6V13h-2v6H9v-6z" fill="white" />
      </svg>
    ),
  },
  node: {
    color: "#339933",
    svg: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.25 1.328-.602.065-.037.151-.023.218.017l2.256 1.339c.082.045.198.045.275 0l8.795-5.076c.082-.047.135-.141.135-.241V6.921c0-.103-.055-.198-.137-.246l-8.791-5.072c-.081-.047-.189-.047-.273 0L2.075 6.675c-.084.048-.139.144-.139.246v10.146c0 .1.055.194.139.241l2.409 1.392c1.307.654 2.108-.116 2.108-.89V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.112.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.551l-2.304-1.327C.518 18.135 0 17.201 0 16.204V6.061c0-1.002.518-1.938 1.357-2.439l8.796-5.076c.818-.483 1.907-.483 2.721 0l8.795 5.076C22.482 4.123 23 5.059 23 6.061v10.143c0 1.002-.518 1.938-1.332 2.435l-8.795 5.077c-.278.159-.6.247-.922.247h.047zm2.71-6.978c-3.853 0-4.663-1.769-4.663-3.254 0-.142.114-.253.256-.253h1.137c.126 0 .232.091.253.216.171 1.163.683 1.749 3.017 1.749 1.856 0 2.646-.42 2.646-1.407 0-.569-.224-.991-3.113-1.274-2.415-.238-3.908-.773-3.908-2.707 0-1.782 1.502-2.845 4.021-2.845 2.826 0 4.228.981 4.403 3.089.006.071-.018.142-.066.194-.047.051-.113.08-.182.08h-1.14c-.12 0-.226-.085-.249-.203-.277-1.218-.952-1.608-2.766-1.608-2.038 0-2.274.71-2.274 1.241 0 .645.28.832 3.02 1.194 2.715.359 3.998.866 3.998 2.773-.002 1.924-1.602 3.009-4.396 3.009z" fill="#339933" />
      </svg>
    ),
  },
  python: {
    color: "#3776AB",
    svg: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.912S0 5.789 0 11.969c0 6.18 3.403 5.963 3.403 5.963h2.03v-2.867s-.109-3.402 3.35-3.402h5.766s3.24.052 3.24-3.13V3.13S18.28 0 11.914 0zm-3.2 1.814a1.04 1.04 0 0 1 1.046 1.044 1.04 1.04 0 0 1-1.046 1.046A1.04 1.04 0 0 1 7.67 2.858a1.04 1.04 0 0 1 1.044-1.044z" fill="#3776AB" />
        <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752H12v-.826h8.109S24 18.211 24 12.031c0-6.18-3.403-5.963-3.403-5.963h-2.03v2.867s.109 3.402-3.35 3.402H9.45s-3.24-.052-3.24 3.13v5.403S5.72 24 12.086 24zm3.2-1.814a1.04 1.04 0 0 1-1.046-1.044 1.04 1.04 0 0 1 1.046-1.046 1.04 1.04 0 0 1 1.044 1.046 1.04 1.04 0 0 1-1.044 1.044z" fill="#FFD43B" />
      </svg>
    ),
  },
  nextjs: {
    color: "#FFFFFF",
    svg: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <circle cx="12" cy="12" r="12" fill="#000" />
        <path d="M9.93 8.04v8.82L17.5 8.04v.02c-.05-.06-.12-.06-.18-.06H9.93zM4.5 12A7.5 7.5 0 0 1 12 4.5a7.48 7.48 0 0 1 6.14 3.19L9.93 18.5H8.81L4.56 12.6A7.44 7.44 0 0 1 4.5 12z" fill="white" />
        <path d="M18.5 17.63l-5.21-7.5v7.5h5.21z" fill="white" opacity=".5" />
      </svg>
    ),
  },
  postgres: {
    color: "#4169E1",
    svg: () => (
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <path d="M17.128 0a10.134 10.134 0 0 0-2.755.403 5.834 5.834 0 0 0-.093-.02C12.367.119 10.47.215 9.87.398c-.748.23-1.505.604-2.167 1.064a8.626 8.626 0 0 0-2.247 2.603C4.0 6.348 3.5 9.5 3.5 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-2.5-.5-5.652-1.956-7.935a8.626 8.626 0 0 0-2.247-2.603A6.54 6.54 0 0 0 17.128 0zm-4.63 1.4c.74 0 1.42.15 2.04.42-.47.26-.93.6-1.35 1.02-.84.84-1.46 2.03-1.46 3.58v.06c-.63.04-1.24.2-1.79.46-.03-.18-.04-.35-.04-.52 0-2.93 1.17-4.36 2.61-4.99V1.4zM17.128.96c1.68 0 2.44 1.21 2.44 2.85 0 1.54-.95 3.39-2.44 4.02-1.49-.63-2.44-2.48-2.44-4.02 0-1.64.76-2.85 2.44-2.85zM9.79 2.92c.73 0 1.4.27 1.92.72C10.88 4.27 10.27 5.2 10.27 6.4c0 .17.01.34.04.5A4.45 4.45 0 0 0 9.5 8.3 4.45 4.45 0 0 0 9.5 12c0 2.46 2.02 4.5 4.5 4.5s4.5-2.04 4.5-4.5a4.45 4.45 0 0 0-4.5-4.5h-.08a4.76 4.76 0 0 1-.08-.5c0-1.56.8-2.91 2.04-3.71a3.2 3.2 0 0 1 1.2 2.5c0 1.77-1.44 3.21-3.21 3.21S10.66 7.56 10.66 5.79A3.21 3.21 0 0 1 13.87 2.58c-.04-.02-.08-.03-.12-.04A2.78 2.78 0 0 0 12.5 2.5c-.84 0-1.56.34-2.1.88A2.79 2.79 0 0 0 9.5 5.5c0 .17.02.34.05.5H9.5A3.5 3.5 0 0 1 6 2.5a3.5 3.5 0 0 1 3.5-3.5c.1 0 .19.01.29.02z" fill="#4169E1" />
      </svg>
    ),
  },
  tailwind: {
    color: "#06B6D4",
    svg: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" fill="#06B6D4" />
      </svg>
    ),
  },
  reactnative: {
    color: "#61DAFB",
    svg: () => (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <rect width="24" height="24" rx="4" fill="#222" />
        <g stroke="#61DAFB" strokeWidth="0.9" fill="none">
          <circle cx="12" cy="12" r="1.7" fill="#61DAFB" />
          <ellipse cx="12" cy="12" rx="9" ry="3.4" />
          <ellipse cx="12" cy="12" rx="9" ry="3.4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.4" transform="rotate(120 12 12)" />
        </g>
      </svg>
    ),
  },
};

const skillsConfig: SkillConfig[] = [
  { id: "react", orbitRadius: 110, size: 44, speed: 0.5, iconType: "react", phaseShift: 0, glowColor: "purple", label: "React", color: "#61DAFB" },
  { id: "typescript", orbitRadius: 110, size: 42, speed: 0.5, iconType: "typescript", phaseShift: (2 * Math.PI) / 3, glowColor: "purple", label: "TypeScript", color: "#3178C6" },
  { id: "tailwind", orbitRadius: 110, size: 40, speed: 0.5, iconType: "tailwind", phaseShift: (4 * Math.PI) / 3, glowColor: "purple", label: "Tailwind CSS", color: "#06B6D4" },
  { id: "node", orbitRadius: 195, size: 48, speed: -0.3, iconType: "node", phaseShift: 0, glowColor: "violet", label: "Node.js", color: "#339933" },
  { id: "python", orbitRadius: 195, size: 44, speed: -0.3, iconType: "python", phaseShift: Math.PI / 2, glowColor: "violet", label: "Python", color: "#3776AB" },
  { id: "nextjs", orbitRadius: 195, size: 44, speed: -0.3, iconType: "nextjs", phaseShift: Math.PI, glowColor: "violet", label: "Next.js", color: "#FFFFFF" },
  { id: "reactnative", orbitRadius: 195, size: 42, speed: -0.3, iconType: "reactnative", phaseShift: (3 * Math.PI) / 2, glowColor: "violet", label: "React Native", color: "#61DAFB" },
];

const OrbitingSkill = memo(({ config, angle }: { config: SkillConfig; angle: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { orbitRadius, size, iconType, label, color } = config;
  const x = Math.cos(angle) * orbitRadius;
  const y = Math.sin(angle) * orbitRadius;
  const Icon = techIcons[iconType]?.svg;

  return (
    <div
      className="absolute top-1/2 left-1/2 transition-all duration-300 ease-out"
      style={{ width: `${size}px`, height: `${size}px`, transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`, zIndex: isHovered ? 20 : 10 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative w-full h-full p-2 bg-[#1a0a2e]/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer border border-[#A229F2]/20 ${isHovered ? "scale-125" : ""}`}
        style={{ boxShadow: isHovered ? `0 0 28px ${color}50, 0 0 55px ${color}20` : "0 4px 15px rgba(0,0,0,0.3)" }}
      >
        {Icon && <Icon />}
        {isHovered && (
          <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#0a0a1a]/95 backdrop-blur-sm rounded-lg text-xs text-white whitespace-nowrap pointer-events-none border border-[#A229F2]/30 font-medium">
            {label}
          </div>
        )}
      </div>
    </div>
  );
});
OrbitingSkill.displayName = "OrbitingSkill";

const GlowingOrbitPath = memo(({ radius, glowColor }: { radius: number; glowColor: GlowColor }) => {
  const colors = glowColor === "purple"
    ? { primary: "rgba(162,41,242,0.35)", secondary: "rgba(162,41,242,0.15)", border: "rgba(162,41,242,0.25)" }
    : { primary: "rgba(83,27,140,0.35)", secondary: "rgba(83,27,140,0.15)", border: "rgba(186,102,242,0.2)" };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none" style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}>
      <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: `radial-gradient(circle, transparent 30%, ${colors.secondary} 70%, ${colors.primary} 100%)`, boxShadow: `0 0 50px ${colors.primary}, inset 0 0 50px ${colors.secondary}` }} />
      <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${colors.border}` }} />
    </div>
  );
});
GlowingOrbitPath.displayName = "GlowingOrbitPath";

export default function OrbitingSkills() {
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    let animId: number;
    let last = performance.now();
    const animate = (now: number) => {
      setTime(t => t + (now - last) / 1000);
      last = now;
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  return (
    <div className="w-full flex items-center justify-center">
      <div
        className="relative w-[420px] h-[420px] flex items-center justify-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <GlowingOrbitPath radius={110} glowColor="purple" />
        <GlowingOrbitPath radius={195} glowColor="violet" />

        <div className="w-20 h-20 bg-gradient-to-br from-[#531B8C] to-[#1a0a2e] rounded-full flex items-center justify-center z-10 relative shadow-2xl border border-[#A229F2]/30">
          <div className="absolute inset-0 rounded-full bg-[#A229F2]/20 blur-xl animate-pulse" />
          <div className="absolute inset-0 rounded-full bg-[#531B8C]/30 blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="url(#ethosGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="ethosGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A229F2" />
                  <stop offset="100%" stopColor="#BA66F2" />
                </linearGradient>
              </defs>
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
        </div>

        {skillsConfig.map(config => (
          <OrbitingSkill key={config.id} config={config} angle={time * config.speed + config.phaseShift} />
        ))}
      </div>
    </div>
  );
}
