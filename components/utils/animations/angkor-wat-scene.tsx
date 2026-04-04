"use client";

import { useThemeStore } from "@/stores/themes/theme-store";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/* -------------------------------- Helpers ------------------------------- */
// ── AngkorWatModel — Loads and displays the .glb model ────────────
function AngkorWatModel({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/angkor_wat_optimized.glb", false, true);
  const { camera } = useThree();

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });

    // Normalize model scale
    const initialBox = new THREE.Box3().setFromObject(clone);
    const initialSize = initialBox.getSize(new THREE.Vector3());
    const initialMaxDim = Math.max(initialSize.x, initialSize.y, initialSize.z);
    const targetMaxDim = 6;

    if (initialMaxDim > 0) {
      const scaleFactor = targetMaxDim / initialMaxDim;
      clone.scale.setScalar(scaleFactor);
    }

    return clone;
  }, [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh) || !child.material) return;
      const mat = child.material as THREE.MeshStandardMaterial;
      if (!mat.isMeshStandardMaterial) return;
      mat.metalness = isDark ? 0.4 : 0.2;
      mat.roughness = isDark ? 0.6 : 0.7;
      mat.envMapIntensity = isDark ? 1.5 : 1.0;
      mat.needsUpdate = true;
    });
  }, [clonedScene, isDark]);

  // Auto-fit the model to view
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const boxSize = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    clonedScene.position.sub(center);

    const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z);
    const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 45;
    const distance = maxDim / (2 * Math.tan((fov * Math.PI) / 360));

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.near = Math.max(0.01, distance / 100);
      camera.far = Math.max(100, distance * 100);
      camera.updateProjectionMatrix();
    }

    camera.position.set(
      distance * 0.75,
      distance * 0.45,
      distance * 0.75,
    );
    camera.lookAt(0, 0, 0);
  }, [clonedScene, camera]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

// ── SceneControls — Orbit controls for the 3D scene ────────────
function SceneControls() {
  return (
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.6}
      minPolarAngle={Math.PI / 3.2}
      maxPolarAngle={Math.PI / 1.9}
      target={[0, 0, 0]}
    />
  );
}

// ── LoadingFallback — Spinner while model loads ────────────
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
        camera={{ position: [5, 3, 5], fov: 45 }}
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
          <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.2}>
            <AngkorWatModel isDark={isDark} />
          </Float>
        </Suspense>

        <SceneControls />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/angkor_wat_optimized.glb", false, true);
