/* eslint-disable react/no-unknown-property */
import { Canvas } from "@react-three/fiber";

import { OrbitControls } from "@react-three/drei";
import ProceduralTerrain from "./ProceduralTerrain";

function Experience() {
  return (
    <>
      <Canvas shadows>
        <axesHelper args={[5]} position={[0, 5, 0]} />
        <color args={["hsl(195, 24%, 98%)"]} attach="background" />
        <OrbitControls />
        <ProceduralTerrain />
      </Canvas>
    </>
  );
}

export default Experience;
