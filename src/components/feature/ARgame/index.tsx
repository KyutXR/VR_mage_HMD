import { Suspense } from "react";
import { useParams } from "react-router-dom";
import { Text } from "@react-three/drei";
import Player from "../../object/Player";
import Stage from "../../object/Stage";
import useWebsocket from "../../../hooks/useWebsocket";

interface VRGameProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

const VRGame = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 0.2 }: VRGameProps) => {
  const param = useParams();

  const { stage, player, onOff, error } = useWebsocket(param.roomCode || "test");

  if (error) {
    return (
      <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
        <ambientLight intensity={1} />
        <Text 
          position={[0, 1, 0]} 
          fontSize={0.5} 
          color="red" 
          anchorX="center" 
          anchorY="middle"
          font="https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75vY0gw-bQ.woff"
        >
          {error}
        </Text>
      </group>
    );
  }

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, 2, 1]} intensity={0.4} />

      <Suspense fallback={null}>
        {stage !== null && (
          <Stage grid={stage.stage} isOnOff={onOff === null ? false : onOff} />
        )}
        {player && (
          <Player position={player?.position} rotation={player?.rotation} />
        )}
      </Suspense>
    </group>
  );
};

export default VRGame;
