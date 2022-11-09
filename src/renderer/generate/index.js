import React from "react";
import ReactDOM from "react-dom/client";

import "./../stylesheets/theme.scss";
import "./../stylesheets/fonts.css";
import "./../stylesheets/style.scss";

import App from './App';

window.onload = () => {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);
};
