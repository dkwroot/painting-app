import React, { useContext, useEffect, useRef } from "react";
import "./style.scss";
import { StoreContext } from "../../store";
import * as CONST from "../../constants";
import * as ACT from "../../actions";

const PaintCanvas = () => {
  const [state, dispatch] = useContext(StoreContext);
  const mouseActive = useRef(false);
  const prevPos = useRef([]);

  useEffect(() => {
    let canvas = document.getElementById("viewport");
    canvas.addEventListener("mousedown", MouseDown);
    canvas.addEventListener("mouseup", MouseUp);
    canvas.addEventListener("mousemove", MouseMove);

    canvas.addEventListener("touchstart", touchStart);
    canvas.addEventListener("touchend", MouseUp);
    canvas.addEventListener("touchmove", TouchMove);

    return () => {
      canvas.removeEventListener("mousedown", MouseDown);
      canvas.removeEventListener("mouseup", MouseUp);
      canvas.removeEventListener("mousemove", MouseMove);

      canvas.removeEventListener("touchstart", touchStart);
      canvas.removeEventListener("touchend", MouseUp);
      canvas.removeEventListener("touchmove", TouchMove);
    };
  });

  const MouseDown = e => {
    let canvas = document.getElementById(`canvas_${state.activeLayer}`);
    let ctx = canvas.getContext("2d");
    let bbox = canvas.getBoundingClientRect();

    let viewCanvas = document.getElementById("viewport");
    let viewCtx = viewCanvas.getContext("2d");

    let vis = state.layers[canvas.dataset.index].visible;
    if (!vis) return null;

    // Reset history if undo was used
    if (state.historyOffset !== 1) {
      dispatch(ACT.resetHistoryOffset());
    }

    ctx.strokeStyle = state.strokeColor;
    ctx.lineWidth = state.strokeWidth;

    viewCtx.strokeStyle = state.strokeColor;
    viewCtx.lineWidth = state.strokeWidth;

    mouseActive.current = true;

    if (state.activeTool === CONST.POLYGON && prevPos.current.length > 0) {
      let x = prevPos.current[0].x - (e.clientX - Math.trunc(bbox.left));
      let y = prevPos.current[0].y - (e.clientY - Math.trunc(bbox.top));
      let distance2first = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      x =
        prevPos.current[prevPos.current.length - 1].x -
        (e.clientX - Math.trunc(bbox.left));
      y =
        prevPos.current[prevPos.current.length - 1].y -
        (e.clientY - Math.trunc(bbox.top));
      let distance2last = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      if (distance2first < 7 || distance2last < 7) {
        mouseActive.current = false;
        if (state.history.length === 0) {
          dispatch(
            ACT.updateHistory(
              state.activeLayer,
              canvas.toDataURL("image/png", 1.0)
            )
          );
        }
        ctx.drawImage(viewCanvas, 0, 0);
        viewCtx.clearRect(0, 0, state.canvasWidth, state.canvasHeight);
        prevPos.current = [];
      } else {
        prevPos.current.push({
          x: e.clientX - Math.trunc(bbox.left),
          y: e.clientY - Math.trunc(bbox.top)
        });
      }
    } else {
      if (state.history.length === 0) {
        dispatch(
          ACT.updateHistory(
            state.activeLayer,
            canvas.toDataURL("image/png", 1.0)
          )
        );
      }
      prevPos.current = [
        {
          x: e.clientX - Math.trunc(bbox.left),
          y: e.clientY - Math.trunc(bbox.top)
        }
      ];
    }

    switch (state.activeTool) {
      case CONST.ERASER:
        ctx.globalCompositeOperation = "destination-out";
        break;
      default:
        break;
    }
  };

  const touchStart = e => {
    let canvas = document.getElementById(`canvas_${state.activeLayer}`);
    let ctx = canvas.getContext("2d");

    let viewCanvas = document.getElementById("viewport");
    let viewCtx = viewCanvas.getContext("2d");

    let vis = state.layers[canvas.dataset.index].visible;
    if (!vis) return null;

    if (state.historyOffset !== 1) {
      dispatch(ACT.resetHistoryOffset());
    }

    ctx.strokeStyle = state.strokeColor;
    ctx.lineWidth = state.strokeWidth;

    viewCtx.strokeStyle = state.strokeColor;
    viewCtx.lineWidth = state.strokeWidth;

    mouseActive.current = true;

    if (e.touches) {
      if (e.touches.length === 1) {
        let touch = e.touches[0];
        if (state.activeTool === CONST.POLYGON && prevPos.current.length > 0) {
          let x =
            prevPos.current[0].x - (touch.pageX - touch.target.offsetLeft);
          let y = prevPos.current[0].y - (touch.pageY - touch.target.offsetTop);
          let distance2first = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

          x =
            prevPos.current[prevPos.current.length - 1].x -
            (touch.pageX - touch.target.offsetLeft);
          y =
            prevPos.current[prevPos.current.length - 1].y -
            (touch.pageY - touch.target.offsetTop);
          let distance2last = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

          if (distance2first < 7 || distance2last < 7) {
            mouseActive.current = false;
            if (state.history.length === 0) {
              dispatch(
                ACT.updateHistory(
                  state.activeLayer,
                  canvas.toDataURL("image/png", 1.0)
                )
              );
            }
            ctx.drawImage(viewCanvas, 0, 0);
            viewCtx.clearRect(0, 0, state.canvasWidth, state.canvasHeight);
            prevPos.current = [];
          } else {
            prevPos.current.push({
              x: touch.pageX - touch.target.offsetLeft,
              y: touch.pageY - touch.target.offsetTop
            });
          }
        } else {
          if (state.history.length === 0) {
            dispatch(
              ACT.updateHistory(
                state.activeLayer,
                canvas.toDataURL("image/png", 1.0)
              )
            );
          }
          prevPos.current = [
            {
              x: touch.pageX - touch.target.offsetLeft,
              y: touch.pageY - touch.target.offsetTop
            }
          ];
        }
        e.preventDefault();
      }
    }

    switch (state.activeTool) {
      case CONST.ERASER:
        ctx.globalCompositeOperation = "destination-out";
        break;
      default:
        break;
    }
  };

  const drawToCanvas = (e, ctx, viewCtx, currentPos, isMouse) => {
    let arrLength = prevPos.current.length - 1;
    switch (state.activeTool) {
      case CONST.BRUSH:
        ctx.beginPath();
        if (isMouse) {
          ctx.lineWidth = state.strokeWidth;
        } else {
          ctx.lineWidth = state.strokeWidth * e.touches[0].force * 2;
        }
        ctx.lineCap = "round";
        ctx.moveTo(prevPos.current[arrLength].x, prevPos.current[arrLength].y);
        ctx.lineTo(currentPos[arrLength].x, currentPos[arrLength].y);
        prevPos.current = currentPos;
        ctx.stroke();
        ctx.closePath();
        break;
      case CONST.ERASER:
        ctx.beginPath();
        //ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.moveTo(prevPos.current[arrLength].x, prevPos.current[arrLength].y);
        ctx.lineTo(currentPos[arrLength].x, currentPos[arrLength].y);
        prevPos.current = currentPos;
        ctx.stroke();
        ctx.closePath();
        break;
      case CONST.LINE:
        viewCtx.clearRect(0, 0, state.canvasWidth, state.canvasHeight);
        viewCtx.beginPath();
        viewCtx.lineWidth = state.strokeWidth;
        viewCtx.moveTo(
          prevPos.current[arrLength].x,
          prevPos.current[arrLength].y
        );
        viewCtx.lineTo(currentPos[arrLength].x, currentPos[arrLength].y);
        //prevPos.current = currentPos;
        viewCtx.stroke();
        viewCtx.closePath();
        break;
      case CONST.RECTANGLE:
        viewCtx.clearRect(0, 0, state.canvasWidth, state.canvasHeight);
        viewCtx.beginPath();
        if (!e.shiftKey) {
          viewCtx.rect(
            prevPos.current[arrLength].x,
            prevPos.current[arrLength].y,
            currentPos[arrLength].x - prevPos.current[arrLength].x,
            currentPos[arrLength].y - prevPos.current[arrLength].y
          );
        } else {
          viewCtx.rect(
            prevPos.current[arrLength].x,
            prevPos.current[arrLength].y,
            Math.min(
              currentPos[arrLength].x - prevPos.current[arrLength].x,
              currentPos[arrLength].x - prevPos.current[arrLength].x
            ),
            Math.min(
              currentPos[arrLength].x - prevPos.current[arrLength].x,
              currentPos[arrLength].x - prevPos.current[arrLength].x
            )
          );
        }
        viewCtx.stroke();
        viewCtx.closePath();
        break;
      case CONST.CIRCLE:
        viewCtx.clearRect(0, 0, state.canvasWidth, state.canvasHeight);
        viewCtx.beginPath();
        if (e.shiftKey) {
          viewCtx.arc(
            prevPos.current[arrLength].x,
            prevPos.current[arrLength].y,
            Math.sqrt(
              Math.pow(
                currentPos[arrLength].x - prevPos.current[arrLength].x,
                2
              ) +
                Math.pow(
                  currentPos[arrLength].y - prevPos.current[arrLength].y,
                  2
                )
            ),
            0,
            2 * Math.PI
          );
        } else {
          viewCtx.ellipse(
            prevPos.current[arrLength].x,
            prevPos.current[arrLength].y,
            Math.abs(currentPos[arrLength].x - prevPos.current[arrLength].x),
            Math.abs(currentPos[arrLength].y - prevPos.current[arrLength].y),
            0,
            0,
            2 * Math.PI
          );
        }
        viewCtx.stroke();
        viewCtx.closePath();
        break;
      case CONST.POLYGON:
        viewCtx.clearRect(0, 0, state.canvasWidth, state.canvasHeight);
        viewCtx.beginPath();
        viewCtx.lineCap = "round";
        for (let k = 0; k < arrLength; k++) {
          viewCtx.moveTo(prevPos.current[k].x, prevPos.current[k].y);
          viewCtx.lineTo(prevPos.current[k + 1].x, prevPos.current[k + 1].y);
        }
        viewCtx.moveTo(
          prevPos.current[arrLength].x,
          prevPos.current[arrLength].y
        );
        viewCtx.lineTo(
          currentPos[currentPos.length - 1].x,
          currentPos[currentPos.length - 1].y
        );
        viewCtx.stroke();
        viewCtx.closePath();
        break;
      default:
        break;
    }
  };

  const MouseMove = e => {
    if (mouseActive.current) {
      let canvas = document.getElementById(`canvas_${state.activeLayer}`);
      let ctx = canvas.getContext("2d");
      let bbox = canvas.getBoundingClientRect();
      //let currentPos;

      let viewCanvas = document.getElementById("viewport");
      let viewCtx = viewCanvas.getContext("2d");

      let currentPos = [
        {
          x: e.clientX - Math.trunc(bbox.left),
          y: e.clientY - Math.trunc(bbox.top)
        }
      ];

      drawToCanvas(e, ctx, viewCtx, currentPos, true);
    }
  };

  const TouchMove = e => {
    if (mouseActive.current) {
      let canvas = document.getElementById(`canvas_${state.activeLayer}`);
      let ctx = canvas.getContext("2d");
      let currentPos;

      let viewCanvas = document.getElementById("viewport");
      let viewCtx = viewCanvas.getContext("2d");

      if (e.touches) {
        if (e.touches.length === 1) {
          let touch = e.touches[0];
          currentPos = [
            {
              x: touch.pageX - touch.target.offsetLeft,
              y: touch.pageY - touch.target.offsetTop
            }
          ];
          e.preventDefault();
        }
      }

      drawToCanvas(e, ctx, viewCtx, currentPos, false);
    }
  };

  const MouseUp = e => {
    if (mouseActive.current) {
      let canvas = document.getElementById(`canvas_${state.activeLayer}`);
      let ctx = canvas.getContext("2d");

      let viewCanvas = document.getElementById("viewport");
      let viewCtx = viewCanvas.getContext("2d");

      if (state.activeTool !== CONST.POLYGON) {
        mouseActive.current = false;
        ctx.drawImage(viewCanvas, 0, 0);
        viewCtx.clearRect(0, 0, state.canvasWidth, state.canvasHeight);
        prevPos.current = [];
      }

      dispatch(
        ACT.updateHistory(state.activeLayer, canvas.toDataURL("image/png", 1.0))
      );

      viewCtx.lineWidth = state.strokeWidth;

      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = state.strokeWidth;
    }
  };

  let canvasList = state.layers.map((current, index) => {
    return (
      <canvas
        className={current.visible ? "canvas" : "canvas canvas--hidden"}
        width={state.canvasWidth}
        height={state.canvasHeight}
        key={current.id}
        id={`canvas_${current.id}`}
        data-index={index}
      />
    );
  });

  return (
    <div id="paint-canvas__container">
      {canvasList.reverse()}
      <canvas
        className="canvas canvas--hidden"
        id="frame"
        height={state.canvasHeight}
        width={state.canvasWidth}
      />
      <canvas
        className="viewport"
        id="viewport"
        height={state.canvasHeight}
        width={state.canvasWidth}
      />
      <div className="background" />
    </div>
  );
};

export default PaintCanvas;
