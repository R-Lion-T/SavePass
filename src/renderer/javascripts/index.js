import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";

import "./../stylesheets/theme.scss";
import "./../stylesheets/fonts.css";
import "./../stylesheets/style.scss";

import store from "./redux/store";

import { App } from "./App";


window.onload = () => {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
        <Provider store={store}>
            <HashRouter>
                <App />
            </HashRouter>
        </Provider>
    );
};
