import React, { createContext, useReducer } from "react";
import reducer from "./reducers";
import * as CONST from "./constants";

export const StoreContext = createContext({});

const initialState = {
  activeTool: CONST.BRUSH,
  canvasWidth: 600,
  canvasHeight: 600,
  layers: [{ id: 0, visible: true }],
  activeLayer: 0, // Layer id
  activeIndex: 0, // activeLayer's index in layers array
  strokeColor: "#000000",
  fillColor: "#FFFFFF",
  strokeWidth: 5,
  eraserWidth: 10,
  layerIndex: 0, // Number of layers created
  history: [],
  historyOffset: 0
};

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
};

export default Store;
