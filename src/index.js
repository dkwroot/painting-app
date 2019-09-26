import React from "react";
import ReactDOM from "react-dom";
import Store from "./store";
import Toolbar from "./components/toolbar";
import PaintCanvas from "./components/paint-canvas";
import LayerWindow from "./components/layers";
import ReferenceArea from "./components/reference-area";

import "normalize.css";
import "./style.css";

function App() {
  return (
    <Store>
      <div className="wrapper-main">
        <div className="wrapper-main__model-menu" />

        <div className="wrapper-main__options-area">
          <LayerWindow />
        </div>

        <div className="wrapper-main__model-area">
          <ReferenceArea />
        </div>

        <div className="wrapper-main__draw-menu">
          <Toolbar />
        </div>

        <div className="wrapper-main__draw-area">
          <PaintCanvas />
        </div>
      </div>
    </Store>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
