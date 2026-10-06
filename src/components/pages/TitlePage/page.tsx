import { useState } from "react";
import styles from "./index.module.css";
import Button from "../../feature/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { NavLink } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { XR, ARButton, Controllers } from "@react-three/xr";
import VRMenu from "../../feature/VRMenu";

function TitlePage() {
  const [roomCode, setRoomCode] = useState("");

  return (
    <>
      <ARButton />
      <div style={{ position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: -1 }}>
        <Canvas>
          <XR>
            <Controllers />
            <ambientLight intensity={1} />
            <VRMenu />
          </XR>
        </Canvas>
      </div>
      <div className={styles["title-page-wrapper"]}>
        <div className={styles["title-page-container"]}>
          <div className={styles["title-text"]}>
            <h1>AR Maze Camera</h1>
            <img
              src="/maze.svg"
              alt="MazeLogo"
              className={styles["title-image"]}
            />
          </div>
          <p>ルームのコードを入れてね</p>
          <input
            type="text"
            placeholder="Room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className={styles["input-style"]}
          />
          <NavLink to={`/game/${roomCode}`}>
            <Button onClick={() => console.log(roomCode)}>
              Join Game
              <ArrowForwardIcon className={styles["arrow-icon"]} />
            </Button>
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default TitlePage;
