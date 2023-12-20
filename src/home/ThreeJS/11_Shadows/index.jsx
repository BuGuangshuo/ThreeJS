import { useEffect } from "react";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Shadows = () => {
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

    // renderer.shadowMap.enabled = true; // 开启阴影地图
    renderer.shadowMap.enabled = false; // 开启阴影地图
    renderer.shadowMap.type = THREE.PCFShadowMap; // 阴影映射算法 推荐PCFShadowMap

    const dom = document.getElementById("canvas");
    dom.appendChild(renderer.domElement);

    /* TexTure */
    const texture = new THREE.TextureLoader();
    const bakedShadow = texture.load(
      "/texture/matcaps/Texturelabs_LensFX_247M.jpg"
    );

    const metrial = new THREE.MeshStandardMaterial();

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      metrial
    );

    sphere.castShadow = true; // 设置投影对象

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), metrial);

    plane.receiveShadow = true; // 允许被投影（接收投影）

    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.5;

    scene.add(sphere, plane);

    const sphereBakedShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.5),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: bakedShadow,
      })
    );

    sphereBakedShadow.rotation.x = -Math.PI / 2;
    sphereBakedShadow.position.y = plane.position.y + 0.01;

    scene.add(sphereBakedShadow);

    const sun = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(sun);

    /* PointLight 平行光投影 */
    const dirctionLight = new THREE.DirectionalLight(0xffffff, 1);
    dirctionLight.position.set(2, 2, -1);
    dirctionLight.castShadow = true; // 激活投影

    // 设置阴影地图宽高（分辨率）
    dirctionLight.shadow.mapSize.width = 1024;
    dirctionLight.shadow.mapSize.height = 1024;

    // 优化渲染场景 使影子更精细
    dirctionLight.shadow.camera.near = 1;
    dirctionLight.shadow.camera.far = 6;
    dirctionLight.shadow.camera.top = 2;
    dirctionLight.shadow.camera.right = 2;
    dirctionLight.shadow.camera.bottom = -2;
    dirctionLight.shadow.camera.left = -2;

    // dirctionLight.shadow.radius = 10; // 控制影子模糊度

    scene.add(dirctionLight);

    // 平行光摄像机助手
    const directionLightCameraHelper = new THREE.CameraHelper(
      dirctionLight.shadow.camera
    );

    directionLightCameraHelper.visible = false;

    scene.add(directionLightCameraHelper);

    const dirctionLightHelper = new THREE.DirectionalLightHelper(
      dirctionLight,
      0.2
    );

    dirctionLightHelper.visible = false;
    scene.add(dirctionLightHelper);

    /* 聚光灯投影 */
    const spotLight = new THREE.SpotLight(0xffffff, 4, 10, Math.PI * 0.3);

    spotLight.castShadow = true; // 开启投影

    spotLight.position.set(0, 2, 2);

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    // 优化渲染场景 使影子更精细
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 6;
    spotLight.shadow.fov = 30;

    scene.add(spotLight);
    scene.add(spotLight.target);

    const spotLightHelper = new THREE.CameraHelper(spotLight.shadow.camera);
    spotLightHelper.visible = false;

    scene.add(spotLightHelper);

    /* 点光源投影 */
    const pointLight = new THREE.PointLight(0xffffff, 1);

    pointLight.castShadow = true;

    pointLight.position.set(-1, 1, 0);

    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;

    // 优化渲染场景 使影子更精细
    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 5;
    pointLight.shadow.fov = 30;

    scene.add(pointLight);

    const camera = new THREE.PerspectiveCamera(
      75,
      size.width / size.height,
      0.1,
      100
    );

    const orbitControls = new OrbitControls(camera, dom);
    orbitControls.enableDamping = true;

    camera.position.z = 3;

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTIme = clock.getElapsedTime();
      requestAnimationFrame(animate);
      sphere.position.x = Math.cos(elapsedTIme) * 1.5;
      sphere.position.z = Math.cos(elapsedTIme) * 1.5;
      sphere.position.y = Math.abs(Math.sin(elapsedTIme * 3));

      // update the shadows
      sphereBakedShadow.position.x = sphere.position.x;
      sphereBakedShadow.position.z = sphere.position.z;
      sphereBakedShadow.material.opacity = (1 - sphere.position.y) * 0.3;

      orbitControls.update();
      renderer.render(scene, camera);
    };
    animate();
  };
  return <div id="canvas" />;
};

export default Shadows;
