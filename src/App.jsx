import { useEffect, useState } from "react";
import { Select } from "antd";

import Square from "./home/1_firstSquare";

import "./App.css";
import ReactThreeFiber from "./home/react-three-fiber";
import Plan from "./home/2_plan";
import Drei from "./home/3_Drei";

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
