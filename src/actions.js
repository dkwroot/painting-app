import * as CONST from "./constants";

export const setBrush = () => {
  return {
    type: CONST.CHANGE_TOOL,
    payload: CONST.BRUSH
  };
};

export const setLine = () => {
  return {
    type: CONST.CHANGE_TOOL,
    payload: CONST.LINE
  };
};

export const setCircle = () => {
  return {
    type: CONST.CHANGE_TOOL,
    payload: CONST.CIRCLE
  };
};

export const setRectangle = () => {
  return {
    type: CONST.CHANGE_TOOL,
    payload: CONST.RECTANGLE
  };
};

export const setPolygon = () => {
  return {
    type: CONST.CHANGE_TOOL,
    payload: CONST.POLYGON
  };
};

export const setEraser = () => {
  return {
    type: CONST.CHANGE_TOOL,
    payload: CONST.ERASER
  };
};

export const addCanvas = canvas => {
  return {
    type: CONST.ADD_CANVAS,
    payload: canvas
  };
};

export const setCanvasDimensions = ({ width, height }) => {
  return {
    type: CONST.SET_CANVAS_DIMENSIONS,
    payload: { width: width, height: height }
  };
};

export const setActiveLayer = id => {
  return {
    type: CONST.SET_ACTIVE_LAYER,
    payload: id
  };
};

export const setStrokeColor = color => {
  return {
    type: CONST.SET_STROKE_COLOR,
    payload: color
  };
};

export const setStrokeWidth = width => {
  return {
    type: CONST.SET_STROKE_WIDTH,
    payload: width
  };
};

export const setFillColor = color => {
  return {
    type: CONST.SET_FILL_COLOR,
    payload: color
  };
};

export const addLayer = id => {
  return {
    type: CONST.ADD_LAYER,
    payload: id
  };
};

export const deleteLayer = id => {
  return {
    type: CONST.DELETE_LAYER,
    payload: id
  };
};

export const toggleLayer = id => {
  return {
    type: CONST.TOGGLE_LAYER,
    payload: id
  };
};

export const updateHistory = (id, canvasData) => {
  return {
    type: CONST.UPDATE_HISTORY,
    payload: { id: id, data: canvasData }
  };
};

export const setHistoryOffset = increment => {
  return {
    type: CONST.SET_HISTORY_OFFSET,
    payload: increment
  };
};

export const resetHistoryOffset = () => {
  return {
    type: CONST.RESET_HISTORY_OFFSET
  };
};
