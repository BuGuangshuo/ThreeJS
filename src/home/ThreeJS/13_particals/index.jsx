import { useEffect } from "react";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Partical = () => {
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

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial()
    );

    scene.add(box);

    /* 简单粒子 */

    // 创建Geometry
    // const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);

    // // 创建材质 Material
    // const particlesMaterial = new THREE.PointsMaterial({
    //   size: 0.02,
    //   sizeAttenuation: true, // 尺寸衰减
    // });

    /* 自定义粒子 */
    const particlesGeometry = new THREE.BufferGeometry(1, 32, 32);

    const count = 2000;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    // 创建材质 Material

    const textureLoader = new THREE.TextureLoader();
    const particleLoader = textureLoader.load("/texture/star.jpg");
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true, // 尺寸衰减,
      //   map: particleLoader, // 自定义纹理
    });

    // 隐藏纹理边缘优化
    particlesMaterial.transparent = true;
    particlesMaterial.alphaMap = particleLoader;

    // 第一种
    // particlesMaterial.alphaTest = 0.001; // 但是还是有一点边缘

    // 第二种
    // particlesMaterial.depthTest = false; // false时 gpu只负责绘制 不判断绘制是在前还是在后 但是会有问题,如果场景中有其他物体或不同颜色粒子会出现错乱

    // 第三种
    particlesMaterial.depthWrite = false; // 比较优解，但某些情况下会有bug，实际根据情况选择方法
    // particlesMaterial.color = new THREE.Color("#ffca2c");

    // 激活顶点颜色
    particlesMaterial.vertexColors = true;
    // 创建Points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);

    scene.add(particles);

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

      // Update particles
      for (let i = 0; i < count; i++) {
        let i3 = i * 3;
        const x = particlesGeometry.attributes.position.array[i3 + 0];
        // 增加每个粒子的动画 i3 + 0 为第一个顶点x、i3 + 1 为第二个顶点y,以此类推
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
          elapsedTime + x
        );
      }
      particlesGeometry.attributes.position.needsUpdate = true; // 更新
      requestAnimationFrame(animate);
      orbitControls.update();
      renderer.render(scene, camera);
    };
    animate();
  };
  return <div id="canvas" />;
};

export default Partical;
