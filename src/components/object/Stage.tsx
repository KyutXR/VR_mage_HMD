import React from "react";
import * as THREE from "three";
import Ladder from "./Ladder";
import Goal from "./Goal";
import WarpBlock from "./WarpBlock";
import OnOffBlock from "./OnOffBlock";
import LeverBlock from "./Lever";
import OffOnBlock from "./OffOnBlock";

type BlockGrid = number[][][];

interface StageProps {
  grid: BlockGrid;
  isOnOff: boolean; // オンオフブロックの状態を受け取る
}

const Stage: React.FC<StageProps> = ({ grid, isOnOff }) => {
  const getBlock = (
    blockType: number,
    position: [number, number, number],
    keyStr: string
  ): React.ReactNode | null => {
    switch (blockType) {
      case 0:
        return null; // 何も置かない
      case 1:
        return (
          <mesh key={keyStr} position={position}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="white" side={THREE.DoubleSide} />
          </mesh>
        );
      case 2:
        return (
          <mesh key={keyStr} position={position}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="red" side={THREE.DoubleSide} />
          </mesh>
        );
      case 3:
        return (
          <mesh key={keyStr} position={position}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="blue" side={THREE.DoubleSide} />
          </mesh>
        );
      case 4:
        return (
          <Ladder
            position={position}
            rotation={[0, 0, 0]}
            key={keyStr}
          />
        );
      case 5:
        return (
          <Ladder
            position={position}
            rotation={[0, Math.PI / 2, 0]}
            key={keyStr}
          />
        );
      case 6:
        return (
          <Goal
            position={position}
            rotation={[0, Math.PI / 2, 0]}
            key={keyStr}
          />
        );
      case 7:
        return (
          <OnOffBlock
            isOn={isOnOff}
            position={position}
            rotation={[0, 0, 0]}
            key={keyStr}
          />
        );
      case 8:
        return (
          <OffOnBlock
            isOn={isOnOff}
            position={position}
            rotation={[0, 0, 0]}
            key={keyStr}
          />
        );
      case 9:
        return (
          <LeverBlock
            position={position}
            rotation={[0, 0, 0]}
            isOn={isOnOff}
            key={keyStr}
          />
        );
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
        return (
          <WarpBlock
            position={position}
            blockId={blockType}
            key={keyStr}
          />
        );
      default:
        return null;
    }
  };

  const renderBlocks = () => {
    const blocks: React.ReactNode[] = [];

    // グリッド全体の最大サイズを用いて一意のオフセットを計算する
    const maxY = grid.length || 0;
    const maxZ = grid[0]?.length || 0;
    const maxX = grid[0]?.[0]?.length || 0;
    const offsetY = Math.floor(maxY / 2);
    const offsetZ = Math.floor(maxZ / 2);
    const offsetX = Math.floor(maxX / 2);

    grid.forEach((layer, y) => {
      layer.forEach((row, z) => {
        row.forEach((blockType, x) => {
          const position: [number, number, number] = [
            x - offsetX, // x軸中央寄せ
            y - offsetY, // y軸中央寄せ
            z - offsetZ, // z軸中央寄せ
          ];
          const keyStr = `${x}-${y}-${z}`;
          const block = getBlock(blockType, position, keyStr);
          if (block) {
            blocks.push(block);
          }
        });
      });
    });

    return blocks;
  };

  return <group>{renderBlocks()}</group>;
};

export default Stage;
