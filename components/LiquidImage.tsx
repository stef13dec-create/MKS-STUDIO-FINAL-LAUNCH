"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { getPath } from '@/lib/utils';

interface LiquidImageProps {
  src: string;
  alt?: string;
  className?: string;
}

export default function LiquidImage({ src, alt, className = "" }: LiquidImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
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
      
      varying vec2 vUv;

      void main() {
        vec2 ratio = vec2(
          min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
          min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
        );
        vec2 uv = vec2(
          vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
          vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
        );

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

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      getPath(src),
      (texture) => {
        material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: {
            uTexture: { value: texture },
            uResolution: { value: new THREE.Vector2(width, height) },
            uImageResolution: { value: new THREE.Vector2(texture.image.width, texture.image.height) },
            uTrail: { value: trailData },
            uDistortionStrength: { value: DISTORTION_STRENGTH },
            uRippleRadius: { value: RIPPLE_RADIUS }
          }
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        // Initial render to display the image, then loop stops
        startLoop();
      },
      undefined,
      (err) => {
        console.error(`LiquidImage: failed to load texture "${src}"`, err);
      }
    );

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
  }, [src]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full overflow-hidden ${className}`}
      style={{ position: 'relative' }}
    />
  );
}
