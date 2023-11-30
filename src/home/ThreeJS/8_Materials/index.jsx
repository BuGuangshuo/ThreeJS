import { useEffect } from "react";
import * as THREE from "three";
import * as dat from "dat.gui";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/*
  debugUI
*/
const gui = new dat.GUI();

const Materials = () => {
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    // Textures
    const texturesLoader = new THREE.TextureLoader();

    const birckTexture = texturesLoader.load("/Birck.jpg");
    const lensFXTexture = texturesLoader.load("/Texturelabs_LensFX_247M.jpg");
    const woodTexture = texturesLoader.load("/Texturelabs_Wood_145M.jpg");

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(size.width, size.height);

    const dom = document.getElementById("canvas");
    dom.appendChild(renderer.domElement);

    /* 
        基础材质
    */
    // const material = new THREE.MeshBasicMaterial();
    // /*
    //     map：颜色贴图。

    //     aoMap：该纹理的红色通道用作环境遮挡贴图，aoMap需要第二组UV。阴影部分会显示更纵深

    //     envMap：环境贴图。

    //     lightMap：光照贴图，lightMap需要第二组UV。

    //     alphaMap：alpha贴图是一张灰度纹理，用于控制整个表面的不透明度。（黑色：完全透明；白色：完全不透明）。

    //     specularMap：材质使用的高光贴图。
    // */
    // material.map = birckTexture;
    // material.color.set("pink"); // 外部设置颜色需要使用set写法
    // // material.color = new THREE.Color('pink'); // 另一种设置颜色写法
    // material.side = THREE.DoubleSide; // 双面可见

    /* 
        网格普通材质 MeshNormalMaterial
    */

    // const material = new THREE.MeshNormalMaterial();
    // // material.wireframe = true;
    // // 开启面模式
    // material.flatShading = true;

    /* 
        网格matcap MeshMatcaoMaterial
        可以模拟光
    */

    // const material = new THREE.MeshMatcapMaterial();
    // material.matcap = lensFXTexture;

    /* 
        网格深度材料 MeshDepthMaterial
    */

    // const material = new THREE.MeshDepthMaterial();

    /* 
        MeshPhongMaterial
    */

    // const material = new THREE.MeshPhongMaterial();
    // material.shininess = 1000; // 反射强度
    // material.specular = new THREE.Color("red"); // 反射颜色

    /* 
        MeshToonMaterial
    */

    // const material = new THREE.MeshToonMaterial();
    // lensFXTexture.minFilter = THREE.NearestFilter;
    // lensFXTexture.magFilter = THREE.NearestFilter;
    // lensFXTexture.generateMipmaps = false;
    // material.gradientMap = lensFXTexture; // 直接设置纹理会失去卡通效果，会模糊进行肉处理，需要设置filter

    /* 
        网格标准材料 MeshStandardMaterial
    */

    const material = new THREE.MeshStandardMaterial();
    material.metalness = 0.45; // 粗糙度
    material.roughness = 0.45; // 金属度
    material.side = THREE.DoubleSide;
    // material.map = woodTexture;
    material.aoMap = woodTexture; // 使用aoMap需要设置UV坐标
    material.aoMapIntensity = 2;

    gui.add(material, "metalness").min(0).max(1).step(0.001);
    gui.add(material, "roughness").min(0).max(1).step(0.001);
    // 创建球体
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      material
    );

    sphere.position.x = -1.5;

    // 创建平面
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);

    plane.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(plane.geometry.attributes.uv.array)
    ); // 使用aoMap需要设置UV坐标

    // 创建甜甜圈形
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.2, 16, 32),
      material
    );

    torus.position.x = 1.5;

    scene.add(sphere, plane, torus);

    const camera = new THREE.PerspectiveCamera(
      75,
      size.width / size.height,
      0.1,
      100
    );

    camera.position.z = 3;

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(40, 40, 15);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    spotLight.shadow.camera.far = 130;
    spotLight.shadow.camera.near = 40;
    spotLight.distance = 0;
    spotLight.target = sphere;
    spotLight.angle = 0.4;
    spotLight.intensity = 10999;
    spotLight.shadow.camera.fov = 120;
    scene.add(spotLight);

    const orbitControls = new OrbitControls(camera, dom);
    orbitControls.enableDamping = true;

    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      requestAnimationFrame(animate);
      orbitControls.update();
      sphere.rotation.y = 0.1 * elapsedTime;
      plane.rotation.y = 0.1 * elapsedTime;
      torus.rotation.y = 0.1 * elapsedTime;

      sphere.rotation.x = 0.15 * elapsedTime;
      plane.rotation.x = 0.15 * elapsedTime;
      torus.rotation.x = 0.15 * elapsedTime;

      renderer.render(scene, camera);
    };

    animate();
  };
  return <div id="canvas" />;
};

export default Materials;
