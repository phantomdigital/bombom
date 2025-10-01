'use client';

import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface StrawberryParticlesProps {
  modelPath?: string;
  particleCount?: number;
  spawnRate?: number;
  opacity?: number;
}

interface Particle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  rotation: THREE.Vector3;
  life: number;
  maxLife: number;
  gravity: number;
  airResistance: number;
  wobbleSpeed: number;
  wobbleAmount: number;
}

export default function StrawberryParticles({
  modelPath = '/images/models/strawberry.glb', // Updated to your actual path
  particleCount = 100, // Strawberry waterfall - many visible at once
  spawnRate = 6.0, // Higher spawn rate - 6 per second for more consistent flow
  opacity = 0.8
}: StrawberryParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const strawberryGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const strawberryMaterialRef = useRef<THREE.Material | null>(null);
  const lastSpawnTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Performance optimized material
  const particleMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: 0xed5878, // Strawberry pink
      transparent: true,
      opacity: opacity,
      side: THREE.DoubleSide,
    });
  }, [opacity]);

  // Load 3D model
  useEffect(() => {
    const loader = new GLTFLoader();
    
    // For now, create a simple strawberry-shaped geometry as placeholder
    const createPlaceholderGeometry = () => {
      const geometry = new THREE.SphereGeometry(0.1, 8, 6);
      // Slightly elongate to be more strawberry-like
      geometry.scale(1, 1.2, 1);
      return geometry;
    };

    // Try to load the actual model, fallback to placeholder
    console.log('Attempting to load strawberry model from:', modelPath);
    loader.load(
      modelPath,
      (gltf) => {
        console.log('GLTF loaded successfully:', gltf);
        console.log('Scene children:', gltf.scene.children);
        
        // Try to find a mesh in the scene
        let foundMesh: THREE.Mesh | null = null;
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh && !foundMesh) {
            foundMesh = child;
            console.log('Found mesh:', child);
            console.log('Mesh material:', child.material);
            
            // Log material properties
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((mat, i) => {
                  console.log(`Material ${i}:`, mat);
                  console.log(`Material ${i} map:`, mat.map);
                });
              } else {
                console.log('Single material:', child.material);
                console.log('Material map:', child.material.map);
                console.log('Material color:', child.material.color);
              }
            }
          }
        });

        if (foundMesh && foundMesh.geometry) {
          console.log('Using loaded strawberry geometry');
          const geometry = foundMesh.geometry.clone();
          
          // Scale down the geometry to reasonable size
          geometry.scale(0.05, 0.05, 0.05); // Make it much smaller
          
          strawberryGeometryRef.current = geometry;
          
          // Use the original material from the GLTF file to preserve textures
          if (foundMesh.material) {
            console.log('Using original material from GLTF:', foundMesh.material);
            
            // Check if material has textures and they're loaded
            let materialToUse = foundMesh.material;
            
            // Convert to flat, cartoony materials for particle system effect
            if (Array.isArray(materialToUse)) {
              materialToUse = materialToUse.map(mat => {
                // Convert to unlit basic material for cartoon look
                return new THREE.MeshBasicMaterial({
                  map: mat.map, // Keep the texture
                  color: new THREE.Color(0xff69b4), // Bright cartoon pink
                  transparent: true,
                  opacity: opacity
                });
              });
              console.log('Using flat cartoon pink material array');
            } else {
              // Convert to simple unlit material for cartoon particle effect
              materialToUse = new THREE.MeshBasicMaterial({
                map: materialToUse.map, // Keep the strawberry texture
                color: new THREE.Color(0xff69b4), // Bright cartoon pink tint
                transparent: true,
                opacity: opacity
              });
              console.log('Using flat cartoon pink material');
            }
            
            strawberryMaterialRef.current = materialToUse;
          } else {
            console.log('No material found, using fallback');
            strawberryMaterialRef.current = particleMaterial;
          }
        } else {
          console.log('No mesh found in GLTF, using placeholder');
          strawberryGeometryRef.current = createPlaceholderGeometry();
          strawberryMaterialRef.current = particleMaterial;
        }
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Failed to load strawberry model:', error);
        console.log('Using placeholder geometry for strawberries');
        strawberryGeometryRef.current = createPlaceholderGeometry();
        strawberryMaterialRef.current = particleMaterial;
      }
    );
  }, [modelPath, particleMaterial]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Orthographic camera for true isometric/flat look - closer view
    const frustumSize = 4;  // Smaller frustum = closer/larger view
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(
      -frustumSize * aspect / 2, // left
      frustumSize * aspect / 2,  // right
      frustumSize / 2,           // top
      -frustumSize / 2,          // bottom
      0.1,                       // near
      1000                       // far
    );
    camera.position.z = 5;  // Much closer to the strawberries
    cameraRef.current = camera;

    // Minimal flat lighting for cartoon effect - ensures uniform brightness
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Neutral ambient for base
    scene.add(ambientLight);
    
    // Flat frontal light to prevent dark bottoms
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.4);
    frontLight.position.set(0, 0, 10); // Directly frontal
    scene.add(frontLight);

    // Renderer setup with performance optimizations
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: false, // Disable for performance
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Performance optimizations
    renderer.shadowMap.enabled = false; // Disable shadows
    renderer.setAnimationLoop(null); // We'll handle our own loop
    
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (renderer) {
        renderer.dispose();
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Check if position collides with existing particles
  const checkCollision = (newPosition: THREE.Vector3, minDistance: number = 0.3): boolean => {
    return particlesRef.current.some(particle => {
      const distance = particle.mesh.position.distanceTo(newPosition);
      return distance < minDistance;
    });
  };

  // Find a non-overlapping position
  const findSafePosition = (): THREE.Vector3 => {
    let attempts = 0;
    const maxAttempts = 20;
    
    while (attempts < maxAttempts) {
      const testPosition = new THREE.Vector3(
        0.2 + Math.random() * 2.8, // Much wider area - from center-left to far right
        2.5 + Math.random() * 1,    // Much lower spawn - visible immediately
        -1 + Math.random() * 2      // More depth variation
      );
      
      if (!checkCollision(testPosition)) {
        return testPosition;
      }
      attempts++;
    }
    
    // If we can't find a safe position after many attempts, use a spread-out position
    return new THREE.Vector3(
      -0.5 + Math.random() * 4.0, // Much wider spread - even further left
      2.5 + Math.random() * 2,     // Lower spawn for immediate visibility
      -2 + Math.random() * 4       // Deeper spread
    );
  };

  // Create a new particle
  const createParticle = (): Particle | null => {
    if (!strawberryGeometryRef.current || !strawberryMaterialRef.current || !sceneRef.current) return null;

    // Clone the material to avoid shared state issues
    let materialClone;
    const originalMaterial = strawberryMaterialRef.current;
    
    if (Array.isArray(originalMaterial)) {
      // Handle material array
      materialClone = originalMaterial.map(mat => {
        const cloned = mat.clone();
        cloned.transparent = true; // Enable transparency for fading
        return cloned;
      });
    } else {
      // Handle single material
      materialClone = originalMaterial.clone();
      materialClone.transparent = true; // Enable transparency for fading
    }
    
    const mesh = new THREE.Mesh(strawberryGeometryRef.current, materialClone);
    
    // Position with collision detection
    const safePosition = findSafePosition();
    mesh.position.copy(safePosition);

    // Random scale for variety
    const scale = 0.6 + Math.random() * 0.6;
    mesh.scale.setScalar(scale);

    // Try different rotation to make strawberry upright
    mesh.rotation.set(
      0,                                 // No X rotation
      0,                                 // No Y rotation  
      Math.PI / 2 + (Math.random() - 0.5) * 0.15  // Rotate around Z axis with slight variance
    );

    sceneRef.current.add(mesh);

    return {
      mesh,
      velocity: new THREE.Vector3(
        -0.0004 - Math.random() * 0.0006,  // Even slower initial horizontal velocity
        -0.00015 - Math.random() * 0.00025,  // Half the initial downward velocity
        0
      ),
      rotation: new THREE.Vector3(
        0, // No X rotation - stay perfectly upright
        0, // No Y rotation - no spinning at all
        (Math.random() - 0.5) * 0.002  // Minimal Z rotation for wobble
      ),
      life: 0,
      maxLife: 80 + Math.random() * 40, // 80-120 seconds - doubled lifespan
      gravity: 0.000004 + Math.random() * 0.000002, // Half the gravity strength
      airResistance: 0.999 + Math.random() * 0.0008, // 0.999-0.9998 even higher air resistance
      wobbleSpeed: 0.15 + Math.random() * 0.25, // Slower wobble
      wobbleAmount: 0.015 + Math.random() * 0.02 // Even gentler wobble
    };
  };

  // Update particles
  const updateParticles = (deltaTime: number) => {
    if (!sceneRef.current) return;

    // Update existing particles
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.life += deltaTime;
      
      // Apply gravity - accelerate downward over time
      particle.velocity.y -= particle.gravity;
      
      // Apply air resistance - slow down slightly
      particle.velocity.multiplyScalar(particle.airResistance);
      
      // Add natural wobble/sway (sine wave for smooth motion)
      const wobbleOffset = Math.sin(particle.life * particle.wobbleSpeed) * particle.wobbleAmount;
      particle.mesh.position.x += wobbleOffset * 0.01;
      
      // Calculate new position
      const newPosition = particle.mesh.position.clone().add(particle.velocity);
      
      // Check for collisions with other particles and react properly
      particlesRef.current.forEach(otherParticle => {
        if (otherParticle === particle) return;
        
        const distance = particle.mesh.position.distanceTo(otherParticle.mesh.position);
        const minDistance = 0.3;
        
        if (distance < minDistance && distance > 0) {
          // Calculate collision direction
          const collisionVector = new THREE.Vector3()
            .subVectors(particle.mesh.position, otherParticle.mesh.position)
            .normalize();
          
          // Calculate overlap amount
          const overlap = minDistance - distance;
          const pushForce = overlap * 0.5;
          
          // Apply collision forces (elastic collision)
          const relativeVelocity = new THREE.Vector3()
            .subVectors(particle.velocity, otherParticle.velocity);
          
          const velocityAlongNormal = relativeVelocity.dot(collisionVector);
          
          // Only resolve if objects are moving towards each other
          if (velocityAlongNormal > 0) return;
          
          // Apply very gentle restitution - much softer collision
          const restitution = 0.1;  // Much less bouncy
          const impulse = -(1 + restitution) * velocityAlongNormal;
          const impulseVector = collisionVector.clone().multiplyScalar(impulse * 0.0003); // Much weaker force
          
          // Apply gentle impulse to both particles
          particle.velocity.add(impulseVector);
          otherParticle.velocity.sub(impulseVector);
          
          // Gently separate overlapping particles
          const separation = collisionVector.clone().multiplyScalar(pushForce * 0.3); // Gentler separation
          particle.mesh.position.add(separation);
          otherParticle.mesh.position.sub(separation);
          
          // Add very minimal rotation from collision - only if not already spinning much
          const currentRotationSpeed = Math.abs(particle.rotation.z);
          if (currentRotationSpeed < 0.005) {
            particle.rotation.z += (Math.random() - 0.5) * 0.003; // Much smaller rotation
          }
          const otherRotationSpeed = Math.abs(otherParticle.rotation.z);
          if (otherRotationSpeed < 0.005) {
            otherParticle.rotation.z += (Math.random() - 0.5) * 0.003;
          }
        }
      });
      
      // Update position
      particle.mesh.position.add(particle.velocity);
      
      // Apply rotation damping to prevent excessive spinning
      particle.rotation.z *= 0.98; // Gradually slow down rotation
      
      // Subtle rotation wobble
      particle.mesh.rotation.z += particle.rotation.z;

      // Fade out near end of life
      const lifeRatio = particle.life / particle.maxLife;
      if (lifeRatio > 0.8) {
        const fadeRatio = 1 - (lifeRatio - 0.8) / 0.2;
        const material = particle.mesh.material;
        
        // Handle both single materials and material arrays
        if (Array.isArray(material)) {
          material.forEach(mat => {
            if ('opacity' in mat) {
              mat.opacity = opacity * fadeRatio;
            }
          });
        } else if ('opacity' in material) {
          material.opacity = opacity * fadeRatio;
        }
      }

      // Remove if dead or off screen
      if (particle.life >= particle.maxLife || 
          particle.mesh.position.y < -3 || 
          particle.mesh.position.x < -3) {
        sceneRef.current?.remove(particle.mesh);
        return false;
      }

      return true;
    });

    // Spawn new particles with more consistent timing
    const currentTime = performance.now() / 1000;
    const spawnInterval = 1 / spawnRate;
    const timeSinceLastSpawn = currentTime - lastSpawnTimeRef.current;
    
    // Allow multiple spawns if we're behind schedule (prevents gaps)
    if (timeSinceLastSpawn > spawnInterval && particlesRef.current.length < particleCount) {
      const spawnCount = Math.min(3, Math.floor(timeSinceLastSpawn / spawnInterval)); // Spawn up to 3 at once if behind
      
      for (let i = 0; i < spawnCount; i++) {
        const newParticle = createParticle();
        if (newParticle) {
          particlesRef.current.push(newParticle);
        }
      }
      lastSpawnTimeRef.current = currentTime;
    }
  };

  // Animation loop
  useEffect(() => {
    let lastTime = 0;
    
    const animate = (currentTime: number) => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      updateParticles(deltaTime);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [spawnRate, particleCount, opacity]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
    />
  );
}
