import React, { useContext, useEffect } from "react";
import "./style.scss";
import { StoreContext } from "../../store";
import * as ACT from "../../actions";

import {
  setActiveLayer,
  setStrokeColor,
  addLayer,
  deleteLayer,
  toggleLayer
} from "../../actions";

import { ChromePicker } from "react-color";

const LayerWindow = () => {
  const [state, dispatch] = useContext(StoreContext);

  let layers = state.layers.map(current => {
    return (
      <div
        className={
          state.activeLayer === current.id ? "layer layer--active" : "layer"
        }
        id={`layer_${current.id}`}
        key={`layer_${current.id}`}
        data-visible="true"
      >
        <div
          data-id={`${current.id}`}
          data-type={`visibility`}
          className={current.visible ? "eye-open" : "eye-closed"}
        />

        <div
          data-id={`${current.id}`}
          data-type={`name`}
          className="name-container"
        >
          <input
            id={`textbox_${current.id}`}
            className={"layer-name--hidden"}
            type="text"
            data-id={`${current.id}`}
            data-type={`textbox`}
          />
          <div
            id={`name_${current.id}`}
            className="layer-name"
            data-id={`${current.id}`}
            data-type={`name`}
          >
            layer {current.id}
          </div>
        </div>
      </div>
    );
  });

  let handleColor = color => {
    dispatch(setStrokeColor(color.hex));
  };

  const handleClick = e => {
    switch (e.target.dataset.type) {
      case "name":
        dispatch(setActiveLayer(Number(e.target.dataset.id)));
        break;
      case "visibility":
        dispatch(toggleLayer(Number(e.target.dataset.id)));
        break;
      default:
        break;
    }
  };

  const handleDblClick = e => {
    switch (e.target.dataset.type) {
      case "name":
        document.getElementById(
          `textbox_${Number(e.target.dataset.id)}`
        ).className = "layer-name";
        document.getElementById(
          `name_${Number(e.target.dataset.id)}`
        ).className = "layer-name--hidden";
        break;
      case "textbox":
        let nameTextbox = document.getElementById(
          `textbox_${Number(e.target.dataset.id)}`
        );
        let nameLayer = document.getElementById(
          `name_${Number(e.target.dataset.id)}`
        );
        nameTextbox.className = "layer-name--hidden";
        nameLayer.className = "layer-name";
        if (nameTextbox.value !== "") {
          nameLayer.innerHTML = nameTextbox.value;
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    let container = document.getElementById("layers__container");
    container.addEventListener("click", handleClick);
    container.addEventListener("dblclick", handleDblClick);

    return () => {
      container.removeEventListener("click", handleClick);
      container.removeEventListener("dblclick", handleDblClick);
    };
  });

  return (
    <div id="layers__container">
      <div>
        <ChromePicker
          color={state.strokeColor}
          onChangeComplete={handleColor}
        />
      </div>

      <div className="wrapper__layer-window">{layers}</div>

      <div className="icon-container">
        <span
          id="clear"
          className="icon"
          onClick={() => {
            let canvas = document.getElementById(`canvas_${state.activeLayer}`);
            let ctx = canvas.getContext("2d");

            dispatch(
              ACT.updateHistory(
                state.activeLayer,
                canvas.toDataURL("image/png", 1.0)
              )
            );

            ctx.clearRect(0, 0, state.canvasWidth, state.canvasHeight);
            if (state.historyOffset !== 1) {
              dispatch(ACT.resetHistoryOffset());
            }
          }}
        />

        <span
          id="addLayer"
          className="icon"
          onClick={() => {
            dispatch(addLayer(state.layerIndex));
          }}
        >
          +
        </span>

        <span
          id="deleteLayer"
          className="icon"
          onClick={() => {
            if (state.layers.length > 1) {
              dispatch(deleteLayer(state.activeLayer));
            }
            if (state.historyOffset !== 1) {
              dispatch(ACT.resetHistoryOffset());
            }
          }}
        >
          -
        </span>
      </div>
    </div>
  );
};

export default LayerWindow;
