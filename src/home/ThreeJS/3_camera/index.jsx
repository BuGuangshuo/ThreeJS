import { useEffect } from "react";
import * as THREE from "three";

const Camera = () => {
  // scene
  useEffect(() => {
    const init = () => {
      const scene = new THREE.Scene();
      const render = new THREE.WebGL1Renderer();

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
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      camera.position.z = 3;

      render.render(scene, camera);
    };
    init();
  }, []);

  return <div id="canvas" />;
};

export default Camera;
