"use client";

import { useThemeStore } from "@/stores/themes/theme-store";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";

/* ------------------------------------- Helpers ------------------------------------ */
function DiagnosticMonument({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.08;
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.25, 0]}>
      <mesh castShadow={false} receiveShadow={false} position={[0, 0.9, 0]}>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshStandardMaterial
          color={isDark ? "#d4a853" : "#b7791f"}
          metalness={0.35}
          roughness={0.5}
        />
      </mesh>
      <mesh castShadow={false} receiveShadow={false} position={[0, -0.55, 0]}>
        <cylinderGeometry args={[1.5, 1.8, 0.55, 6]} />
        <meshStandardMaterial
          color={isDark ? "#7c5a20" : "#d6b36a"}
          metalness={0.15}
          roughness={0.75}
        />
      </mesh>
    </group>
  );
}

// ── LoadingFallback — Spinner while model loads ────────────────────────
function LoadingFallback({ isDark }: { isDark: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 1.5;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime()) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[1, 0.15, 16, 40]} />
      <meshStandardMaterial
        color={isDark ? "#d4a853" : "#8b6914"}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

export default function AngkorWatScene() {
  /* --------------------------------- Utils ---------------------------------- */
  const { theme, systemTheme } = useThemeStore();
  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const isDark = resolvedTheme === "dark";

  /* ------------------------------- Render UI -------------------------------- */
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [4.2, 2.6, 4.2], fov: 45 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={isDark ? 0.4 : 0.6} />
        <directionalLight
          position={[8, 10, 5]}
          intensity={isDark ? 1.0 : 1.5}
        />
        <pointLight
          position={[0, 5, 0]}
          intensity={isDark ? 0.8 : 0.4}
          color={isDark ? "#d4a853" : "#f5deb3"}
          distance={20}
        />
        <pointLight
          position={[-5, 3, -5]}
          intensity={0.4}
          color={isDark ? "#6366f1" : "#818cf8"}
          distance={15}
        />

        <Suspense fallback={<LoadingFallback isDark={isDark} />}>
          <DiagnosticMonument isDark={isDark} />
        </Suspense>
      </Canvas>
    </div>
  );
}
