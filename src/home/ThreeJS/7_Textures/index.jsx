import { useEffect } from "react";

import * as THREE from "three";
import * as dat from "dat.gui";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";

import imageSource from "/small.png";

const Textures = () => {
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(size.width, size.height);

    const dom = document.getElementById("canvas");
    dom.appendChild(renderer.domElement);

    /*
        Textures 纹理
        // UV坐标决定纹理在物体上的位置
    */
    const image = new Image();
    // 创建图片纹理
    // const texture = new THREE.Texture(image);

    // image.onload = () => {
    //   texture.needsUpdate = true;
    // };

    // image.src = imageSource;

    // 纹理加载器 更推荐这种写法 比上面写法更简洁
    // const textureLoader = new THREE.TextureLoader();
    // const texture = textureLoader.load(imageSource);

    // 纹理管理器 用于多纹理管理
    const loadingManage = new THREE.LoadingManager();
    loadingManage.onStart = () => {
      console.log("onStart");
    };

    loadingManage.onProgress = () => {
      console.log("onProgress");
    };

    loadingManage.onError = () => {
      console.log("onError");
    };

    const textureLoader = new THREE.TextureLoader(loadingManage);
    const texture = textureLoader.load(imageSource);
    // const texture2 = textureLoader.load(imageSource2);
    // const texture3 = textureLoader.load(imageSource3);
    // const texture4 = textureLoader.load(imageSource4);
    // const texture5 = textureLoader.load(imageSource5);

    // texture.repeat.x = 2; // 纹理向x方向重复2
    // texture.repeat.y = 3;

    // // 重复加载
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;

    // // 重复加载(镜像)
    // texture.wrapS = THREE.MirroredRepeatWrapping;
    // texture.wrapT = THREE.MirroredRepeatWrapping;

    // // 偏移
    // texture.offset.x = 0.5;

    // // 旋转
    // texture.rotation = Math.PI * 0.25;

    // // 设置变换中心的坐标
    // texture.center.x = 0.5;
    // texture.center.y = 0.5;

    // 如果均值过滤器中使用NearestFilter 可以停用生成映射并获得性能 texture.generateMipmaps = false;
    texture.generateMipmaps = false;

    // 均值过滤器 (默认为LinearMipmapLinearFilter)
    texture.minFilter = THREE.NearestFilter;

    // 具有MAG滤光片特性的放大滤光片 适合处理小像素图片在大质地的纹理显示 模糊的图片会显示的尖锐更清晰（参考我的世界砖块风格）
    texture.magFilter = THREE.NearestFilter;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ map: texture }); // 加载纹理需要讲材质设置map = texture

    const mesh = new THREE.Mesh(geometry, material);

    const camera = new THREE.PerspectiveCamera(
      75,
      size.width / size.height,
      0.1,
      100
    );

    scene.add(mesh);

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

export default Textures;
