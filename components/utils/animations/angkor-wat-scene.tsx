"use client";

import { useThemeStore } from "@/stores/themes/theme-store";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AngkorWatScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme, systemTheme } = useThemeStore();
  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(4.2, 2.8, 4.2);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 0.95 : 1.05;
    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      isDark ? 0.55 : 0.8,
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(
      isDark ? 0xf3d38b : 0xfff1c2,
      isDark ? 1.3 : 1.7,
    );
    keyLight.position.set(8, 10, 5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(
      isDark ? 0x818cf8 : 0x93c5fd,
      isDark ? 0.8 : 0.45,
      20,
    );
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    const warmLight = new THREE.PointLight(
      isDark ? 0xd4a853 : 0xf5deb3,
      isDark ? 0.9 : 0.5,
      18,
    );
    warmLight.position.set(0, 5, 0);
    scene.add(warmLight);

    const monument = new THREE.Group();
    scene.add(monument);

    const baseMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? "#7c5a20" : "#d6b36a",
      metalness: 0.12,
      roughness: 0.78,
    });
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? "#d4a853" : "#b7791f",
      metalness: 0.28,
      roughness: 0.48,
    });

    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1.55, 1.85, 0.6, 6),
      baseMaterial,
    );
    pedestal.position.y = -0.55;
    monument.add(pedestal);

    const core = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 1.8, 1.8),
      bodyMaterial,
    );
    core.position.y = 0.9;
    monument.add(core);

    const crown = new THREE.Mesh(
      new THREE.ConeGeometry(0.8, 1.1, 4),
      bodyMaterial.clone(),
    );
    crown.position.y = 2.15;
    crown.rotation.y = Math.PI / 4;
    monument.add(crown);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.45, 0.08, 16, 48),
      new THREE.MeshStandardMaterial({
        color: isDark ? "#f7d774" : "#9a6a11",
        metalness: 0.55,
        roughness: 0.3,
      }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.4;
    monument.add(ring);

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      if (!clientWidth || !clientHeight) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      monument.rotation.y = elapsed * 0.22;
      monument.position.y = Math.sin(elapsed * 0.8) * 0.08;
      ring.rotation.z = elapsed * 0.3;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      renderer.dispose();
      pedestal.geometry.dispose();
      core.geometry.dispose();
      crown.geometry.dispose();
      ring.geometry.dispose();
      baseMaterial.dispose();
      bodyMaterial.dispose();
      (crown.material as THREE.Material).dispose();
      (ring.material as THREE.Material).dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [isDark]);

  return <div ref={mountRef} className="absolute inset-0 h-full w-full" />;
}
