/* eslint-disable react/no-unknown-property */
import { useState, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const CustomObject = () => {
  const verticesCount = 10 * 3;

  const geometryRef = useRef();

  useEffect(() => {
    geometryRef.current.computeVertexNormals();
  }, []);

  const postions = useMemo(() => {
    const postions = new Float32Array(verticesCount * 3);

    for (let i = 0; i < verticesCount * 3; i++) {
      postions[i] = (Math.random() - 0.5) * 3;
    }

    return postions;
  }, []);

  return (
    <mesh>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={verticesCount}
          itemSize={3}
          array={postions}
        />
      </bufferGeometry>
      <meshStandardMaterial color="red" side={THREE.DoubleSide} />
    </mesh>
  );
};

export default CustomObject;
