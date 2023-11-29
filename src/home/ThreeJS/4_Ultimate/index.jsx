import { useEffect } from "react";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Ultimate = () => {
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    // scene
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(size.width, size.height);
    renderer.setClearColor("#c5ffc5", 0.4);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 设置像素比 当前屏幕像素比和2的最小值

    const dom = document.getElementById("canvas");
    dom.appendChild(renderer.domElement);

    // Object

    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: "#a56ef2" })
    );

    scene.add(mesh);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      size.width / size.height,
      0.1,
      100
    );

    // 自适应屏幕视口宽高
    window.addEventListener("resize", () => {
      // 更新宽高 重新适配屏幕视口
      (size.width = window.innerWidth), (size.height = window.innerHeight);

      // 更新摄像机位置
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();

      // 更新画布
      renderer.setSize(size.width, size.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 不同屏幕动态切换像素比
    });

    // 全屏
    window.addEventListener("dblclick", () => {
      const fullScreenElement =
        document.fullscreenElement || document.webkitFullScreenElement; // 兼容webkit 类Safari浏览器
      if (!fullScreenElement) {
        if (dom.requestFullscreen) {
          dom.requestFullscreen();
        } else if (dom.webkitFullScreenElement()) {
          dom.webkitFullScreenElement();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    });

    const orbitControls = new OrbitControls(camera, dom);
    orbitControls.enableDamping = true;
    camera.position.z = 3;

    const animation = () => {
      requestAnimationFrame(animation);
      orbitControls.update();
      renderer.render(scene, camera);
    };

    animation();
  };

  return <div id="canvas" />;
};

export default Ultimate;
