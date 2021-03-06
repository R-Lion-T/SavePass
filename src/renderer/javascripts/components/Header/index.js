import React from "react";
import { BiWindow, BiWindows } from "react-icons/bi";
import { GrClose } from "react-icons/gr";
import { FaRegWindowMinimize } from "react-icons/fa";
import logo from "../../../images/logo.png";
import Settings from "./../Settings";
const Header = React.memo(function Header() {
    const [winIsminimize, setWinIsminimize] = React.useState(true);
    React.useEffect(() => {
        window.app
            .getStatusWindow()
            .then((data) => setWinIsminimize(data.resize));

        window.addEventListener("MAIN_RESIZE", (event) => {
            setWinIsminimize(event.detail.resize);
        });
    }, []);

    return (
        <div className="header">
            <p className="header_logo">
                <img src={logo} alt="logo" />
                <span>SavePass</span>
            </p>
            <div className="header_drag"></div>
            <div className="header_window window">
                <Settings />
                <button className="window_btn" onClick={window.app.hide}>
                    <FaRegWindowMinimize />
                </button>

                <button className="window_btn" onClick={window.app.resize}>
                    {winIsminimize ? <BiWindows /> : <BiWindow />}
                </button>

                <button
                    className="window_btn window_btn_close"
                    onClick={window.app.exit}
                >
                    <GrClose />
                </button>
            </div>
        </div>
    );
});

export default Header;
