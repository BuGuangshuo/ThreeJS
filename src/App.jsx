import { useEffect, useState } from "react";
import { Select } from "antd";

import Square from "./home/ThreeJS/1_firstSquare/index";

import "./App.css";
import ReactThreeFiber from "./home/ReactThreeFiber/react-three-fiber/index";
import Plan from "./home/ReactThreeFiber/2_plan/index";
import Drei from "./home/ReactThreeFiber/3_Drei/index";

const { Option } = Select;

const renderEnums = {
  Three: <Square />,
  fiber: <ReactThreeFiber />,
  plan: <Plan />,
  drei: <Drei />,
};

function App() {
  const [exKey, setExKey] = useState("drei");

  const renderCanvas = () => {
    return renderEnums[exKey];
  };

  return (
    <div>
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

      <div>{renderCanvas()}</div>
    </div>
  );
}

export default App;
