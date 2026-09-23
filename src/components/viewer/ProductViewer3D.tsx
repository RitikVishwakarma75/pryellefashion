'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';

interface MaterialOption {
  id: string;
  name: string;
  colorHex: string;
  threeColor: number;
  roughness: number;
  metalness: number;
  clearcoat: number;
  transmission: number;
  ior: number;
}

const MATERIALS: MaterialOption[] = [
  {
    id: 'pearl',
    name: 'Pearl Nacre',
    colorHex: '#F6F3EE',
    threeColor: 0xf6f3ee,
    roughness: 0.15,
    metalness: 0.1,
    clearcoat: 0.9,
    transmission: 0.4,
    ior: 1.45,
  },
  {
    id: 'tortoise',
    name: 'Espresso Tortoise',
    colorHex: '#42281D',
    threeColor: 0x4a2a1a,
    roughness: 0.2,
    metalness: 0.05,
    clearcoat: 0.85,
    transmission: 0.2,
    ior: 1.5,
  },
  {
    id: 'gold',
    name: 'Liquid 18K Gold',
    colorHex: '#D8B167',
    threeColor: 0xd8b167,
    roughness: 0.25,
    metalness: 0.95,
    clearcoat: 0.4,
    transmission: 0.0,
    ior: 1.8,
  },
  {
    id: 'obsidian',
    name: 'Matte Obsidian',
    colorHex: '#181716',
    threeColor: 0x181716,
    roughness: 0.5,
    metalness: 0.2,
    clearcoat: 0.1,
    transmission: 0.0,
    ior: 1.4,
  },
  {
    id: 'rose',
    name: 'Rose Quartz',
    colorHex: '#DCAEAE',
    threeColor: 0xdcaeae,
    roughness: 0.18,
    metalness: 0.05,
    clearcoat: 0.9,
    transmission: 0.35,
    ior: 1.45,
  },
];

type LightingPreset = 'studio' | 'sunset' | 'noir';

export default function ProductViewer3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialOption>(MATERIALS[0]);
  const [activeLighting, setActiveLighting] = useState<LightingPreset>('studio');
  const [isRotatingAuto, setIsRotatingAuto] = useState(true);
  const isRotatingAutoRef = useRef(true);
  const isVisibleRef = useRef(true);

  // Sync state to ref
  useEffect(() => {
    isRotatingAutoRef.current = isRotatingAuto;
  }, [isRotatingAuto]);

  // References to Three.js objects for dynamic updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const clawMaterialsRef = useRef<THREE.MeshPhysicalMaterial[]>([]);
  const lightsRef = useRef<{
    ambient: THREE.AmbientLight;
    keyLight: THREE.DirectionalLight;
    fillLight: THREE.DirectionalLight;
    rimLight: THREE.PointLight;
  } | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);

  // Drag interaction states
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.25, y: -0.4 });
  const cameraZRef = useRef(5.5);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 5.5);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.style.touchAction = 'pan-y';
    container.appendChild(renderer.domElement);

    // 4. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf5eedc, 1.0);
    fillLight.position.set(-5, 2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xffffff, 2.8, 12);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    lightsRef.current = { ambient: ambientLight, keyLight, fillLight, rimLight };

    // 5. Build Procedural 3D Hair Claw Model
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;

    // Materials
    clawMaterialsRef.current = [];
    const clawMat = new THREE.MeshPhysicalMaterial({
      color: selectedMaterial.threeColor,
      roughness: selectedMaterial.roughness,
      metalness: selectedMaterial.metalness,
      clearcoat: selectedMaterial.clearcoat,
      clearcoatRoughness: 0.1,
      transmission: selectedMaterial.transmission,
      ior: selectedMaterial.ior,
      thickness: 0.8,
    });
    clawMaterialsRef.current.push(clawMat);

    const goldSpringMat = new THREE.MeshStandardMaterial({
      color: 0xe6bf65,
      metalness: 0.92,
      roughness: 0.22,
    });

    // Helper to construct one arched claw wing
    const createClawWing = (direction: number) => {
      const wingGroup = new THREE.Group();

      // Main curved backbone spine of the clip
      const spineCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 1.2, 0),
        new THREE.Vector3(direction * 0.9, 0.9, 0),
        new THREE.Vector3(direction * 1.3, -0.4, 0),
        new THREE.Vector3(direction * 0.4, -1.2, 0)
      );
      const tubeGeo = new THREE.TubeGeometry(spineCurve, 40, 0.24, 16, false);
      const spineMesh = new THREE.Mesh(tubeGeo, clawMat);
      spineMesh.castShadow = true;
      wingGroup.add(spineMesh);

      // Ergonomic ribbed body plates
      for (let i = 0; i < 6; i++) {
        const t = (i + 1) / 7;
        const pt = spineCurve.getPoint(t);
        const ribGeo = new THREE.BoxGeometry(0.35, 0.45, 0.12);
        ribGeo.rotateZ(direction * (0.2 + i * 0.1));
        const ribMesh = new THREE.Mesh(ribGeo, clawMat);
        ribMesh.position.copy(pt);
        ribMesh.castShadow = true;
        wingGroup.add(ribMesh);
      }

      // Curved interlocking teeth
      const teethCount = 6;
      for (let i = 0; i < teethCount; i++) {
        const yPos = 0.8 - i * 0.32;
        const toothCurve = new THREE.CubicBezierCurve3(
          new THREE.Vector3(direction * 0.7, yPos, 0),
          new THREE.Vector3(direction * 0.2, yPos - 0.05, 0.3),
          new THREE.Vector3(0, yPos - 0.1, 0.6),
          new THREE.Vector3(-direction * 0.3, yPos - 0.12, 0.5)
        );
        const toothGeo = new THREE.TubeGeometry(toothCurve, 16, 0.09, 10, false);
        const toothMesh = new THREE.Mesh(toothGeo, clawMat);
        toothMesh.castShadow = true;
        wingGroup.add(toothMesh);
      }

      // Finger grip paddle top
      const handleGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.8, 16);
      handleGeo.rotateZ(direction * 0.35);
      const handleMesh = new THREE.Mesh(handleGeo, clawMat);
      handleMesh.position.set(direction * 0.4, 1.4, 0);
      handleMesh.castShadow = true;
      wingGroup.add(handleMesh);

      return wingGroup;
    };

    const leftWing = createClawWing(-1);
    const rightWing = createClawWing(1);
    leftWing.position.x = -0.12;
    rightWing.position.x = 0.12;
    modelGroup.add(leftWing);
    modelGroup.add(rightWing);

    // Central Hinge Rod & Coiled Gold Spring
    const hingeGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.6, 24);
    const hingeMesh = new THREE.Mesh(hingeGeo, goldSpringMat);
    hingeMesh.position.y = 0.0;
    modelGroup.add(hingeMesh);

    // Spring coils around hinge
    const springRadius = 0.16;
    const springTurns = 8;
    const springCurvePoints = [];
    for (let i = 0; i <= 60; i++) {
      const u = i / 60;
      const angle = u * Math.PI * 2 * springTurns;
      const y = (u - 0.5) * 1.4;
      const x = Math.cos(angle) * springRadius;
      const z = Math.sin(angle) * springRadius;
      springCurvePoints.push(new THREE.Vector3(x, y, z));
    }
    const springCurve = new THREE.CatmullRomCurve3(springCurvePoints);
    const springGeo = new THREE.TubeGeometry(springCurve, 60, 0.035, 8, false);
    const springMesh = new THREE.Mesh(springGeo, goldSpringMat);
    modelGroup.add(springMesh);

    // Subtle drop shadow catcher plane
    const shadowPlaneGeo = new THREE.PlaneGeometry(8, 8);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.18 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.0;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    scene.add(modelGroup);

    // 6. Interactive Drag Controls with Scroll-Safe Mobile Touch
    const touchStartPosRef = { current: { x: 0, y: 0 } };
    const touchIsHorizontalRef = { current: null as boolean | null };

    const handlePointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      setIsRotatingAuto(false);
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      targetRotationRef.current.y += deltaX * 0.008;
      targetRotationRef.current.x += deltaY * 0.008;
      targetRotationRef.current.x = Math.max(-0.9, Math.min(0.9, targetRotationRef.current.x));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
        previousMousePositionRef.current = { x: touch.clientX, y: touch.clientY };
        touchIsHorizontalRef.current = null;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - previousMousePositionRef.current.x;

        // Determine if user intent is horizontal rotation or vertical page scrolling
        if (touchIsHorizontalRef.current === null) {
          const totalDx = Math.abs(touch.clientX - touchStartPosRef.current.x);
          const totalDy = Math.abs(touch.clientY - touchStartPosRef.current.y);
          if (totalDx > 6 || totalDy > 6) {
            touchIsHorizontalRef.current = totalDx > totalDy;
          }
        }

        // Only rotate 3D model if user is swiping horizontally
        if (touchIsHorizontalRef.current === true) {
          setIsRotatingAuto(false);
          targetRotationRef.current.y += deltaX * 0.012;
          previousMousePositionRef.current = { x: touch.clientX, y: touch.clientY };
        }
      }
    };

    const handleTouchEnd = () => {
      touchIsHorizontalRef.current = null;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraZRef.current = Math.max(3.8, Math.min(8.0, cameraZRef.current + e.deltaY * 0.004));
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    domEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    domEl.addEventListener('touchmove', handleTouchMove, { passive: true });
    domEl.addEventListener('touchend', handleTouchEnd, { passive: true });
    domEl.addEventListener('wheel', handleWheel, { passive: false });

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // IntersectionObserver to pause WebGL rendering when scrolled away
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 7. Animation Loop with smooth inertia (sleeps when offscreen)
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      if (modelGroup) {
        // Auto slow rotation if not interacting
        if (isRotatingAutoRef.current) {
          targetRotationRef.current.y += 0.003;
        }

        // Smooth lerp rotation
        modelGroup.rotation.y += (targetRotationRef.current.y - modelGroup.rotation.y) * 0.08;
        modelGroup.rotation.x += (targetRotationRef.current.x - modelGroup.rotation.x) * 0.08;

        // Subtle organic levitation
        modelGroup.position.y = Math.sin(Date.now() * 0.0018) * 0.08;
      }

      // Smooth lerp zoom
      camera.position.z += (cameraZRef.current - camera.position.z) * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      domEl.removeEventListener('touchstart', handleTouchStart);
      domEl.removeEventListener('touchmove', handleTouchMove);
      domEl.removeEventListener('touchend', handleTouchEnd);
      domEl.removeEventListener('wheel', handleWheel);

      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
      renderer.dispose();
    };
    // Scene is created once; material/lighting updates happen in later effects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Material / Color Change smoothly
  useEffect(() => {
    if (clawMaterialsRef.current.length > 0) {
      const mat = clawMaterialsRef.current[0];
      const targetColor = new THREE.Color(selectedMaterial.threeColor);

      // Smoothly assign material properties
      mat.color.copy(targetColor);
      mat.roughness = selectedMaterial.roughness;
      mat.metalness = selectedMaterial.metalness;
      mat.clearcoat = selectedMaterial.clearcoat;
      mat.transmission = selectedMaterial.transmission;
      mat.ior = selectedMaterial.ior;
      mat.needsUpdate = true;
    }
  }, [selectedMaterial]);

  // Handle Lighting Preset Switch
  useEffect(() => {
    if (!lightsRef.current) return;
    const { ambient, keyLight, fillLight, rimLight } = lightsRef.current;

    if (activeLighting === 'studio') {
      ambient.color.setHex(0xffffff);
      ambient.intensity = 1.2;
      keyLight.color.setHex(0xffffff);
      keyLight.intensity = 2.2;
      fillLight.color.setHex(0xf5eedc);
      fillLight.intensity = 1.0;
      rimLight.color.setHex(0xffffff);
      rimLight.intensity = 2.8;
    } else if (activeLighting === 'sunset') {
      ambient.color.setHex(0xffdfc4);
      ambient.intensity = 1.0;
      keyLight.color.setHex(0xffaa5e);
      keyLight.intensity = 3.0;
      fillLight.color.setHex(0xe88d67);
      fillLight.intensity = 1.2;
      rimLight.color.setHex(0xfff3cf);
      rimLight.intensity = 3.4;
    } else if (activeLighting === 'noir') {
      ambient.color.setHex(0x181820);
      ambient.intensity = 0.4;
      keyLight.color.setHex(0xd0e0ff);
      keyLight.intensity = 1.8;
      fillLight.color.setHex(0x101525);
      fillLight.intensity = 0.3;
      rimLight.color.setHex(0xffffff);
      rimLight.intensity = 4.2;
    }
  }, [activeLighting]);

  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in') {
      cameraZRef.current = Math.max(3.8, cameraZRef.current - 0.7);
    } else {
      cameraZRef.current = Math.min(8.0, cameraZRef.current + 0.7);
    }
  };

  const handleReset = () => {
    targetRotationRef.current = { x: 0.25, y: -0.4 };
    cameraZRef.current = 5.5;
    setIsRotatingAuto(true);
  };

  const lunaProduct = PRODUCTS.find((p) => p.id === 'luna-claw') || PRODUCTS[0];

  return (
    <section
      id="interactive-3d"
      className="py-16 sm:py-24 lg:py-28 px-3.5 min-[360px]:px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full max-w-full overflow-hidden"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-14">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 rounded-full glass-pill mb-2.5 sm:mb-3">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--theme-accent)]" />
          <span className="caps-subtitle text-[9px] min-[360px]:text-[10px] tracking-[0.16em] sm:tracking-[0.22em] text-[var(--theme-text)]/80">
            Precision 3D Engineering
          </span>
        </div>
        <h2 className="editorial-serif text-2xl min-[360px]:text-3xl min-[480px]:text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[var(--theme-text)] mb-2.5 sm:mb-3">
          Inspect Every Contour in 360°
        </h2>
        <p className="text-xs min-[360px]:text-sm sm:text-base text-[var(--theme-text-muted)] max-w-xl mx-auto leading-relaxed">
          Rotate, zoom, and inspect our signature Luna Sculpted Claw. Experience the light play across hand-polished Italian cellulose acetate.
        </p>
      </div>

      {/* Main 3D Studio Card */}
      <div className="relative glass-panel rounded-2xl min-[360px]:rounded-3xl p-3 min-[360px]:p-4 sm:p-8 border border-white/70 shadow-2xl overflow-hidden w-full max-w-full">
        {/* Top Control Bar */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 mb-3 sm:mb-4 px-1">
          {/* DRAG TO EXPLORE Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 glass-pill px-2.5 min-[360px]:px-3.5 py-1 sm:py-1.5 rounded-full text-[9px] min-[360px]:text-[10px] sm:text-xs font-medium text-[var(--theme-text)] shadow-sm">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--theme-accent)] animate-pulse shrink-0" />
            <span className="tracking-wider sm:tracking-widest uppercase">
              <span className="sm:hidden">↔ Swipe to Spin • ↕ Scroll Safe</span>
              <span className="hidden sm:inline">Drag to Explore in 360°</span>
            </span>
          </div>

          {/* Lighting Presets */}
          <div className="flex items-center gap-0.5 min-[360px]:gap-1 glass-pill p-0.5 min-[360px]:p-1 rounded-full shadow-sm">
            <span className="text-[9px] sm:text-[10px] uppercase font-semibold px-1.5 sm:px-2 text-[var(--theme-text-muted)] hidden sm:inline">
              Lighting:
            </span>
            {(['studio', 'sunset', 'noir'] as LightingPreset[]).map((preset) => (
              <button
                key={preset}
                onClick={() => setActiveLighting(preset)}
                className={`px-2 min-[360px]:px-2.5 sm:px-3 py-0.5 min-[360px]:py-1 rounded-full text-[8px] min-[360px]:text-[9px] sm:text-[10px] uppercase font-medium tracking-wider transition-all ${
                  activeLighting === preset
                    ? 'bg-[var(--theme-text)] text-[var(--theme-bg)] shadow-sm'
                    : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* 3D WebGL Canvas Container */}
        <div
          ref={mountRef}
          className="relative w-full h-[280px] min-[360px]:h-[320px] min-[420px]:h-[360px] sm:h-[460px] md:h-[560px] rounded-xl min-[360px]:rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing bg-gradient-to-b from-white/20 via-transparent to-black/5"
        />

        {/* Bottom Floating Control Palette */}
        <div className="relative z-20 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-black/5 flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-6">
          {/* Material / Color Swatches (Scrollable on mobile, wrapping on desktop) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar touch-pan-x overscroll-x-contain py-1 -mx-2 px-2 sm:mx-0 sm:px-0 sm:flex-wrap justify-start sm:justify-center w-full lg:w-auto">
            <span className="text-[10px] min-[360px]:text-xs uppercase font-semibold tracking-wider text-[var(--theme-text-muted)] mr-0.5 shrink-0">
              Material:
            </span>
            {MATERIALS.map((mat) => {
              const isSelected = selectedMaterial.id === mat.id;
              return (
                <button
                  key={mat.id}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`group relative shrink-0 flex items-center gap-1 min-[360px]:gap-1.5 px-2.5 min-[360px]:px-3 py-1.5 rounded-full glass-panel text-[10px] min-[360px]:text-[11px] sm:text-xs transition-all duration-300 active:scale-95 ${
                    isSelected
                      ? 'border-black shadow-md scale-105 font-semibold text-[var(--theme-text)] bg-white'
                      : 'border-black/10 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]'
                  }`}
                >
                  <span
                    className="w-3 h-3 min-[360px]:w-3.5 min-[360px]:h-3.5 rounded-full border border-black/15 shadow-inner shrink-0"
                    style={{ backgroundColor: mat.colorHex }}
                  />
                  <span className="tracking-wide whitespace-nowrap">{mat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Viewer Navigation & Bag CTA */}
          <div className="flex flex-col min-[420px]:flex-row items-stretch min-[420px]:items-center gap-2.5 sm:gap-3 w-full lg:w-auto justify-center lg:justify-end">
            <div className="flex items-center justify-center gap-1 glass-pill p-1 rounded-full self-center min-[420px]:self-auto">
              <button
                onClick={() => handleZoom('in')}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center hover:bg-white/80 active:scale-90 transition-colors text-[var(--theme-text)]"
                title="Zoom In"
                aria-label="Zoom in on 3D model"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleZoom('out')}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center hover:bg-white/80 active:scale-90 transition-colors text-[var(--theme-text)]"
                title="Zoom Out"
                aria-label="Zoom out on 3D model"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleReset}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center hover:bg-white/80 active:scale-90 transition-colors text-[var(--theme-text)]"
                title="Reset View"
                aria-label="Reset 3D camera"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={(e) => {
                const colorMatch = lunaProduct.colors.find((c) =>
                  c.name.toLowerCase().includes(selectedMaterial.id)
                ) || lunaProduct.colors[0];
                addToCart(lunaProduct, colorMatch, 1, e);
              }}
              className="w-full min-[420px]:w-auto px-5 min-[360px]:px-6 py-2.5 sm:py-3 rounded-full bg-[var(--theme-text)] text-[var(--theme-bg)] text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:opacity-90 active:scale-95 shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag • ₹{lunaProduct.price}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
