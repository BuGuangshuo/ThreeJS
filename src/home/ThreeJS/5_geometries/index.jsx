import { useEffect } from "react";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Geometries = () => {
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

    const dom = document.getElementById("canvas");
    dom.appendChild(renderer.domElement);

    // const positionsArray = new Float32Array(9); // 9代表三个顶点，每个顶点有三个值

    // positionsArray[0] = 0; // x
    // positionsArray[1] = 0; // y
    // positionsArray[2] = 0; // z

    // positionsArray[3] = 0;
    // positionsArray[4] = 1;
    // positionsArray[5] = 0;

    // positionsArray[6] = 1;
    // positionsArray[7] = 0;
    // positionsArray[8] = 0;

    // 下面为上面的简写
    /*
        [
            0,0,0,
            0,1,0,
            1,0,0
        ]   
    */

    /* 创建一个三角形 */
    // const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]); // 9代表三个顶点，每个顶点有三个值

    // // 转换为三个ThreeJs缓冲区属性
    // const positionAttribute = new THREE.BufferAttribute(positionsArray, 3); // 参数：FlatArray32数组，顶点数

    // // 创建缓冲几何体
    // const geometry = new THREE.BufferGeometry();

    // // 添加属性
    // geometry.setAttribute("position", positionAttribute); // 参数：属性名(阴影名，此处必须用position)，属性

    /* 创建多个个三角形 */
    const count = 50;
    const geometry = new THREE.BufferGeometry();

    const positionArray = new Float32Array(count * 3 * 3); // 每个三角形由三个顶点组成，每个顶点由三个值组成，所以是count*3*3

    for (let i = 0; i < count * 3 * 3; i++) {
      positionArray[i] = Math.random();
    }

    const positionAttrubute = new THREE.BufferAttribute(positionArray, 3);
    geometry.setAttribute("position", positionAttrubute);

    const material = new THREE.MeshBasicMaterial({
      color: "#a56ef2",
      wireframe: true,
    }); // wireframe 线框模式
    const mesh = new THREE.Mesh(geometry, material);

    // Object
    // const mesh = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1, 2, 2, 2),
    //   new THREE.MeshBasicMaterial({ color: "#a56ef2", wireframe: true }) // wireframe 线框模式
    // );

    scene.add(mesh);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      size.width / size.height,
      0.1,
      100
    );

    window.addEventListener("resize", () => {
      // resize size
      (size.width = window.innerWidth), (size.height = window.innerHeight);

      // update camera
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();

      // update render
      renderer.setSize(size.width, size.height);
    });

    window.addEventListener("dblclick", () => {
      const fullElement = document.fullscreenElement;

      if (!fullElement) {
        if (dom.requestFullscreen) {
          dom.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });

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

export default Geometries;
