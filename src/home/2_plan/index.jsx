/* eslint-disable react/no-unknown-property */
import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";

import CustomObject from "./customObject";

extend({ OrbitControls });

// 正交相机
// const cameraSettring = {
//   fov: 45,
//   near: 0.1,
//   far: 200,
//   position: [3, 2, 6],
//   zoom: 100,
// };

// 透视相机
const cameraSettring = {
  fov: 45,
  near: 0.1,
  far: 200,
  position: [3, 2, 6],
};

const Cube = () => {
  const cubeRef = useRef();
  const cubeGroupRef = useRef();

  const { camera, gl } = useThree();

  useFrame((state, delta) => {
    cubeRef.current.rotation.y += delta;
    // cubeGroupRef.current.rotation.y += delta;

    //--------摄像机通过clock环绕舞台旋转------------
    // const angle = state.clock.elapsedTime;
    // state.camera.position.x = Math.sin(angle) * 8;
    // state.camera.position.z = Math.cos(angle) * 8;
    // state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* <orbitControls args={[camera, gl.domElement]} /> */}

      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={1.5} />

      <group ref={cubeGroupRef}>
        <mesh position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="#00c8ff" />
        </mesh>

        <mesh
          position-x={2}
          rotation-y={Math.PI * 0.25}
          scale={1.5}
          ref={cubeRef}
        >
          <boxGeometry />
          <meshStandardMaterial color="#c783ff" />
        </mesh>
      </group>
      <mesh scale={10} rotation-x={-Math.PI * 0.5} position-y={-1}>
        <planeGeometry />
        <meshStandardMaterial color="#c6f87a" side={THREE.DoubleSide} />
      </mesh>

      <CustomObject />
    </>
  );
};

const Plan = () => {
  return (
    // 正交相机
    // <Canvas style={{ height: "100vh" }} orthographic camera={cameraSettring}>
    //   <Cube />
    // </Canvas>

    // 默认透视相机
    <Canvas
      dpr={[1, 2]} // Pixel-ratio像素比设置，使用window.devicePixelRatio，或者自动使用[min,max] 默认[1,2]
      style={{ height: "100vh" }}
      camera={cameraSettring}
      // gl指的是WebRenderer
      gl={{
        antialias: true, // antialias 反锯齿
        toneMapping: THREE.ACESFilmicToneMapping, // toneMapping 色调映射
        outputColorSpace: THREE.SRGBColorSpace, // outputColorSpace 设置为SRGB颜色空间
      }}
      flat // HDR开启 使颜色鲜艳
    >
      <Cube />
    </Canvas>
  );
};

export default Plan;
