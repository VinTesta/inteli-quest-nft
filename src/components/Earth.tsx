
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, useTexture } from "@react-three/drei";
import * as THREE from "three";

const RotatingEarth = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const texture = useTexture("/src/assets/earth.jpg");

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Sphere ref={meshRef} args={[2, 32, 32]}>
      <meshStandardMaterial map={texture} />
    </Sphere>
  );
};

const Earth = () => {
  return (
    <Canvas style={{ height: "800px" }}>
      <ambientLight intensity={6} />
      <directionalLight position={[2, 5, 2]} intensity={1} />
      <RotatingEarth />
    </Canvas>
  );
};

export default Earth;
