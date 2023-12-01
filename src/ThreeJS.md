# Thress.js

## 一、概念

在 Three.js 的世界中，几何体（Geometry）由顶点（vertices），线，面组成，被用来定义物体的「形状」和「大小」。

如果您想要在 3D 世界中「创造」某个物体，您需要首先确定这个物体「长什么样」？然后您就可以通过以下三种方式，创造出该物体

在 Three.js 中创建一个「3D 物体」必须通过实例化一个「网格对象（Mesh）」实现。**几何体**（**Geometry**），**材质**（**Material**）和**网格对象**（**Mesh**）三者的关系像是一个金字塔。

## 二、具体实现

####1. 以 React 框架为例，我们需要先引入 Three.js

```javascript
import * as THREE from "three";
```

####2. 接下来创建场景

```javascript
const scene = new THREE.Scene();
```

####3. 现在创建一个摄像机，摄像机决定了观察的位置

```javascript
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
```

######摄像机的分类：

    正交相机（OrthographicCamera）:使用orthographic projection（正交投影）来进行投影。在这种投影模式下，无论物体距离相机距离远或者近，在最终渲染的图片中物体的大小都保持不变。

    透视相机（PerspectiveCamera）:使用perspective projection（透视投影）来进行投影。这种投影模式被用来模拟人眼所看到的景象，它是3D场景的渲染中使用得最普遍的投影模式。

    双透视摄像机（立体相机）常被用于创建3D Anaglyph（3D立体影像） 或者Parallax Barrier（视差屏障）。

    --------------------------------------------------------------------------------------------------------------------

    参数说明：PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )

    fov — 摄像机视锥体垂直视野角度（是我们左眼与右眼可以看到的横向角度, 其越小物体则越大, 因为目光变狭窄会突出物体）
    aspect— 摄像机视锥体长宽比 near — 摄像机视锥体近端面（近平面, 就是当一个图像距离相机的距离小于1的时候, 就不显示图像）
    far — 摄像机视锥体远端面（远平面, 就是当一个图像距离相机的距离大于1000的时候, 就不显示这个图像）
    camera.position设置相机坐标，不设置默认为（0，0，0）

移动摄像机

```javascript
camera.position.z = 3;
// or
camera.position.set(1, 2, 3); // x,y,z
```

#####4. 摄像机设置好了，接下来开始生成渲染实例

```javascript
// 生成渲染实例
const renderer = new THREE.WebGLRenderer();

// 设置宽高
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#af3", 0.5); //背景颜色

const dom = document.getElementById("square"); //获取dom
dom.appendChild(renderer.domElement); // 在dom里插入创建好的渲染实例
```

####5. 摄像机、场景、实例都准备好了 现在开始创建一个立方体

```javascript
// BoxGeometry 立方体
const geometry = new THREE.BoxGeometry(1, 1, 1); // 长宽高(1,1,1)
```

####6. 设置材质

```javascript
const material = new THREE.MeshLambertMaterial({ color: "#767fff" });
```

######材质类型（只列举几种，更多在 Three.JS 官方文档里有详细解释）

MeshLambertMaterial：一种非光泽表面的材质，没有镜面高光。

MeshBasicMaterial：一个以简单着色（平面或线框）方式来绘制几何体的材质。
**注意：这种材质不受光照的影响，无论什么颜色的光照都只会呈现材质本身的颜色。**

MeshStandardMaterial：一种基于物理的标准材质，使用 Metallic-Roughness 工作流程。
基于物理的渲染（PBR）最近已成为许多 3D 应用程序的标准，例如 Unity， Unreal 和 3D Studio Max。

在实践中，该材质提供了比 MeshLambertMaterial 或 MeshPhongMaterial 更精确和逼真的结果，代价是计算成本更高。。

####7. 生成网格并将物体添加到网格坐标中

```java
// 生成网格，网格上含有位置信息、旋转信息、缩放信息等等, 需要用几何体与材质两个参数, 但其实并不像网上说的必须要有材质, 不传材质也能显示。
const cube = new THREE.Mesh(geometry, material);

// 将物体添加到网格坐标，默认添加到(0,0,0)坐标
scene.add(cube);
```

####8. 最后设置动态渲染函数并调用

```java
const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01; // 增加旋转动画，物体绕x轴旋转
      renderer.render(scene, camera); //将场景scence、摄像机camera传入render中
};
animate();
```

#####此时一个基础立方体就创建完成了 ✅

##三、光源

####1. 概念 ######光源是对于自然界光照的模拟，往往为了更好的渲染场景，需要设置不同的光源，设置不同的光照强度。

####2. 分类 ######一般光源可以分成以下类别：环境光(AmbientLight)、平行光(DirectionalLight)、点光源(PointLight)、聚光灯光源(SpotLight)

> 环境光(AmbientLight):
>
> > 环境光是没有特定方向的光源，主要是均匀改变物体明暗的效果，如果没有设置环境光，那么物体会是一个全黑的对象。环境光会均匀的照亮场景中的所有物体，不能用来投射阴影，因为它没有方向。

```javascript
const ambient = new THREE.AmbientLight("red");
scene.add(ambient); //环境光对象添加到scene场景中
```

> 点光源(PointLight):
>
> > 点光源就像我们生活中的灯泡，当设置点光源的时候，必须设置光源的位置属性 position，他会呈现出阴暗面，我们可以设置光源的位置来感受点光源的特点

```javascript
const point = new THREE.PointLight("red");
point.position.set(400, 200, 300);
scene.add(point);
```

> 平行光(DirectionalLight):
>
> > 平行光的光线是平行的，也就是说物体的每一个区域接收到的入射角是相同的，在设置的时候，使用 position 和 target 两个属性来一起确定平行光的方向，target 的属性值可以是 threejs 场景中任何一个三维模型

```javascript
const directionalLight = new THREE.DirectionalLight(red, 1);
// 两点确定一条直线，我们要找两个点，一个是我们设置的点(position)，一个是物体(target)
// 平行光如果不设置position和target属性，那么光线默认从上往下照射，也就可以认为是从(0,1,0)和(0,0,0)两个点确定的直线
directionalLight.position.set(80, 100, 50);
directionalLight.target = cube;
scene.add(directionalLight);
```

> 聚光灯光源(SpotLight):
>
> > 聚光灯是一个会沿着特定方向逐渐发散的光源，在一个立体空间会构成一个圆锥体，通过属性 angle 可以设置聚光灯发散的角度，照射位置和平行光相同是由 position 和 target 两个属性实现的。

```javascript
// 聚光灯设置
var spotLight = new THREE.SpotLight("red");
// 两点确定一条直线，我们要找两个点，一个是我们设置的点(position)，一个是物体(target)
spotLight.position.set(200, 200, 200);
spotLight.target = cube;
// 设置发散的角度
spotLight.angle = Math.PI / 100; // Math.PI 圆的周长与其直径之比，其值约为3.141,一般用来旋转，Math.PI旋转半圈，Math.PI * 0.25 八分之一圈

scene.add(spotLight);
```

######可以设置一个光源对象来帮助你知晓光照方向

```java
// 光源对象设置
const sphereSize = 2;
const pointLightHelper = new THREE.PointLightHelper(
    spotLight,  // 光源类型
    sphereSize, // 光源对象大小
    "#000"      // 光源对象颜色
);
scene.add(pointLightHelper);
```

##四、轨道控制器
####1. 概念
可以使得相机围绕目标进行轨道运动。

####2. 实现

#####引入 OrbitControls

```java
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
```

#####设置轨道控制器

```java
// new OrbitControls(camera, dom) 传入摄像机与渲染的容器
const orbitControl = new OrbitControls(camera, dom);
```

## 五、BufferGeometry

###1. 概念
缓冲区类型几何体 BufferGeometry 是 Three.js 的核心类之一，立方体 BoxBufferGeometry、圆柱体 CylinderBufferGeometry、球体 SphereBufferGeometry 等几何体类的基类都是 BufferGeometry。

BufferGeometry 对原生 WebGL 中的顶点位置、顶点纹理坐标 UV、顶点颜色、顶点法向量、顶点索引等顶点数据进行了封装
###2. 实现
#####BufferGeometry 自定义一个几何体

```java
// 创建一个缓冲类型的几何体对象
var geo = new THREE.BufferGeometry();
//类型数组创建顶点数据  数组中包含6个顶点的xyz坐标数据
var verArr = new Float32Array([
  1, 2, 3,
  49, 2, 4,
  -1, 99, -1,
  1, 1, 9,
  6, 5, 108,
  48, 1, 3,
]);
//三个为一组，表示一个顶点坐标
var BufferAttribute = new THREE.BufferAttribute(verArr, 3);
// 设置几何体的顶点位置数据
geo.attributes.position = BufferAttribute;
```

> 上面同样一个几何体，如果你创建不同的模型，可以渲染出来不同的效果，这里之所以说着一点，也是为了让你理解顶点指的是什么。

#####三角形渲染模式：
没有顶点索引数据复用顶点的情况下，每个三角形包含三个顶点，上面 6 个顶点可以渲染两个三角形。

```java
// 三角面(网格)渲染模式
var material = new THREE.MeshPhongMaterial({
  color: 0x1111ff, //三角面颜色
  side: THREE.DoubleSide //两面可见
});
var mesh = new THREE.Mesh(geometry, material);
```

#####线模型：
线渲染模式，两点确定一条直线。

```java
// 线条渲染模式
var material = new THREE.LineBasicMaterial({color:0xff0000});
//线条模型对象
var line = new THREE.Line(geo,material);
```

#####点模型：
点渲染模式，6 个顶点渲染出来 6 个方形点。

```java
var material = new THREE.PointsMaterial({
  color: 0xff1133,
  size: 6.0 //点对象像素尺寸
});
 //点模型对象
var points = new THREE.Points(geo, material);
```

###3. `.attributes`属性
three.js 提供的 BufferAttribute 类用于创建一个表示一组同类顶点数据的对象，可以用 BufferAttribute。

几何体的.attributes 属性是除了顶点索引数据以外所有顶点数据的集合，比如.attributes.position 表示顶点位置坐标数据，.attributes.uv 表示顶点纹理坐标 UV 数据，.attributes.normal 表示顶点法向量数据，所有的类型的顶点数据都是一一对应的。.attributes.position、.attributes.uv、.attributes.normal 的属性值都是 BufferAttribute 对象。

###3. `.index`属性
.index 属性的值是顶点索引数据构成的 BufferAttribute 对象，如果你有一定的原生 WebGL 基础，应该知道顶点索引的功能是复用顶点数据，比如一定矩形有一个顶点，如果不设置顶点索引，需要至少 6 个顶点才能绘制两个三角形组合出来一个矩形，如果定义顶点索引数据，重合的两个顶点可以复用顶点数据，只需要顶点 4 个顶点坐标即可。

#####6 个顶点定义一个矩形

```java
//类型数组创建顶点位置position数据
var vertices = new Float32Array([
  10, 10, 10,   //顶点1位置
  90, 10, 10,  //顶点2位置
  90, 90, 10, //顶点3位置

  10, 10, 10,   //顶点4位置   和顶点1位置相同
  90, 90, 10, //顶点5位置  和顶点3位置相同
  10, 90, 10,  //顶点6位置
]);
var attribue = new THREE.BufferAttribute(vertices, 3);
geometry.attributes.position = attribue
```

#####4 个顶点定义一个矩形

```java
var geometry = new THREE.BufferGeometry();
var vertices = new Float32Array([
  10, 10, 10, //顶点1位置
  90, 10, 10, //顶点2位置
  90, 90, 10, //顶点3位置
  10, 90, 10, //顶点4位置
]);
var attribue = new THREE.BufferAttribute(vertices, 3);
geometry.attributes.position = attribue

// Uint16Array类型数组创建顶点索引数据,如果顶点数量更多可以使用Uint32Array来创建顶点索引数据的类型数组对象
var indexes = new Uint16Array([
  0, 1, 2, 0, 2, 3,
])
// 索引数据赋值给几何体的index属性
geometry.index = new THREE.BufferAttribute(indexes, 1);
```

###4. `.attribute()`方法
.addAttribute()方法执行的时候，本质上是改变的.attributes 属性，.attributes 属性可以直接设置.attributes.position、.attributes.uv 等属性，也可以通过.addAttribute()方法设置。

#####直接设置.attributes.position

```java
geometry.attributes.position = new THREE.BufferAttribute(vertices, 3)
```

#####通过.addAttribute()方法设置.attributes.position 等顶点属性值

```java
geometry.addAttribute('position',new THREE.BufferAttribute(vertices,3));
geometry.addAttribute('normal',new THREE.BufferAttribute(normals,3));
geometry.addAttribute('uv',new THREE.BufferAttribute(uvs,2));
```

###5. `.fromGeometry()`方法
通过.fromGeometry()方法可以把一个几何体 Geometry 转化为一个缓冲类型几何体 BufferGeometry。

```java
var box = new THREE.BoxGeometry()
var BufferBox = new THREE.BufferGeometry()
BufferBox.fromGeometry(box)
```

####具体其他配置信息可以去 Three.JS 官方文档进行详细查阅
https://threejs.org/

1. clock
2. gsap
3. 适配屏幕变化
4. 全屏
5. ***
6. 几何
7. 存储缓冲区几何数据
8. 创建三角形
9. ***
10. debugUI
11. dt.GUI
12. ***
13. 纹理
14. 加载纹理
15. 纹理管理器
16. UV
17. 转换质感
18. Filter 和空间映射
19. 纹理格式和优化
20. ***
21. 材质
22. 环境 Map
23. ***
24. 3DText
25. 边界
