import React from "react";
import ReactDOM from "react-dom/client";
import APP from "./App";
import { BrowserRouter } from "react-router-dom";

import "./common/style.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <APP />
  </BrowserRouter>
);
