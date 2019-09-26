import React, { useContext, useEffect } from "react";
import "./style.scss";
import { StoreContext } from "../../store";
import * as Actions from "../../actions";
import * as CONST from "../../constants";

const Toolbar = () => {
  const [state, dispatch] = useContext(StoreContext);

  const undo = () => {
    //console.log(state.historyOffset, state.history.length);
    let element = state.history[state.history.length - 2 - state.historyOffset];
    dispatch(Actions.setHistoryOffset(1));
    //console.log("after:", state.historyOffset);
    let canvas = document.getElementById(`canvas_${element.id}`);
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, state.canvasWidth, state.canvasHeight);
    let img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    };
    img.src = element.data;
  };

  const redo = () => {
    //console.log(state.historyOffset, state.history.length);
    let element = state.history[state.history.length - 1 - state.historyOffset];
    dispatch(Actions.setHistoryOffset(-1));
    //console.log(state.history);
    let canvas = document.getElementById(`canvas_${element.id}`);
    let ctx = canvas.getContext("2d");
    let img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    };
    img.src = element.data;
  };

  const OpenImage = () => {
    //console.log(state);
  };

  const saveImage = () => {
    let saveBtn = document.getElementById("save");
    let destination = document.getElementById("frame");
    let destinationCtx = destination.getContext("2d");
    state.layers
      .slice()
      .reverse()
      .forEach(canvas => {
        //console.log(canvas);
        if (canvas.visible) {
          let source = document.getElementById(`canvas_${canvas.id}`);
          destinationCtx.drawImage(source, 0, 0);
        }
      });

    let dataURL = destination
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    saveBtn.href = dataURL;
    //window.location.href = dataURL;
    saveBtn.download = "picture.png";
  };

  const handleClick = e => {
    //console.log(e.target.id);
    switch (e.target.id) {
      case "undo":
        undo();
        break;
      case "redo":
        redo();
        break;
      case "open":
        OpenImage();
        break;
      case "save":
        saveImage();
        break;
      case "brush":
        dispatch(Actions.setBrush());
        break;
      case "eraser":
        dispatch(Actions.setEraser());
        break;
      case "line":
        dispatch(Actions.setLine());
        break;
      case "rectangle":
        dispatch(Actions.setRectangle());
        break;
      case "circle":
        dispatch(Actions.setCircle());
        break;
      case "polygon":
        dispatch(Actions.setPolygon());
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    let toolbar = document.getElementById("toolbar__container");
    toolbar.addEventListener("click", handleClick);

    return () => {
      toolbar.removeEventListener("click", handleClick);
    };
  });

  return (
    <div id="toolbar__container">
      <span id="undo" />

      <span id="redo" />

      <span id="open" onClick={OpenImage} className="unselected" />

      <a href="#" id="save" className="unselected" />

      <span
        className={state.activeTool === CONST.BRUSH ? "selected" : "unselected"}
        id="brush"
      />

      <span
        className={
          state.activeTool === CONST.ERASER ? "selected" : "unselected"
        }
        id="eraser"
      />

      <span
        className={state.activeTool === CONST.LINE ? "selected" : "unselected"}
        id="line"
      />

      <span
        className={
          state.activeTool === CONST.RECTANGLE ? "selected" : "unselected"
        }
        id="rectangle"
      />

      <span
        className={
          state.activeTool === CONST.CIRCLE ? "selected" : "unselected"
        }
        id="circle"
      />

      <span
        className={
          state.activeTool === CONST.POLYGON ? "selected" : "unselected"
        }
        id="polygon"
      />
    </div>
  );
};

export default Toolbar;
