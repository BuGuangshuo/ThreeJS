import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Camera = () => {
  // scene
  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const scene = new THREE.Scene();
    const render = new THREE.WebGLRenderer();

    render.setSize(window.innerWidth, window.innerHeight);
    render.setClearColor("#f1fff1", 0.5);

    const dom = document.getElementById("canvas");
    dom.appendChild(render.domElement);

    // Object
    //   const geometry = new THREE.BoxGeometry(1, 1, 1);
    //   const material = new THREE.MeshBasicMaterial({ color: "#69a7feeff" });

    //   const mesh = new THREE.Mesh(geometry, material);
    //   scene.add(mesh);

    // 简写
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: "#a56ef2" })
    );
    scene.add(mesh);
    // Camera

    // 透视相机;
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Controls
    const controls = new OrbitControls(camera, dom);
    // controls.target.y = 1; // 控制中心y轴移动1
    controls.enableDamping = true;

    // 正交相机
    // const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    camera.position.z = 3;

    const animite = () => {
      requestAnimationFrame(animite);
      // mesh.rotation.x += 0.01;
      // mesh.rotation.y += 0.01;
      controls.update(); // 控件需要在每一帧上更新
      render.render(scene, camera);
    };

    animite();
  };

  return <div id="canvas" />;
};

export default Camera;
