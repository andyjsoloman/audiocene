/* eslint-disable react/no-unknown-property */
import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function Marker(props) {
  const groupRef = useRef();
  const { nodes, materials } = useGLTF("/marker.gltf");

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01; // Adjust speed as needed
    }
  });

  return (
    <>
      <group ref={groupRef} {...props} dispose={null}>
        <group rotation={[-Math.PI, 1, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.marker_1.geometry}
            material={new THREE.MeshStandardMaterial({ color: "#d6fbff" })}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.marker_2.geometry}
            material={new THREE.MeshStandardMaterial({ color: "#0079a1" })}
          />
        </group>
      </group>
    </>
  );
}

useGLTF.preload("/marker.gltf");
