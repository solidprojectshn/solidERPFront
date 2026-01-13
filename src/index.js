/**
=========================================================
* Argon Dashboard 2 MUI - v3.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-material-ui
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

//letra
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" />


import App from "App";

// Soft UI Context Provider
import { ArgonControllerProvider } from "context";

// react-perfect-scrollbar component
import PerfectScrollbar from "react-perfect-scrollbar";

// react-perfect-scrollbar styles
import "react-perfect-scrollbar/dist/css/styles.css";

const container = document.getElementById("root");
const root = createRoot(container);

//Redux
import { Provider } from "react-redux";
import generateStore from "./redux/store";
//const store = generateStore()
import store from "./redux/store";
import 'index.css'

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ArgonControllerProvider>
        <PerfectScrollbar>
          <App />
        </PerfectScrollbar>
      </ArgonControllerProvider>
    </BrowserRouter>
  </Provider>

);
