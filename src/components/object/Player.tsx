import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

interface PlayerProps {
  position: [number, number, number];
  rotation: number; // 0=北, 1=東, 2=南, 3=西
}

const Player: React.FC<PlayerProps> = ({ position, rotation }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const textures = useTexture([
    "/assets/textures/cube/test1.png",
    "/assets/textures/cube/test2.png",
    "/assets/textures/cube/test3.png",
    "/assets/textures/cube/test4.png",
    "/assets/textures/cube/test5.png",
    "/assets/textures/cube/test6.png",
  ]);

  // メッシュの位置と回転を更新
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(position[0], position[1], position[2]);
      meshRef.current.rotation.y = -(rotation * Math.PI) / 2;
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        {textures.map((texture, index) => (
          <meshStandardMaterial
            key={index}
            attach={`material-${index}`}
            map={texture}
          />
        ))}
      </mesh>
    </>
  );
};

export default Player;
