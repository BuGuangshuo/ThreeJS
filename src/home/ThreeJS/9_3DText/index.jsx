import { useEffect } from "react";

import * as THREE from "three";
import * as dat from "dat.gui";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"; // 导入FontLoader方法
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"; // 导入TextGeometry

/*
  debugUI
*/
const gui = new dat.GUI();

const TextD = () => {
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
    renderer.setClearColor("#fdf2ff");

    const dom = document.getElementById("canvas");
    dom.appendChild(renderer.domElement);

    // Axes helper
    // const axesHelper = new THREE.AxesHelper();
    // scene.add(axesHelper);

    /*
      Textures
    */

    const textureLoader = new THREE.TextureLoader();
    const matcapTexture = textureLoader.load("/texture/matcaps/texture1.png");

    // fonts
    const fontLoader = new FontLoader();

    fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
      // 创建字体几何
      const textGeometry = new TextGeometry(
        "Alan Bu", // 字符串
        // 字体属性
        {
          font,
          size: 0.5,
          height: 0.2,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 5,
        }
      );

      textGeometry.computeBoundingBox(); // 计算边界

      // 中心居中 bevelSize会影响x轴位置，如设置了bevelSize需减掉bevelSize
      // textGeometry.translate(
      //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
      //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
      //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5
      // );

      // 居中更简洁方法
      textGeometry.center();

      const material = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture,
      });

      // gui.add(textMaterial, "wireframe");

      const text = new THREE.Mesh(textGeometry, material);
      scene.add(text);

      // 材质等放在外面创建有助于优化，优化多循环下渲染时长
      const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

      // 制作甜甜圈
      for (let i = 0; i < 100; i++) {
        const donut = new THREE.Mesh(donutGeometry, material);
        donut.position.x = (Math.random() - 0.5) * 10;
        donut.position.y = (Math.random() - 0.5) * 10;
        donut.position.z = (Math.random() - 0.5) * 10;

        donut.rotation.x = Math.random() * Math.PI;
        donut.rotation.y = Math.random() * Math.PI;

        const scale = Math.random();
        donut.scale.x = scale;
        donut.scale.y = scale;
        donut.scale.z = scale;

        scene.add(donut);

        const fontAnimate = () => {
          requestAnimationFrame(fontAnimate);
          donut.rotation.x += 0.003;
          donut.rotation.y += 0.003;
          donut.rotation.z += 0.003;
        };
        fontAnimate();
      }
    });

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

export default TextD;
