import ReactDOM from "react-dom/client";
import React from "react";
import App from './App';

require("application.css");

window.onload = () => {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);
};
