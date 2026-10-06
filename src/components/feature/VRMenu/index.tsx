import { useState, useRef } from 'react';
import { RoundedBox, Text } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import { useNavigate } from 'react-router-dom';
import { useFrame } from '@react-three/fiber';

import * as THREE from 'three';

interface NumpadButtonProps {
  position: [number, number, number];
  label: string;
  onClick: () => void;
  width?: number;
  color?: string;
  hoverColor?: string;
}

function VRButton({ position, label, onClick, width = 0.396, color = '#333', hoverColor = '#555' }: NumpadButtonProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null!);
  const textGroupRef = useRef<THREE.Group>(null!);
  const materialRef = useRef<THREE.MeshPhongMaterial>(null!);
  const shadowTextRef = useRef<any>(null!);
  const targetColor = useRef(new THREE.Color());

  useFrame((state, delta) => {
    const speed = 12;

    // // Animate button moving forward
    // if (meshRef.current) {
    //   const targetMeshZ = hovered ? 0.02 : 0;
    //   meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetMeshZ, delta * speed);
    // }

    if (textGroupRef.current) {
      const targetTextZ = hovered ? 0.05 : 0.015;
      textGroupRef.current.position.z = THREE.MathUtils.lerp(textGroupRef.current.position.z, targetTextZ, delta * speed);
    }

    if (shadowTextRef.current) {
      const targetOpacity = hovered ? 0.4 : 0.15;
      const targetBlur = hovered ? 0.03 : 0.005;
      const targetWidth = hovered ? 0.01 : 0.002;

      shadowTextRef.current.fillOpacity = THREE.MathUtils.lerp(shadowTextRef.current.fillOpacity, targetOpacity, delta * speed);
      shadowTextRef.current.outlineOpacity = shadowTextRef.current.fillOpacity;
      shadowTextRef.current.outlineBlur = THREE.MathUtils.lerp(shadowTextRef.current.outlineBlur, targetBlur, delta * speed);
      shadowTextRef.current.outlineWidth = THREE.MathUtils.lerp(shadowTextRef.current.outlineWidth, targetWidth, delta * speed);
    }

    // Animate color
    if (materialRef.current) {
      targetColor.current.set(hovered ? hoverColor : color);
      materialRef.current.color.lerp(targetColor.current, delta * speed);
    }
  });

  return (
    <Interactive
      onSelect={onClick}
      onHover={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <group position={position}>
        {/* Main Button */}
        <mesh ref={meshRef}>
          <RoundedBox args={[width, 0.396, 0.02]} radius={0.01} smoothness={2} >
            <meshPhongMaterial ref={materialRef} color={color} />
          </RoundedBox>
          {/* Text Shadow */}
          <Text 
            ref={shadowTextRef}
            position={[0.008, -0.008, 0.011]} 
            fontSize={0.2} 
            color="#474747"
            fillOpacity={0.15} 
            outlineWidth={0.002}
            outlineBlur={0.005}
            outlineColor="black"
            outlineOpacity={0.15}
            anchorX="center" 
            anchorY="middle" 
            depthWrite={false}
          >
            {label}
          </Text>
        </mesh>
        
        {/* Text */}
        <group ref={textGroupRef} position={[0, 0, 0.0]}>
          <Text fontSize={0.2} color="white" anchorX="center" anchorY="middle">
            {label}
          </Text>
        </group>
      </group>
    </Interactive>
  );
}

export default function VRMenu() {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleNumClick = (num: string) => {
    setRoomCode((prev) => (prev.length < 10 ? prev + num : prev));
  };

  const handleDelClick = () => {
    setRoomCode((prev) => prev.slice(0, -1));
  };

  const handleClearClick = () => {
    setRoomCode('');
  };

  const handleJoinClick = () => {
    if (roomCode) {
      navigate(`/game/${roomCode}`);
    }
  };

  return (
    <group position={[0, 1.5, -2]}>
      {/* Title */}
      <Text position={[0, 1.5, 0]} fontSize={0.4} color="white" anchorX="center" anchorY="middle">
        VR 迷宮
      </Text>
      <Text position={[0, 1.1, 0]} fontSize={0.2} color="lightgray" anchorX="center" anchorY="middle">
        ルームのコードを入れてね
      </Text>

      {/* Input Display */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[1.5, 0.4, 0.1]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <Text position={[0, 0.7, 0.06]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">
        {roomCode || "Room code"}
      </Text>

      {/* Numpad */}
      <group position={[0, -0.2, 0]}>
        {/* Row 1 */}
        <VRButton position={[-0.4, 0.4, 0]} label="1" onClick={() => handleNumClick('1')} />
        <VRButton position={[0, 0.4, 0]} label="2" onClick={() => handleNumClick('2')} />
        <VRButton position={[0.4, 0.4, 0]} label="3" onClick={() => handleNumClick('3')} />
        
        {/* Row 2 */}
        <VRButton position={[-0.4, 0, 0]} label="4" onClick={() => handleNumClick('4')} />
        <VRButton position={[0, 0, 0]} label="5" onClick={() => handleNumClick('5')} />
        <VRButton position={[0.4, 0, 0]} label="6" onClick={() => handleNumClick('6')} />
        
        {/* Row 3 */}
        <VRButton position={[-0.4, -0.4, 0]} label="7" onClick={() => handleNumClick('7')} />
        <VRButton position={[0, -0.4, 0]} label="8" onClick={() => handleNumClick('8')} />
        <VRButton position={[0.4, -0.4, 0]} label="9" onClick={() => handleNumClick('9')} />
        
        {/* Row 4 */}
        <VRButton position={[-0.4, -0.8, 0]} label="DEL" onClick={handleDelClick} color="#633" hoverColor="#944" />
        <VRButton position={[0, -0.8, 0]} label="0" onClick={() => handleNumClick('0')} />
        <VRButton position={[0.4, -0.8, 0]} label="CLR" onClick={handleClearClick} color="#633" hoverColor="#944" />
      </group>

      {/* Join Button */}
      <VRButton 
        position={[0, -1.8, 0]} 
        label="Join Game" 
        onClick={handleJoinClick} 
        width={1.5} 
        color={roomCode ? "#2e7d32" : "#555"} 
        hoverColor={roomCode ? "#4caf50" : "#555"} 
      />
    </group>
  );
}
