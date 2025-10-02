'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Author: Gabriel Camelo; holysmoke003[at]gmail.com; @camelo003
// Title: Copacabana Sidewalks
// Edited by: Phantom Digital to adapt with React + Three.js

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec3 u_colorA; // primary stripe color
  uniform vec3 u_colorB; // secondary stripe color
  uniform float u_alphaA; // primary alpha
  uniform float u_alphaB; // secondary alpha
  
  varying vec2 vUv;
  
  // This values change:
  float tiles = 12.0; //	-Number of v tiles
  float freq = 3.0; //	-Frequency of waves (back to original)
  float amp = 4.0; //  -Amplitude of waves (back to original)
  float vel = 0.008; //  -Velocity of animation (back to original)
  
  void main() {
    // Get the XY coordinate of each pixel, using gl_FragCoord for consistent scaling
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // Since the scene is rotated 90 degrees, swap x and y to get bottom-to-top movement
    // and normalize for wider setups
    float aspectRatio = u_resolution.x / u_resolution.y;
    vec2 coord = vec2(st.y, st.x);
    
    // Scale the pattern appropriately for the coordinate system
    // Adjust the multiplier to get the right pattern density
    coord.x = coord.x * tiles;
    coord.y = coord.y * aspectRatio;
    
    // Original Copacabana calculation with coordinate swap for proper direction
    vec3 color = vec3(step(0.5, mod(coord.x + sin((pow(coord.y, 2.0) - u_time * vel) * 3.14 * freq) * amp, 1.0)));
    
    // Use two configurable colors instead of black/white
    if (color.r > 0.5) {
      gl_FragColor = vec4(u_colorA, u_alphaA);
    } else {
      gl_FragColor = vec4(u_colorB, u_alphaB);
    }

    // Apply renderer tone mapping and output color space (sRGB)
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

interface CopacabanaShaderProps {
  width?: number;
  height?: number;
  primaryColor?: string; // hex or css color for the first stripe
  secondaryColor?: string; // hex or css color for the second stripe
  primaryAlpha?: number; // 0..1
  secondaryAlpha?: number; // 0..1
  opacity?: number; // 0..1 overall opacity of the entire shader
}

export default function CopacabanaShader({ width = 800, height = 600, primaryColor = '#EF3827', secondaryColor = '#000000', primaryAlpha = 1.0, secondaryAlpha = 1.0, opacity = 1.0 }: CopacabanaShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Check if mobile once for performance settings
    const isMobile = window.innerWidth < 768;

    // Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true,
      antialias: false, // Disable antialiasing on mobile for performance
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height, false); // false = don't update canvas style
    // Limit pixel ratio on mobile devices for better performance
    const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 1) : Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    // Ensure color management matches CSS/hex expectations
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    // Make the canvas itself transparent so parent/background shows through
    renderer.setClearColor(0x000000, 0);
    renderer.setClearAlpha(0);
    rendererRef.current = renderer;

    // Shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0.0 },
        u_resolution: { value: new THREE.Vector2(width, height) },
        // Convert CSS/sRGB colors to linear for accurate on-screen color
        u_colorA: { value: new THREE.Color(primaryColor).convertSRGBToLinear() },
        u_colorB: { value: new THREE.Color(secondaryColor).convertSRGBToLinear() }
        ,u_alphaA: { value: primaryAlpha },
        u_alphaB: { value: secondaryAlpha }
      },
      vertexShader,
      fragmentShader,
      transparent: true // allow alpha from uniforms
    });
    materialRef.current = material;

    // Plane geometry
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation loop - throttle on mobile
    let lastTime = 0;
    const targetFPS = isMobile ? 30 : 60; // 30fps on mobile, 60fps on desktop
    const frameInterval = 1000 / targetFPS;
    
    const animate = (currentTime: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      const deltaTime = currentTime - lastTime;
      if (deltaTime < frameInterval) {
        return; // Skip frame if not enough time has passed
      }
      
      lastTime = currentTime - (deltaTime % frameInterval);
      
      if (materialRef.current) {
        materialRef.current.uniforms.u_time.value += 0.016; // ~60fps time increment
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate(0);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (materialRef.current) {
        materialRef.current.dispose();
      }
      geometry.dispose();
    };
  }, [width, height]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (rendererRef.current && materialRef.current) {
        rendererRef.current.setSize(width, height, false);
        materialRef.current.uniforms.u_resolution.value.set(width, height);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, height]);

  // Update colors when props change
  useEffect(() => {
    if (!materialRef.current) return;
    const uniforms = materialRef.current.uniforms;
    (uniforms.u_colorA.value as THREE.Color).set(primaryColor).convertSRGBToLinear();
    (uniforms.u_colorB.value as THREE.Color).set(secondaryColor).convertSRGBToLinear();
    uniforms.u_alphaA.value = primaryAlpha;
    uniforms.u_alphaB.value = secondaryAlpha;
  }, [primaryColor, secondaryColor, primaryAlpha, secondaryAlpha]);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-full"
      style={{ 
        display: 'block', 
        background: 'transparent', 
        opacity: opacity,
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  );
}
