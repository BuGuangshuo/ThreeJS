/* eslint-disable react/no-unknown-property */
import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  TransformControls,
  PivotControls,
  Html,
  Text,
  Float,
  MeshReflectorMaterial,
} from "@react-three/drei";
import * as THREE from "three";

import "./index.css";

const cameraSettring = {
  fov: 45,
  near: 0.1,
  far: 200,
  position: [3, 2, 6],
};

const Cube = () => {
  const cubeRef = useRef();
  const sphereRef = useRef();
  const cubeGroupRef = useRef();

  return (
    <>
      {/* enableDamping 惯性 默认true */}
      {/* makeDefault 惯性 设置为默认控件，解决多个控件操作冲突问题 */}
      <OrbitControls enableDamping makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={1.5} />

      <group ref={cubeGroupRef}>
        {/* PivotControls和TransformControls功能类似 但是功能会好一些，不支持像TransformControls引用方案，只能包裹在mesh上 */}
        {/* 通过anchor锚点来将控制器移入到物体中心，默认值为[0,0,0]，且是相对于物体的坐标，无论物体多大，都会基于物体大小来定位坐标 */}
        {/* depthTest设置为false将控制器显示在物体外面 */}
        {/* lineWidth 控制器线宽 */}
        {/* axisColors 控制器坐标轴颜色 */}
        {/* scale 控制器大小 单位为像素 */}
        {/* fixed 是否为固定大小 true时无论视角缩放多少控制器都会保持scale设置的像素， false时大小是相对于物体，缩放视角，随着物体变小控制器的scale也会变小 */}
        <PivotControls
          anchor={[0, 0, 0]}
          depthTest={false}
          //   lineWidth={2}
          //   axisColors={["red", "green", "blue"]}
          //   scale={1}
          // fixed={true}
        >
          <mesh position-x={-2} ref={sphereRef}>
            <sphereGeometry />
            <meshStandardMaterial color="#00c8ff" />
            {/* 
                添加Html物体
                wrapperClass 设置className
                center 将html元素中心设置为为居中位置
                distanceFactor 设置相对位置大小
                occlude 设置遮挡 参数为遮挡目标ref和被遮挡目标ref
             */}
            <Html
              position={[1, 1, 0]}
              wrapperClass="dreiHtml"
              center
              distanceFactor={8}
              occlude={[sphereRef, cubeRef]}
            >
              test
            </Html>
          </mesh>
        </PivotControls>

        {/* 第一种方法：TransformControls为mesh父级 所以将定位放在父级上解决坐标轴不在立方体中心问题 */}
        {/* <TransformControls position-x={2}>
          <mesh rotation-y={Math.PI * 0.25} scale={1.5} ref={cubeRef}>
            <boxGeometry />
            <meshStandardMaterial color="#c783ff" />
          </mesh>
        </TransformControls> */}

        {/* 推荐第二种方法：将TransformControls和mesh完全分开，使用引用方法 */}

        <mesh
          position-x={2}
          rotation-y={Math.PI * 0.25}
          scale={1.5}
          ref={cubeRef}
        >
          <boxGeometry />
          <meshStandardMaterial color="#c783ff" />
        </mesh>

        {/* TransformControls需放mesh后 */}
        {/* object 关联mesh */}
        {/* mode 控制模式*/}
        <TransformControls object={cubeRef} mode="rotate" />
      </group>

      <mesh scale={10} rotation-x={-Math.PI * 0.5} position-y={-1}>
        <planeGeometry />
        {/* <meshStandardMaterial color="#c6f87a" side={THREE.DoubleSide} /> */}

        {/* 
            反射材质 适用于平面网格
            resolution 分辨率
            blur 模糊程度
            mixBlur 与blur搭配进行混合模糊 将在非模糊和模糊之间混合 1为完全模糊
            mirror 镜像属性 1为最清晰
        */}
        <MeshReflectorMaterial
          resolution={512}
          blur={[1000, 1000]}
          mixBlur={1}
          mirror={0.35}
          color="#8dc8ff"
        />
      </mesh>

      {/* 
        font 字体
        fontSize 字号
        maxWidth 最大宽度
        textAlign 对齐方式
      */}
      <Text
        fontSize={0.6}
        color="salmon"
        position-y={2}
        maxWidth={2}
        textAlign="center"
        // font='./font.woff'
      >
        I love R3F
        {/* 材质 */}
        <meshNormalMaterial />
      </Text>

      {/* 
            Float 浮动

            speed 浮动速度
            floatIntensity 浮动幅度
      */}
      <Float speed={5} floatIntensity={2}>
        <Text
          fontSize={0.6}
          color="salmon"
          position-y={2}
          position-x={2.5}
          maxWidth={2}
          textAlign="center"
        >
          Float Text
          <meshNormalMaterial />
        </Text>
      </Float>
    </>
  );
};

const Drei = () => {
  return (
    // 正交相机
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

export default Drei;
