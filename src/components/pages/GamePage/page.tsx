import { Canvas } from "@react-three/fiber";
import { ARButton, XR, Controllers, Hands } from "@react-three/xr";
import VRGame from "../../feature/ARgame";

const GamePage = () => {
  return (
    <>
      <ARButton />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
      >
        <Canvas>
          <XR>
            <Controllers />
            <Hands />
            <VRGame position={[0, 1.6, -2]} rotation={[0, 0, 0]} scale={0.2} />
          </XR>
        </Canvas>
      </div>
    </>
  );
};

export default GamePage;
