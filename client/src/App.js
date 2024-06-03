import React, { Fragment, useReducer } from "react";
import Routes from "./components";
import { LayoutContext, layoutState, layoutReducer } from "./components/shop";
import FacebookMsg from "./components/shop/home/Chat";

function App() {
  const [data, dispatch] = useReducer(layoutReducer, layoutState);
  return (
    <Fragment>
      <LayoutContext.Provider value={{ data, dispatch }}>
        <Routes />
        <FacebookMsg/>
      </LayoutContext.Provider>
    </Fragment>
  );
}

export default App;
