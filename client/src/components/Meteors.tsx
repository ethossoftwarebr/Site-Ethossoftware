import { useMemo } from "react";

interface MeteorData {
  id: number;
  top: string;
  left: string;
  delay: string;
  duration: string;
}

export function Meteors({ number = 16 }: { number?: number }) {
  const meteors: MeteorData[] = useMemo(
    () =>
      Array.from({ length: number }, (_, idx) => ({
        id: idx,
        top: Math.floor(Math.random() * 65) + "%",
        left: Math.floor(Math.random() * 100 + 15) + "%",
        delay: (Math.random() * 5).toFixed(2) + "s",
        duration: (Math.random() * 4 + 5).toFixed(1) + "s",
      })),
    [number]
  );

  return (
    <>
      <style>{`
        @keyframes shooting-star {
          0%   { transform: rotate(-35deg) translateX(0);      opacity: 0; }
          8%   { opacity: 1; }
          78%  { opacity: 0.85; }
          100% { transform: rotate(-35deg) translateX(-580px); opacity: 0; }
        }
      `}</style>
      {meteors.map((m) => (
        <span
          key={m.id}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: m.top,
            left: m.left,
            zIndex: 1,
            pointerEvents: "none",
            animation: `shooting-star ${m.duration} ${m.delay} linear infinite`,
          }}
        >
          {/* Trail line — extends upper-right (behind the meteor head) */}
          <span
            aria-hidden="true"
            style={{
              display: "block",
              width: "80px",
              height: "1.5px",
              position: "relative",
              background:
                "linear-gradient(to right, rgba(162,41,242,0.85), transparent)",
            }}
          >
            {/* Glowing head dot at the leading (left) end */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "#A229F2",
                boxShadow: "0 0 8px 3px rgba(162,41,242,0.55)",
              }}
            />
          </span>
        </span>
      ))}
    </>
  );
}
