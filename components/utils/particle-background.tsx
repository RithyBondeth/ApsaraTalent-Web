"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { loadFull } from "tsparticles";
import { Engine, IOptions } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { useThemeStore } from "@/stores/themes/theme-store";

const ParticlesBackground = () => {
  const { theme, systemTheme } = useThemeStore();
  const [clientTheme, setClientTheme] = useState<string | null>(null);

  // Ensure the correct theme is used
  useEffect(() => {
    setClientTheme(theme === "system" ? systemTheme : theme);
  }, [theme, systemTheme]);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particleOptions = useMemo(() => {
    if (!clientTheme) return {}; // Prevents hydration mismatch

    return {
      background: {
        color: clientTheme === "light" ? "#ffffff" : "#000000",
      },
      particles: {
        number: {
          value: 100,
          density: {
            enable: true,
            area: 800,
          },
        },
        color: {
          value: clientTheme === "light" ? "#000000" : "#ffffff",
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: 0.9,
        },
        size: {
          value: 3,
        },
        move: {
          enable: true,
          speed: 1.5,
          direction: "none",
          random: false,
          straight: false,
        },
        links: {
          enable: true,
          distance: 150,
          color: clientTheme === "light" ? "#000000" : "#ffffff",
          opacity: 0.6,
          width: 1,
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "grab",
          },
          onClick: {
            enable: true,
            mode: "push",
          },
        },
        modes: {
          grab: {
            distance: 200,
            links: {
              opacity: 1,
            },
          },
          push: {
            quantity: 4,
          },
        },
      },
      retina_detect: true,
    };
  }, [clientTheme]);

  if (!clientTheme) return null; // Prevents flickering

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={particleOptions as unknown as IOptions}
    />
  );
};

export default ParticlesBackground;
