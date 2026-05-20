'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function AuroraBorealis() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(random(i), random(i + vec2(1.0,0.0)), u.x),
          mix(random(i + vec2(0.0,1.0)), random(i + vec2(1.0,1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
        float t = iTime * 0.2;

        vec2 p = uv;
        p.y += 0.5;
        float f = fbm(vec2(p.x * 2.0, p.y + t));
        float curtain = smoothstep(0.1, 0.5, f) * (1.0 - p.y);

        vec3 c1 = vec3(0.1, 0.8, 0.5);
        vec3 c2 = vec3(0.8, 0.2, 0.8);

        vec3 color = mix(c1, c2, p.y) * curtain;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const uniforms = {
      iTime:       { value: 0 },
      iResolution: { value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.iResolution.value.set(w, h);
    };
    window.addEventListener('resize', onResize);
    onResize();

    renderer.setAnimationLoop(() => {
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    });

    return () => {
      window.removeEventListener('resize', onResize);
      renderer.setAnimationLoop(null);
      const canvas = renderer.domElement;
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         '100vw',
        height:        '100vh',
        zIndex:        0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
