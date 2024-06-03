import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import FacebookMsg from "./components/shop/home/Chat";

ReactDOM.render(
  <React.StrictMode>
    <App />
    <FacebookMsg/>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
