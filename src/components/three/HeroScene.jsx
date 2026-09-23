"use client";
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

const WavingFabric = () => {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const positions = meshRef.current.geometry.attributes.position;
    
    // Animate vertices to look like blowing fabric
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      
      // Complex wave pattern for cloth-like movement
      const z = Math.sin(x * 1.5 + time * 1.2) * 0.15 + 
                Math.cos(y * 1.5 + time * 0.8) * 0.15 +
                Math.sin(x * y * 0.5 + time) * 0.1;
                
      positions.setZ(i, z);
    }
    
    positions.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1}>
      <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} scale={1.8}>
        <planeGeometry args={[4, 4, 64, 64]} />
        <meshPhysicalMaterial 
          color="#111111"
          roughness={0.8}
          metalness={0.2}
          clearcoat={0.1}
          clearcoatRoughness={0.3}
          side={THREE.DoubleSide}
          wireframe={false}
        />
      </mesh>
    </Float>
  );
};

export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      <Environment preset="city" />
      <WavingFabric />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.5} 
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />
    </Canvas>
  );
}
