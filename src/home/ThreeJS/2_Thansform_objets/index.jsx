import { useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";

const Transfrom_Object = () => {
  useEffect(() => {
    init();
  }, []);

  const init = () => {
    // Scene 场景
    const scene = new THREE.Scene();

    const render = new THREE.WebGL1Renderer();

    render.setSize(window.innerWidth, window.innerHeight);
    render.setClearColor("#f1fff1", 0.5);

    const dom = document.getElementById("canvas");

    dom.appendChild(render.domElement);

    // Object
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    const material = new THREE.MeshNormalMaterial({ color: "red" });

    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.z = 3;

    // Clock
    const clock = new THREE.Clock();

    gsap.to(cube.position, { x: 2, direction: 1, delay: 1 });
    gsap.to(cube.position, { x: 0, direction: 1, delay: 2 });

    const animate = () => {
      //   const elapasedTime = clock.getElapsedTime();
      requestAnimationFrame(animate);
      render.render(scene, camera);
      //   cube.rotation.y = elapasedTime * Math.PI * 2; // 每秒转一圈

      //   camera.position.x = Math.sin(elapasedTime);
      //   camera.position.y = Math.cos(elapasedTime);
      //   camera.lookAt(cube.position); // 设置摄像机只看像物体中间
    };
    animate();
  };

  return <div id="canvas" />;
};

export default Transfrom_Object;
