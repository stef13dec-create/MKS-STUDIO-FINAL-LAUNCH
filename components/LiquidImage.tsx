"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Global texture cache shared across all LiquidImage instances
const textureCache: Record<string, THREE.Texture> = {};

interface LiquidImageProps {
  src: string;
  alt?: string;
  className?: string;
  fit?: "cover" | "contain";
}

const DISTORTION_STRENGTH = 0.015;
const RIPPLE_RADIUS = 0.12;
const FADE_SPEED = 0.015;
const TRAIL_LENGTH = 50;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform vec3 uTrail[${TRAIL_LENGTH}];
  uniform float uDistortionStrength;
  uniform float uRippleRadius;
  uniform bool uContain;

  varying vec2 vUv;

  void main() {
    float s = uResolution.x / uResolution.y;
    float i = uImageResolution.x / uImageResolution.y;

    vec2 ratio;
    if (uContain) {
      ratio = (s > i) ? vec2(s / i, 1.0) : vec2(1.0, i / s);
    } else {
      ratio = (s > i) ? vec2(1.0, i / s) : vec2(s / i, 1.0);
    }

    vec2 uv = (vUv - 0.5) * ratio + 0.5;

    if (!uContain) {
      if (ratio.y > 1.0) {
        uv.y = vUv.y * ratio.y;
      }
    }

    if (uContain && (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0)) {
      discard;
    }

    vec2 distortion = vec2(0.0);

    for(int i = 0; i < ${TRAIL_LENGTH}; i++) {
      vec3 point = uTrail[i];
      float age = point.z;

      if (age > 0.0 && age < 1.0) {
        vec2 pos = point.xy;

        vec2 uvCorrected = vUv * uResolution;
        vec2 posCorrected = pos * uResolution;

        float dist = distance(uvCorrected, posCorrected) / max(uResolution.x, uResolution.y);

        if (dist < uRippleRadius) {
          vec2 dir = normalize(vUv - pos);
          float falloff = smoothstep(uRippleRadius, 0.0, dist);
          float ageFade = smoothstep(1.0, 0.0, age);
          distortion += dir * falloff * ageFade * uDistortionStrength;
        }
      }
    }

    vec4 color = texture2D(uTexture, uv - distortion);
    gl_FragColor = color;
  }
`;

export default function LiquidImage({ src, alt, className = "", fit = "contain" }: LiquidImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Stable WebGL state — all live in refs so they persist across re-renders and src changes
  const rendererRef   = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef      = useRef<THREE.Scene | null>(null);
  const cameraRef     = useRef<THREE.OrthographicCamera | null>(null);
  const materialRef   = useRef<THREE.ShaderMaterial | null>(null);
  const meshRef       = useRef<THREE.Mesh | null>(null);
  const startLoopRef  = useRef<(() => void) | null>(null);
  const trailDataRef  = useRef(new Float32Array(TRAIL_LENGTH * 3));
  const mouseRef      = useRef({
    pos: new THREE.Vector2(0.5, 0.5),
    target: new THREE.Vector2(0.5, 0.5),
    trailIndex: 0,
  });
  const loopRef = useRef({ running: false, frameId: 0, isHovering: false });

  // ── Effect A: mount only ─────────────────────────────────────────────────────
  // Creates the WebGL renderer, scene, camera, event listeners, and render loop.
  // This runs ONCE for the component lifetime — never recreated on src changes.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
      precision: "mediump",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    sceneRef.current    = scene;
    cameraRef.current   = camera;
    rendererRef.current = renderer;

    const tick = () => {
      const loop  = loopRef.current;
      const trail = trailDataRef.current;
      const mouse = mouseRef.current;
      let hasActivity = false;

      for (let i = 0; i < TRAIL_LENGTH; i++) {
        if (trail[i * 3 + 2] > 0) {
          trail[i * 3 + 2] += FADE_SPEED;
          if (trail[i * 3 + 2] >= 1) {
            trail[i * 3 + 2] = 0;
          } else {
            hasActivity = true;
          }
        }
      }

      if (loop.isHovering) {
        if (mouse.pos.distanceTo(mouse.target) > 0.001) {
          mouse.pos.lerp(mouse.target, 0.3);
          trail[mouse.trailIndex * 3]     = mouse.pos.x;
          trail[mouse.trailIndex * 3 + 1] = mouse.pos.y;
          trail[mouse.trailIndex * 3 + 2] = 0.01;
          mouse.trailIndex = (mouse.trailIndex + 1) % TRAIL_LENGTH;
        }
        hasActivity = true;
      }

      if (materialRef.current) {
        materialRef.current.uniforms.uTrail.value = trail;
      }

      renderer.render(scene, camera);

      if (loop.isHovering || hasActivity) {
        loop.frameId = requestAnimationFrame(tick);
      } else {
        loop.running = false;
      }
    };

    const startLoop = () => {
      if (!loopRef.current.running) {
        loopRef.current.running = true;
        tick();
      }
    };
    startLoopRef.current = startLoop;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.target.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.target.y = 1 - (e.clientY - rect.top) / rect.height;
    };
    const handleMouseEnter = (e: MouseEvent) => {
      loopRef.current.isHovering = true;
      const rect = container.getBoundingClientRect();
      mouseRef.current.pos.x    = mouseRef.current.target.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.pos.y    = mouseRef.current.target.y = 1 - (e.clientY - rect.top) / rect.height;
      startLoop();
    };
    const handleMouseLeave  = () => { loopRef.current.isHovering = false; };
    const handleTouchStart  = (e: TouchEvent) => {
      loopRef.current.isHovering = true;
      const touch = e.touches[0];
      const rect  = container.getBoundingClientRect();
      mouseRef.current.pos.x    = mouseRef.current.target.x = (touch.clientX - rect.left) / rect.width;
      mouseRef.current.pos.y    = mouseRef.current.target.y = 1 - (touch.clientY - rect.top) / rect.height;
      startLoop();
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const rect  = container.getBoundingClientRect();
      mouseRef.current.target.x = (touch.clientX - rect.left) / rect.width;
      mouseRef.current.target.y = 1 - (touch.clientY - rect.top) / rect.height;
    };
    const handleTouchEnd  = () => { loopRef.current.isHovering = false; };
    const handleResize    = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height);
      if (materialRef.current) {
        materialRef.current.uniforms.uResolution.value.set(width, height);
      }
    };

    container.addEventListener('mousemove',  handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove',  handleTouchMove,  { passive: true });
    container.addEventListener('touchend',   handleTouchEnd,   { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(loopRef.current.frameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove',  handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove',  handleTouchMove);
      container.removeEventListener('touchend',   handleTouchEnd);
      if (meshRef.current)     { meshRef.current.geometry.dispose(); scene.remove(meshRef.current); }
      if (materialRef.current) { materialRef.current.dispose(); }
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []); // mount / unmount only — renderer is never recreated

  // ── Effect B: texture swap ───────────────────────────────────────────────────
  // Runs on every src / fit change (including the initial mount, after Effect A).
  // Only swaps the texture and material — the renderer stays alive.
  useEffect(() => {
    const scene    = sceneRef.current;
    const renderer = rendererRef.current;
    if (!scene || !renderer) return;

    const resolvedSrc =
      src.startsWith('http') || src.startsWith('blob:') || src.startsWith('data:')
        ? src
        : (process.env.NODE_ENV === 'production' ? '/MKS-STUDIO-FINAL-LAUNCH' : '') +
          (src.startsWith('/') ? src : `/${src}`);

    const applyTexture = (texture: THREE.Texture) => {
      // Remove old mesh and material
      if (meshRef.current)     { scene.remove(meshRef.current); meshRef.current.geometry.dispose(); }
      if (materialRef.current) { materialRef.current.dispose(); }

      const { width, height } = renderer.domElement;
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTexture:           { value: texture },
          uResolution:        { value: new THREE.Vector2(width, height) },
          uImageResolution:   { value: new THREE.Vector2((texture.image as HTMLImageElement).width, (texture.image as HTMLImageElement).height) },
          uTrail:             { value: trailDataRef.current },
          uDistortionStrength:{ value: DISTORTION_STRENGTH },
          uRippleRadius:      { value: RIPPLE_RADIUS },
          uContain:           { value: fit === "contain" },
        },
      });

      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
      scene.add(mesh);
      materialRef.current = material;
      meshRef.current     = mesh;

      startLoopRef.current?.(); // render at least one frame to show the new image
    };

    if (textureCache[resolvedSrc]) {
      applyTexture(textureCache[resolvedSrc]);
    } else {
      const loader = new THREE.TextureLoader();
      loader.crossOrigin = 'anonymous';
      loader.load(
        resolvedSrc,
        (texture) => { textureCache[resolvedSrc] = texture; applyTexture(texture); },
        undefined,
        (err) => console.error(`LiquidImage: failed to load "${src}"`, err),
      );
    }
  }, [src, fit]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden ${className}`}
      style={{ position: 'relative' }}
      aria-label={alt}
      role="img"
    />
  );
}
