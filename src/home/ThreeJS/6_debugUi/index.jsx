import { useEffect } from "react";

import * as THREE from "three";
import * as dat from "dat.gui";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";

/*
  debugUI
*/
// const gui = new dat.GUI();

const DebugUI = () => {
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(size.width, size.height);

    const dom = document.getElementById("canvas");
    dom.appendChild(renderer.domElement);

    // Object
    const geometries = new THREE.BoxGeometry(1, 1, 1);

    const material = new THREE.MeshBasicMaterial({ color: "#5cadf8" });
    const mesh = new THREE.Mesh(geometries, material);

    scene.add(mesh);

    const parameters = {
      color: "#5cadf8",
      // 可以在对象中添加自定义方法
      spin: () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + 10 });
      },
    };

    // debug
    // gui.add(mesh.position, "y", -3, 3, 0.01); // 参数：控制对象，属性名称，最小值，最大值，精度

    // 链接写法 功能同上的另一种写法
    //gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation"); // 参数：控制对象，属性名称，最小值，最大值，精度，别名

    // 布尔类型的复选框
    //gui.add(mesh, "visible");
    //gui.add(material, "wireframe");

    // 颜色配置 无法直接通过addColor传入颜色代码改变物体颜色，需创建对象并执行onChange方法更新材质颜色
    // gui.addColor(parameters, "color").onChange(() => {
    //   material.color.set(parameters.color);
    // });

    // 添加旋转
    //gui.add(parameters, "spin");

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      size.width / size.height,
      0.1,
      100
    );

    const orbitControls = new OrbitControls(camera, dom);
    orbitControls.enableDamping = true;

    camera.position.z = 3;

    const animate = () => {
      requestAnimationFrame(animate);
      orbitControls.update();
      renderer.render(scene, camera);
    };
    animate();
  };
  return <div id="canvas" />;
};

export default DebugUI;
