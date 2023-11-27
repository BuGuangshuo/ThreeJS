import { useEffect } from "react";
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Square = () => {
  useEffect(() => {
    init();
  }, []);

  const init = () => {
    // 创建场景
    const scene = new THREE.Scene();

    /*
        创建摄像机
        正交相机（OrthographicCamera）:使用orthographic projection（正交投影）来进行投影。在这种投影模式下，无论物体距离相机距离远或者近，在最终渲染的图片中物体的大小都保持不变。

        透视相机（PerspectiveCamera）:使用perspective projection（透视投影）来进行投影。这种投影模式被用来模拟人眼所看到的景象，它是3D场景的渲染中使用得最普遍的投影模式。

        双透视摄像机（立体相机）常被用于创建3D Anaglyph（3D立体影像） 或者Parallax Barrier（视差屏障）。

        --------------------------------------------------------------------------------------------------------------------

        参数说明：PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )

        fov — 摄像机视锥体垂直视野角度（是我们左眼与右眼可以看到的横向角度, 其越小物体则越大, 因为目光变狭窄会突出物体）
        aspect— 摄像机视锥体长宽比 near — 摄像机视锥体近端面（近平面, 就是当一个图像距离相机的距离小于1的时候, 就不显示图像）
        far — 摄像机视锥体远端面（远平面, 就是当一个图像距离相机的距离大于1000的时候, 就不显示这个图像）
        camera.position设置相机坐标，不设置默认为（0，0，0）
    */
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // 生成渲染实例
    const renderer = new THREE.WebGLRenderer();

    // 设置宽高
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#af3", 0.5); //背景颜色

    const dom = document.getElementById("square");
    dom.appendChild(renderer.domElement);

    // 插入辅助线长度为2的坐标系
    // const axisHelper = new THREE.AxesHelper(2);
    // scene.add(axisHelper);

    // 轨道控制器，可以使得相机围绕目标进行轨道运动，new OrbitControls(camera, dom) 传入摄像机与渲染的容器
    const orbitControl = new OrbitControls(camera, dom);

    // 生成一个立方体
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    // 设置材质

    const material = new THREE.MeshLambertMaterial({ color: "#767fff" });

    // 生成网格，网格上含有位置信息、旋转信息、缩放信息等等, 需要用几何体与材质两个参数, 但其实并不像网上说的必须要有材质, 不传材质也能显示。
    const cube = new THREE.Mesh(geometry, material);

    // 将物体添加到网格坐标，默认添加到(0,0,0)坐标
    scene.add(cube);

    /*
        光源设置
        1. 环境光（AmbientLight）：环境光会均匀的照亮场景中的所有物体，不能用来投射阴影，因为它没有方向。
        2. 点光源（PointLight）：从一个点向各个方向发射的光源。一个常见的例子是模拟一个灯泡发出的光。该光源可以投射阴影。
            color - (可选参数)) 十六进制光照颜色。 缺省值 0xffffff (白色)。
            intensity - (可选参数) 光照强度。缺省值 1。
            distance - 这个距离表示从光源到光照强度为0的位置。 当设置为0时，光永远不会消失(距离无穷大)。缺省值 0.
            decay - 沿着光照距离的衰退量。缺省值 1。 在 physically correct 模式中，decay = 2。
    */

    // 聚光灯光源：
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 40, -15);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    spotLight.shadow.camera.far = 130;
    spotLight.shadow.camera.near = 40;
    spotLight.distance = 0;
    spotLight.target = cube;
    spotLight.angle = 0.4;
    spotLight.intensity = 10999;
    spotLight.shadow.camera.fov = 120;
    scene.add(spotLight);

    // 光源对象设置
    const sphereSize = 2;
    const pointLightHelper = new THREE.PointLightHelper(
      spotLight,
      sphereSize,
      "#000"
    );
    scene.add(pointLightHelper);

    // 移动摄像机
    camera.position.z = 3;
    camera.position.x = 3;

    // 设置动态渲染函数并调用
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();
  };

  return <div id="square" />;
};

export default Square;
