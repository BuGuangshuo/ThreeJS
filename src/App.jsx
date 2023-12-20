import { useEffect, useState } from "react";
import { Select } from "antd";

import Square from "./home/ThreeJS/1_firstSquare/index";

import "./App.css";
import ReactThreeFiber from "./home/ReactThreeFiber/react-three-fiber/index";
import Plan from "./home/ReactThreeFiber/2_plan/index";
import Drei from "./home/ReactThreeFiber/3_Drei/index";
import Transfrom_Object from "./home/ThreeJS/2_Thansform_objets";
import Camera from "./home/ThreeJS/3_camera";
import Ultimate from "./home/ThreeJS/4_Ultimate";
import Geometries from "./home/ThreeJS/5_geometries";
import DebugUI from "./home/ThreeJS/6_debugUi";
import Textures from "./home/ThreeJS/7_Textures";
import Materials from "./home/ThreeJS/8_Materials";
import TextD from "./home/ThreeJS/9_3DText";
import Light from "./home/ThreeJS/10_Light";
import Shadows from "./home/ThreeJS/11_Shadows";
import GhostHouse from "./home/ThreeJS/12_ghostHouse";

const { Option } = Select;

const renderEnums = {
  Transfrom_Object: <Transfrom_Object />,
  //--------------------------
  Three: <Square />,
  fiber: <ReactThreeFiber />,
  plan: <Plan />,
  drei: <Drei />,
  camera: <Camera />,
  ultimeate: <Ultimate />,
  geometries: <Geometries />,
  debugUI: <DebugUI />,
  textures: <Textures />,
  materials: <Materials />,
  Text3D: <TextD />,
  Light: <Light />,
  Shadows: <Shadows />,
  ghostHouse: <GhostHouse />,
};

function App() {
  const [threeKey, setThreeKey] = useState("ghostHouse");
  const [exKey, setExKey] = useState("drei");
  const [type, setType] = useState("Three");

  const renderCanvas = () => {
    if (type === "Three") {
      return renderEnums[threeKey];
    } else {
      return renderEnums[exKey];
    }
  };

  const onTypeChange = (val) => {
    setType(val);
  };

  return (
    <div>
      <Select value={type} onChange={onTypeChange}>
        <Option value="Three">ThreeJs</Option>
        <Option value="React-Three-Fiber">React-Three-Fiber</Option>
      </Select>

      {type === "Three" ? (
        <Select
          value={threeKey}
          onChange={(e) => setThreeKey(e)}
          style={{ width: 170 }}
        >
          <Option value="Transfrom_Object">Transfrom_Object</Option>
          <Option value="camera">camera</Option>
          <Option value="ultimeate">ultimeate</Option>
          <Option value="geometries">geometries</Option>
          <Option value="debugUI">debugUI</Option>
          <Option value="textures">textures</Option>
          <Option value="materials">materials</Option>
          <Option value="Text3D">Text3D</Option>
          <Option value="Light">Light</Option>
          <Option value="Shadows">Shadows</Option>
          <Option value="ghostHouse">ghostHouse</Option>
        </Select>
      ) : (
        <Select
          value={exKey}
          onChange={(e) => setExKey(e)}
          style={{ width: 170 }}
        >
          <Option value="Three">Three.JS</Option>
          <Option value="fiber">React-Three-Fiber</Option>
          <Option value="plan">plan</Option>
          <Option value="drei">drei</Option>
        </Select>
      )}

      <div>{renderCanvas()}</div>
    </div>
  );
}

export default App;
