import { useEffect } from "react";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const GhostHouse = () => {
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
    renderer.setClearColor("#262837");
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const dom = document.getElementById("canvas");
    dom.appendChild(renderer.domElement);

    /* Texture */
    const textureLoader = new THREE.TextureLoader();

    const doorColorTexture = textureLoader.load(
      "/texture/doors/red_brick_plaster_patch_02_diff_2k.jpg"
    );

    const doorAoTexture = textureLoader.load(
      "/texture/doors/red_brick_plaster_patch_02_ao_2k.jpg"
    );
    const doorNormalTexture = textureLoader.load(
      "/texture/doors/red_brick_plaster_patch_02_nor_gl_2k.jpg"
    );
    const doorRoughTexture = textureLoader.load(
      "/texture/doors/red_brick_plaster_patch_02_rough_2k.jpg"
    );
    const doorMetalTexture = textureLoader.load(
      "/texture/doors/red_brick_plaster_patch_02_disp_2k.png"
    );

    const wallsColorTexture = textureLoader.load(
      "/texture/walls/medieval_blocks_03_diff_1k.jpg"
    );

    const wallsAoTexture = textureLoader.load(
      "/texture/walls/medieval_blocks_03_ao_1k.jpg"
    );
    const wallsNormalTexture = textureLoader.load(
      "/texture/walls/medieval_blocks_03_nor_gl_1k.jpg"
    );
    const wallsRoughTexture = textureLoader.load(
      "/texture/walls/medieval_blocks_03_rough_1k.jpg"
    );

    const grassColorTexture = textureLoader.load(
      "/texture/grass/leafy_grass_diff_1k.jpg"
    );

    const grassAoTexture = textureLoader.load(
      "/texture/grass/leafy_grass_ao_1k.jpg"
    );
    const grassNormalTexture = textureLoader.load(
      "/texture/grass/leafy_grass_nor_dx_1k.jpg"
    );
    const grassRoughTexture = textureLoader.load(
      "/texture/grass/leafy_grass_rough_1k"
    );

    grassColorTexture.repeat.set(8, 8);
    grassAoTexture.repeat.set(8, 8);
    grassNormalTexture.repeat.set(8, 8);
    grassRoughTexture.repeat.set(8, 8);

    grassColorTexture.wrapS = THREE.RepeatWrapping;
    grassAoTexture.wrapS = THREE.RepeatWrapping;
    grassNormalTexture.wrapS = THREE.RepeatWrapping;
    grassRoughTexture.wrapS = THREE.RepeatWrapping;

    grassColorTexture.wrapT = THREE.RepeatWrapping;
    grassAoTexture.wrapT = THREE.RepeatWrapping;
    grassNormalTexture.wrapT = THREE.RepeatWrapping;
    grassRoughTexture.wrapT = THREE.RepeatWrapping;
    /* House */

    // Create Group
    const house = new THREE.Group();
    scene.add(house);

    // Create Walls 创建墙壁
    const walls = new THREE.Mesh(
      new THREE.BoxGeometry(4, 2.5, 4),
      new THREE.MeshStandardMaterial({
        map: wallsColorTexture,
        aoMap: wallsAoTexture,
        normalMap: wallsNormalTexture,
        roughnessMap: wallsRoughTexture,
      })
    );

    // aoMap设置uv坐标
    walls.geometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
    );

    walls.position.y = 1.26;

    walls.castShadow = true;

    house.add(walls);

    // Create Roof 创建房顶
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(3.5, 1, 4),
      new THREE.MeshStandardMaterial({ color: "#b35f45" })
    );

    roof.position.y = 3;
    roof.rotation.y = Math.PI * 0.25;
    house.add(roof);

    // Create Door 创建门
    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.5, 100, 100),
      new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        aoMap: doorAoTexture,
        displacementMap: doorMetalTexture,
        displacementScale: 0.03,
        normalMap: doorNormalTexture,
        roughnessMap: doorRoughTexture,
      })
    );

    // aoMap设置uv坐标
    door.geometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
    );

    door.position.y = 0.7;
    door.position.z = 2 + 0.01;
    house.add(door);

    // Create Bush 创建灌木丛
    const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
    const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

    const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush1.scale.set(0.5, 0.5, 0.5);
    bush1.position.set(0.8, 0.2, 2.2);

    const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush2.scale.set(0.25, 0.25, 0.25);
    bush2.position.set(1.4, 0.1, 2.1);

    const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush3.scale.set(0.4, 0.4, 0.4);
    bush3.position.set(-0.8, 0.1, 2.2);

    const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush4.scale.set(0.15, 0.15, 0.15);
    bush4.position.set(-1, 0.05, 2.6);

    bush1.castShadow = true;
    bush2.castShadow = true;
    bush3.castShadow = true;
    bush4.castShadow = true;

    house.add(bush1, bush2, bush3, bush4);

    // Create Graves 创建坟墓
    const graves = new THREE.Group();
    scene.add(graves);

    const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
    const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 6;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      const grave = new THREE.Mesh(graveGeometry, graveMaterial);
      grave.position.set(x, 0.3, z);
      grave.rotation.z = (Math.random() - 0.5) * 0.4;
      grave.rotation.y = (Math.random() - 0.5) * 0.4;

      grave.castShadow = true;

      graves.add(grave);
    }
    /* Floor */
    const planeMaterial = new THREE.MeshStandardMaterial({
      map: grassColorTexture,
      aoMap: grassAoTexture,
      normalMap: grassNormalTexture,
      roughnessMap: grassRoughTexture,
    });

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      planeMaterial
    );

    // aoMap设置uv坐标
    plane.geometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(plane.geometry.attributes.uv.array, 2)
    );

    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0;

    plane.receiveShadow = true;

    scene.add(plane);

    // 增加雾
    const fog = new THREE.Fog("#262837", 1, 15);
    scene.fog = fog;
    // 环境光
    const sun = new THREE.AmbientLight("#b9d5ff", 0.12);
    scene.add(sun);

    // 月光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.12);
    directionalLight.position.set(4, 5, -2); // 设置光源位置
    directionalLight.castShadow = true;

    scene.add(directionalLight);

    // Door Light
    const doorLight = new THREE.PointLight("#ff7d46", 3, 7);
    doorLight.position.set(0, 2, 2, 2.7);
    doorLight.castShadow = true;

    doorLight.shadow.mapSize.width = 256;
    doorLight.shadow.mapSize.height = 256;
    doorLight.shadow.camera.far = 7;

    house.add(doorLight);

    // Ghost Light
    const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
    scene.add(ghost1);

    const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
    scene.add(ghost2);

    const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
    scene.add(ghost3);

    ghost1.castShadow = true;
    ghost2.castShadow = true;
    ghost3.castShadow = true;

    ghost1.shadow.mapSize.width = 256;
    ghost1.shadow.mapSize.height = 256;
    ghost1.shadow.camera.far = 7;

    ghost2.shadow.mapSize.width = 256;
    ghost2.shadow.mapSize.height = 256;
    ghost2.shadow.camera.far = 7;

    ghost3.shadow.mapSize.width = 256;
    ghost3.shadow.mapSize.height = 256;
    ghost3.shadow.camera.far = 7;

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

      // Update ghosts
      const ghost1Angle = elapsedTime * 0.5;
      ghost1.position.x = Math.cos(ghost1Angle) * 4;
      ghost1.position.z = Math.sin(ghost1Angle) * 4;
      ghost1.position.y = Math.sin(elapsedTime * 3);

      const ghost2Angle = elapsedTime * 0.32;
      ghost2.position.x = Math.cos(ghost2Angle) * 5;
      ghost2.position.z = Math.sin(ghost2Angle) * 5;
      ghost2.position.y =
        Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

      const ghost3Angle = elapsedTime * 0.18;
      ghost3.position.x =
        Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
      ghost3.position.z =
        Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
      ghost3.position.y =
        Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

      requestAnimationFrame(animate);
      orbitControls.update();
      renderer.render(scene, camera);
    };

    animate();
  };
  return <div id="canvas" />;
};

export default GhostHouse;
