import React from "react";

import { WinButton } from "../Buttons";
import Settings from "./Settings";

import { BiWindow, BiWindows } from "react-icons/bi";
import { GrClose } from "react-icons/gr";
import { FaRegWindowMinimize } from "react-icons/fa";

import logo from "../../../images/logo.png";
import "./style.scss";


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

                <span className={"seporator"}></span>

                <WinButton onClick={window.app.hide} title="Скрыть окно">
                    <FaRegWindowMinimize />
                </WinButton>

                <WinButton onClick={window.app.resize} title="Изменить размер окна">
                    {winIsminimize ? <BiWindows /> : <BiWindow />}
                </WinButton>

                <WinButton role="close" onClick={window.app.exit} title="Закрыть приложение">
                    <GrClose />
                </WinButton>
            </div>
        </div>
    );
});

export default Header;
