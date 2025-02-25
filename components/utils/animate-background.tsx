"use client";

import { useCallback } from "react";
import { loadFull } from "tsparticles";
import { Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { useThemeStore } from "@/stores/theme-store";

const ParticlesBackground = () => {
  const { theme } = useThemeStore();

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: theme === "light" ? "#ffffff" : "#000000", // White for light, black for dark
        },
        particles: {
          number: {
            value: 100, // Number of particles
            density: {
              enable: true,
              area: 800, 
            },
          },
          color: {
            value: theme === "light" ? "#000000" : "#ffffff", // Black on light mode, white on dark mode
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
            color: theme === "light" ? "#000000" : "#ffffff", // Black links in light mode, white links in dark mode
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
      }}
    />
  );
};

export default ParticlesBackground;