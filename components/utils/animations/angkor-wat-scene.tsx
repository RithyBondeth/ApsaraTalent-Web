"use client";

import { useThemeStore } from "@/stores/themes/theme-store";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import { MeshoptDecoder } from "meshoptimizer";

function fitObjectToCamera(
  object: THREE.Object3D,
  camera: THREE.PerspectiveCamera,
) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  object.position.set(-center.x, -center.y + size.y * 0.06, -center.z);

  const maxDim = Math.max(size.x, size.y, size.z);
  const distance = maxDim / (2 * Math.tan((camera.fov * Math.PI) / 360));

  camera.near = Math.max(0.01, distance / 100);
  camera.far = Math.max(100, distance * 100);
  camera.updateProjectionMatrix();
  camera.position.set(distance * 0.82, distance * 0.52, distance * 0.82);
  camera.lookAt(0, size.y * 0.04, 0);
}

export default function AngkorWatScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
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

    const root = new THREE.Group();
    scene.add(root);

    let disposed = false;

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

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      "/models/angkor_wat_optimized.glb",
      (gltf) => {
        if (disposed) return;

        const model = gltf.scene.clone(true);
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = false;
            child.receiveShadow = false;
            const material = child.material;
            const materials = Array.isArray(material) ? material : [material];
            materials.forEach((mat) => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.metalness = isDark ? 0.4 : 0.2;
                mat.roughness = isDark ? 0.6 : 0.7;
                mat.envMapIntensity = isDark ? 1.5 : 1.0;
                mat.needsUpdate = true;
              }
            });
          }
        });

        root.add(model);
        fitObjectToCamera(model, camera);
        setIsLoaded(true);
      },
      undefined,
      (error) => {
        console.error("Failed to load Angkor Wat GLB:", error);
        setIsLoaded(false);
      },
    );

    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      root.rotation.y = elapsed * 0.22;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      renderer.dispose();
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          const material = child.material;
          const materials = Array.isArray(material) ? material : [material];
          materials.forEach((mat) => mat.dispose());
        }
      });
      mount.removeChild(renderer.domElement);
    };
  }, [isDark]);

  return (
    <div ref={mountRef} className="absolute inset-0 h-full w-full">
      {!isLoaded && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-full border border-border/50 bg-background/70 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm">
            Loading 3D preview...
          </div>
        </div>
      )}
    </div>
  );
}
