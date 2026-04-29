import { useEffect, useRef, useState } from "react";

interface AuroraBackgroundProps {
  className?: string;
}

function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const ctx =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!ctx;
  } catch {
    return false;
  }
}

export function AuroraBackground({ className = "" }: AuroraBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isLowEnd = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4;

    if (prefersReduced || isLowEnd || !isWebGLSupported()) {
      setWebglFailed(true);
      return;
    }

    const el = mountRef.current;
    if (!el) return;

    let THREE: typeof import("three");
    let renderer: import("three").WebGLRenderer | null = null;
    let animId: number;

    const init = async () => {
      try {
        THREE = await import("three");

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
        renderer.setSize(el.clientWidth, el.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.domElement.style.cssText =
          "position:absolute;inset:0;width:100%;height:100%;display:block;";
        el.appendChild(renderer.domElement);

        const material = new THREE.ShaderMaterial({
          uniforms: {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(el.clientWidth, el.clientHeight) },
          },
          vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
          fragmentShader: `
            uniform float iTime;
            uniform vec2 iResolution;

            #define NUM_OCTAVES 3

            float rand(vec2 n) {
              return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
            }

            float noise(vec2 p) {
              vec2 ip = floor(p);
              vec2 u = fract(p);
              u = u * u * (3.0 - 2.0 * u);
              return mix(
                mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
                mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x),
                u.y
              );
            }

            float fbm(vec2 x) {
              float v = 0.0;
              float a = 0.3;
              vec2 shift = vec2(100.0);
              mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
              for (int i = 0; i < NUM_OCTAVES; ++i) {
                v += a * noise(x);
                x = rot * x * 2.0 + shift;
                a *= 0.4;
              }
              return v;
            }

            void main() {
              vec2 p = ((gl_FragCoord.xy) - iResolution.xy * 0.5) / iResolution.y
                       * mat2(6., -4., 4., 6.);
              vec4 o = vec4(0.0);
              float f = 2.0 + fbm(p + vec2(iTime * 5.0, 0.0)) * 0.5;

              for (float i = 0.0; i++ < 35.0;) {
                vec2 v = p + cos(
                  i * i + (iTime + p.x * 0.08) * 0.025 + i * vec2(13.0, 11.0)
                ) * 3.5;

                float tailNoise = fbm(v + vec2(iTime * 0.5, i)) * 0.3 * (1.0 - (i / 35.0));

                /* Ethos palette: violet–magenta–purple aurora */
                vec4 auroraColors = vec4(
                  0.35 + 0.35 * sin(i * 0.25 + iTime * 0.4),
                  0.02 + 0.08 * cos(i * 0.30 + iTime * 0.5),
                  0.55 + 0.35 * sin(i * 0.40 + iTime * 0.3),
                  1.0
                );

                float thinness = smoothstep(0.0, 1.0, i / 35.0) * 0.6;
                o += auroraColors
                  * exp(sin(i * i + iTime * 0.8))
                  / length(max(v, vec2(v.x * f * 0.015, v.y * 1.5)))
                  * (1.0 + tailNoise * 0.8) * thinness;
              }

              o = tanh(pow(o / 100.0, vec4(1.6)));
              float vignette = 1.0 - pow(length((gl_FragCoord.xy / iResolution.xy) - 0.5) * 1.1, 2.0);
              gl_FragColor = o * 1.3 * max(vignette, 0.2);
            }
          `,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        scene.add(new THREE.Mesh(geometry, material));

        let last = performance.now();
        const animate = (now: number) => {
          animId = requestAnimationFrame(animate);
          material.uniforms.iTime.value += Math.min((now - last) / 1000, 0.05);
          last = now;
          renderer!.render(scene, camera);
        };
        animId = requestAnimationFrame(animate);

        const onResize = () => {
          if (!el || !renderer) return;
          renderer.setSize(el.clientWidth, el.clientHeight);
          material.uniforms.iResolution.value.set(el.clientWidth, el.clientHeight);
        };
        window.addEventListener("resize", onResize);

        return () => {
          cancelAnimationFrame(animId);
          window.removeEventListener("resize", onResize);
          if (renderer && el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
          renderer?.dispose();
          material.dispose();
          geometry.dispose();
        };
      } catch (err) {
        console.warn("AuroraBackground: WebGL init failed, using CSS fallback.", err);
        setWebglFailed(true);
      }
    };

    let cleanup: (() => void) | undefined;
    init().then((fn) => { cleanup = fn; });

    return () => {
      cancelAnimationFrame(animId);
      cleanup?.();
    };
  }, []);

  if (webglFailed) {
    return (
      <div
        className={`absolute inset-0 pointer-events-none ${className}`}
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 40%, #531B8C 0%, #2d0e52 35%, #07050f 70%)",
        }}
      />
    );
  }

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
