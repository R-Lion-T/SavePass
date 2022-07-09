import React from "react";
import { AiFillFile, AiFillFileAdd } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import logo from "../../../images/logo.png";
const Start = React.memo(function Start() {
    const navigate = useNavigate();
    function openFile() {
        const lastPathFile = window.localStorage.getItem("lastPathFile");
        window.app.openDataFile(lastPathFile).then((res) => {
            if (res) {
                navigate("/checkedPassword");
            }
        });
    }
    function createFile() {
        window.app.createPathFile().then((url) => {
            if (url) navigate("/createPassword");
        });
    }
    return (
        <div className="start">
            <img className="start_logo" src={logo} alr="logo" />
            <p className="start_title">
                Добро пожаловать <br /> SavePass
            </p>
            <div className="start_boxs">
                <div className="box" onClick={openFile}>
                    <AiFillFile className="box_icon" />
                    <p className="box_text">Открыть файл</p>
                </div>
                <div className="box" onClick={createFile}>
                    <AiFillFileAdd className="box_icon" />
                    <p className="box_text">Создать файл</p>
                </div>
            </div>
        </div>
    );
});

export default Start;
