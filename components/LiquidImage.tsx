"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Global texture cache to prevent synchronous decoding lag when LiquidImage mounts
const textureCache: Record<string, THREE.Texture> = {};

interface LiquidImageProps {
  src: string;
  alt?: string;
  className?: string;
  fit?: "cover" | "contain";
}

export default function LiquidImage({ src, alt, className = "", fit = "contain" }: LiquidImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Force preload of next image if we can guess it? Not needed if cache persists
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Turn off antialias for performance
      alpha: true,
      powerPreference: "high-performance",
      precision: "mediump"
    });
    
    // Explicitly limit pixel ratio on mobile
    const pixelRatio = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1;
    renderer.setPixelRatio(pixelRatio);
    
    // Set initial size
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const DISTORTION_STRENGTH = 0.015;
    const RIPPLE_RADIUS = 0.12;
    const FADE_SPEED = 0.015;
    const TRAIL_LENGTH = 50;

    const trailData = new Float32Array(TRAIL_LENGTH * 3);

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

        // Default to center
        vec2 uv = (vUv - 0.5) * ratio + 0.5;

        // If cover, align to bottom to prevent clipping the ground of buildings
        if (!uContain) {
          // ratio > 1 means the image is being cropped in that dimension.
          // ratio.y > 1.0 means we are cropping top/bottom.
          // By default, vUv=0 -> uv=0.5 - ratio.y/2. We want vUv=0 -> uv=0.
          if (ratio.y > 1.0) {
            uv.y = vUv.y * ratio.y; // Align to bottom (vUv.y = 0 evaluates to uv.y = 0)
          }
        }

        // Discard UVs outside 0-1 range for contain mode
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

    let material: THREE.ShaderMaterial | null = null;
    let mesh: THREE.Mesh | null = null;

    const mouse = new THREE.Vector2(0.5, 0.5);
    const targetMouse = new THREE.Vector2(0.5, 0.5);
    let currentTrailIndex = 0;
    let isHovering = false;
    let animationFrameId: number;
    let loopRunning = false;

    // Render loop — self-stops when there's no visual activity
    const tick = () => {
      let hasTrailActivity = false;

      for (let i = 0; i < TRAIL_LENGTH; i++) {
        if (trailData[i * 3 + 2] > 0.0) {
          trailData[i * 3 + 2] += FADE_SPEED;
          if (trailData[i * 3 + 2] >= 1.0) {
            trailData[i * 3 + 2] = 0.0;
          } else {
            hasTrailActivity = true;
          }
        }
      }

      if (isHovering) {
        const dist = mouse.distanceTo(targetMouse);
        if (dist > 0.001) {
          mouse.lerp(targetMouse, 0.3);
          trailData[currentTrailIndex * 3] = mouse.x;
          trailData[currentTrailIndex * 3 + 1] = mouse.y;
          trailData[currentTrailIndex * 3 + 2] = 0.01;
          currentTrailIndex = (currentTrailIndex + 1) % TRAIL_LENGTH;
        }
        hasTrailActivity = true;
      }

      if (material) {
        material.uniforms.uTrail.value = trailData;
      }

      renderer.render(scene, camera);

      if (isHovering || hasTrailActivity) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        loopRunning = false;
      }
    };

    const startLoop = () => {
      if (!loopRunning) {
        loopRunning = true;
        tick();
      }
    };

    const resolvedSrc = src.startsWith('http') || src.startsWith('blob:') || src.startsWith('data:')
      ? src
      : (process.env.NODE_ENV === 'production' ? '/MKS-STUDIO-FINAL-LAUNCH' : '') + (src.startsWith('/') ? src : `/${src}`);

    const setupMaterial = (texture: THREE.Texture) => {
      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTexture: { value: texture },
          uResolution: { value: new THREE.Vector2(width, height) },
          uImageResolution: { value: new THREE.Vector2((texture.image as HTMLImageElement).width, (texture.image as HTMLImageElement).height) },
          uTrail: { value: trailData },
          uDistortionStrength: { value: DISTORTION_STRENGTH },
          uRippleRadius: { value: RIPPLE_RADIUS },
          uContain: { value: fit === "contain" }
        }
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      startLoop();
    };

    if (textureCache[resolvedSrc]) {
      setupMaterial(textureCache[resolvedSrc]);
    } else {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.crossOrigin = 'anonymous';
      textureLoader.load(
        resolvedSrc,
        (texture) => {
          textureCache[resolvedSrc] = texture;
          setupMaterial(texture);
        },
        undefined,
        (err) => {
          console.error(`LiquidImage: failed to load texture "${src}"`, err);
        }
      );
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x = (e.clientX - rect.left) / rect.width;
      targetMouse.y = 1.0 - ((e.clientY - rect.top) / rect.height);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      isHovering = true;
      const rect = container.getBoundingClientRect();
      mouse.x = targetMouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = targetMouse.y = 1.0 - ((e.clientY - rect.top) / rect.height);
      startLoop(); // Resume animation on hover
    };

    const handleMouseLeave = () => {
      isHovering = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      isHovering = true;
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      mouse.x = targetMouse.x = (touch.clientX - rect.left) / rect.width;
      mouse.y = targetMouse.y = 1.0 - ((touch.clientY - rect.top) / rect.height);
      startLoop(); // Resume animation on touch
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      targetMouse.x = (touch.clientX - rect.left) / rect.width;
      targetMouse.y = 1.0 - ((touch.clientY - rect.top) / rect.height);
    };

    const handleTouchEnd = () => {
      isHovering = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height);
      if (material) {
        material.uniforms.uResolution.value.set(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      
      if (mesh) {
        mesh.geometry.dispose();
      }
      if (material) {
        material.dispose();
        if (material.uniforms.uTexture.value) {
          material.uniforms.uTexture.value.dispose();
        }
      }
      renderer.dispose();
    };
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
