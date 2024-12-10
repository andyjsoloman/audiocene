/* eslint-disable react/no-unknown-property */
import { Canvas } from "@react-three/fiber";
import styled from "styled-components";
import * as THREE from "three";
import { Cloud, OrbitControls } from "@react-three/drei";
import ProceduralTerrain from "./ProceduralTerrain";
import Marker from "./Marker";

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
          {/* <axesHelper args={[5]} position={[0, 5, 0]} /> */}
          <color args={["hsl(195, 24%, 98%)"]} attach="background" />
          <OrbitControls />
          {/* <Cloud
            seed={10}
            fade={30}
            speed={0.1}
            position={[0, -5, -20]}
            growth={4}
            segments={40}
            volume={5}
            opacity={1}
            bounds={[4, 3, 1]}
            color={"white"}
            receiveShadow={false}
          />
          <Cloud
            seed={20}
            fade={30}
            position={[0, -5, 20]}
            speed={0.5}
            growth={4}
            volume={5}
            opacity={1}
            bounds={[4, 2, 1]}
          /> */}
          <Marker position={[-4, 3.75, -4]} scale={0.6} />
          <Marker position={[-4, 3.75, 3]} scale={0.6} />
          <Marker position={[4, 3.75, 0]} scale={0.6} />
          <ProceduralTerrain />
          {/* <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -10, 0]}
            receiveShadow
          >
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="coral" />
          </mesh> */}
        </Canvas>
      </Container>
    </>
  );
}

export default Experience;
