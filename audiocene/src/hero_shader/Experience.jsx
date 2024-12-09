/* eslint-disable react/no-unknown-property */
import { Canvas } from "@react-three/fiber";
import styled from "styled-components";

import { OrbitControls } from "@react-three/drei";
import ProceduralTerrain from "./ProceduralTerrain";

const Container = styled.div`
  display: flex;
  margin: auto;
  align-items: center;
  width: 100%;
  height: 100%;
`;

function Experience() {
  return (
    <>
      <Container>
        <Canvas shadows>
          <axesHelper args={[5]} position={[0, 5, 0]} />
          <color args={["hsl(195, 24%, 98%)"]} attach="background" />
          <OrbitControls />
          <ProceduralTerrain />
        </Canvas>
      </Container>
    </>
  );
}

export default Experience;
