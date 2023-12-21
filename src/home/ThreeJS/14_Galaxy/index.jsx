import { useEffect } from "react";

import * as THREE from "three";
import * as dat from "dat.gui";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/*
  debugUI
*/
const gui = new dat.GUI();

const Galaxy = () => {
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  useEffect(() => {
    init();
  }, []);

  /*
    投影
    只有三种光源支持投影 PointLight DirectionalLight SpotLight
  */
  const init = () => {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const dom = document.getElementById("canvas");
    dom.appendChild(renderer.domElement);

    /*
        Galaxy
    */

    const parameters = {};

    parameters.count = 100000;
    parameters.size = 0.01;
    parameters.radius = 5;
    parameters.branch = 3;
    parameters.spin = 1;
    parameters.randomness = 0.2;
    parameters.randomnessPower = 3;
    parameters.insideColor = "#ff6030";
    parameters.outsideColor = "#1b3984";

    let geometry = null;
    let material = null;
    let points = null;

    const generateGalaxy = () => {
      // 销毁老的 Galaxy
      if (points !== null) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
      }
      // Geometry
      geometry = new THREE.BufferGeometry();

      const positions = new Float32Array(parameters.count * 3);
      const colors = new Float32Array(parameters.count * 3);

      // 创建内外色
      const insideColor = new THREE.Color(parameters.insideColor);
      const outsideColor = new THREE.Color(parameters.outsideColor);

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        const radius = Math.random() * parameters.radius;

        // 设置分支角度
        const branchAngle =
          ((i % parameters.branch) / parameters.branch) * Math.PI * 2;

        // 设置旋转率
        const spinAngle = radius * parameters.spin;

        // 设置随机性
        const randomX =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1);
        const randomY =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1);
        const randomZ =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1);

        positions[i3 + 0] =
          Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = 0 + randomY;
        positions[i3 + 2] =
          Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // 混色 主要会改变色值 需克隆一份颜色
        const mixedColor = insideColor.clone();
        mixedColor.lerp(outsideColor, radius / parameters.radius); // 1为原色

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      // Material
      material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      });

      // Points
      points = new THREE.Points(geometry, material);
      scene.add(points);
    };

    generateGalaxy();

    gui
      .add(parameters, "count")
      .min(100)
      .max(1000000)
      .step(100)
      .onFinishChange(generateGalaxy); // 修改完成重新调用generateGalaxy方法
    gui
      .add(parameters, "size")
      .min(0.001)
      .max(0.1)
      .step(0.001)
      .onFinishChange(generateGalaxy);

    gui
      .add(parameters, "radius")
      .min(0.01)
      .max(20)
      .step(0.01)
      .onFinishChange(generateGalaxy);

    gui
      .add(parameters, "branch")
      .min(2)
      .max(20)
      .step(1)
      .onFinishChange(generateGalaxy);

    gui
      .add(parameters, "spin")
      .min(-5)
      .max(5)
      .step(0.001)
      .onFinishChange(generateGalaxy);

    gui
      .add(parameters, "randomness")
      .min(0)
      .max(2)
      .step(0.001)
      .onFinishChange(generateGalaxy);

    gui
      .add(parameters, "randomnessPower")
      .min(1)
      .max(10)
      .step(0.001)
      .onFinishChange(generateGalaxy);

    gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);

    gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

    const camera = new THREE.PerspectiveCamera(
      75,
      size.width / size.height,
      0.1,
      1000
    );

    camera.position.z = 3;

    const orbitControls = new OrbitControls(camera, dom);
    orbitControls.enableDamping = true;

    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      requestAnimationFrame(animate);
      orbitControls.update();
      renderer.render(scene, camera);
    };
    animate();
  };
  return <div id="canvas" />;
};

export default Galaxy;
