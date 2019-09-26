import * as CONST from "./constants";
//import console = require("console");

const reducer = (state, action) => {
  switch (action.type) {
    case CONST.CHANGE_TOOL:
      return { ...state, activeTool: action.payload };
    case CONST.ADD_CANVAS:
      return { ...state, canvas: [...state.canvas, action.payload] };
    case CONST.SET_ACTIVE_LAYER:
      return { ...state, activeLayer: action.payload };
    case CONST.SET_STROKE_COLOR:
      return { ...state, strokeColor: action.payload };
    case CONST.SET_STROKE_WIDTH:
      return { ...state, strokeWidth: action.payload };
    case CONST.SET_FILL_COLOR:
      return { ...state, fillColor: action.payload };
    case CONST.TOGGLE_LAYER:
      return {
        ...state,
        layers: state.layers.map(layer => {
          return {
            ...layer,
            visible:
              action.payload === layer.id ? !layer.visible : layer.visible
          };
        })
      };
    case CONST.ADD_LAYER:
      return {
        ...state,
        layerIndex: action.payload + 1,
        layers: [
          {
            name: `layer_${action.payload + 1}`,
            id: action.payload + 1,
            visible: true
          },
          ...state.layers
        ]
      };
    case CONST.DELETE_LAYER:
      return {
        ...state,
        activeLayer: state.layers[0].id,
        layers: state.layers.filter(layer => {
          return state.activeLayer !== layer.id;
        })
      };
    case CONST.UPDATE_HISTORY:
      // History = {layerID, canvasData}
      let temp_hist = [...state.history];
      temp_hist.push(action.payload);
      if (temp_hist.length > 10) temp_hist.shift();
      return {
        ...state,
        history: [...temp_hist]
      };
    case CONST.SET_HISTORY_OFFSET:
      if (
        state.history.length + -1 > state.historyOffset + action.payload &&
        state.historyOffset + action.payload >= 0
      ) {
        return {
          ...state,
          historyOffset: state.historyOffset + action.payload
        };
      } else {
        return {
          ...state
        };
      }
    case CONST.RESET_HISTORY_OFFSET:
      return {
        ...state,
        history: state.history.slice(
          0,
          state.history.length - state.historyOffset
        ),
        historyOffset: 0
      };
    default:
      throw new Error("action type must be defined");
  }
};

export default reducer;
