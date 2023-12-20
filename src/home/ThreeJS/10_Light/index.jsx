import { useEffect } from "react";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

const Light = () => {
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

    const material = new THREE.MeshStandardMaterial();

    // 创建球体
    const geometry = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);

    // 创建球体
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      //   new THREE.SphereGeometry(0.5, 64, 64), // 增加细分
      material
    );

    sphere.position.x = -1.5;

    // 创建甜甜圈形
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.2, 16, 32),
      //   new THREE.TorusGeometry(0.3, 0.2, 64, 128), // 增加细分
      material
    );
    torus.position.x = 1.5;

    // 创建平面
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), material);
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -1;

    scene.add(geometry, sphere, torus, plane);

    /*
        Light
    */

    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    // 另一种写法
    ambientLight.color = new THREE.Color(0xffffff);
    ambientLight.intensity = 0.5;

    scene.add(ambientLight);

    // 平行光
    const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
    directionalLight.position.set(1, 0.25, 0); // 设置光源位置

    scene.add(directionalLight);

    // 半球光 光源直接放置于场景之上，光照颜色从天空光线颜色渐变到地面光线颜色。半球光不能投射阴影。
    const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1); // 天空发出光线的颜色 地面发出光线的颜色 光照强度

    scene.add(hemisphereLight);

    // 点光源
    const pointLight = new THREE.PointLight(0xff900, 1);
    pointLight.position.set(1, -0.5, 0);
    pointLight.distance = 2; // 衰变值

    scene.add(pointLight);

    /*
        平面光光源 平面光光源从一个矩形平面上均匀地发射光线。这种光源可以用来模拟像明亮的窗户或者条状灯光光源。
        不支持阴影
        只支持 MeshStandardMaterial 和 MeshPhysicalMaterial 两种材质。
    */
    const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1); // 颜色 光照强度 光源宽度 光源高度
    rectAreaLight.position.set(-1.5, 0, 1.5);
    rectAreaLight.lookAt(new THREE.Vector3()); // 光源朝向方向
    scene.add(rectAreaLight);

    /*
        聚光灯 光线从一个点沿一个方向射出，随着光线照射的变远，光线圆锥体的尺寸也逐渐增大。
        该光源可以投射阴影
    */

    const spotLight = new THREE.SpotLight(
      0x78ff00, // 颜色
      4, // 光照强度
      10, // 光源照射的最大距离。默认值为 0（无限远）。
      Math.PI * 0.1, // 光线照射范围的角度。默认值为 Math.PI/3。
      0.25, //  聚光锥的半影衰减百分比。默认值为 0。
      1 // 沿着光照距离的衰减量。默认值为 2
    );
    spotLight.position.set(0, 2, 3);
    scene.add(spotLight);

    // 聚光灯移动需要设置target坐标，并将物体的target添加到场景中
    spotLight.target.position.x = -0.5;
    scene.add(spotLight.target);

    /*
        Helpers
    */

    const hemisphereLightHelper = new THREE.HemisphereLightHelper(
      hemisphereLight,
      0.2
    );
    scene.add(hemisphereLightHelper);

    const dictionLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      0.2
    );
    scene.add(dictionLightHelper);

    const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
    scene.add(pointLightHelper);

    const spotLightHelper = new THREE.SpotLightHelper(spotLight); // 无大小
    scene.add(spotLightHelper);

    const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight); // RectAreaLightHelper不在THREE中 需额外引入
    scene.add(rectAreaLightHelper);
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
      geometry.rotation.x += 0.01;
      geometry.rotation.y += 0.01;

      torus.rotation.x += 0.01;
      torus.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();
  };
  return <div id="canvas" />;
};

export default Light;
