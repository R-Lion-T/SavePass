import React from "react";
import { useNavigate } from "react-router-dom";

import  "./style.scss";

import { AiFillFile, AiFillFileAdd } from "react-icons/ai";

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
        navigate("/createPassword");
    }
    return (
        <div className="start">
            <img className="start_logo" src={logo} alr="logo" />
            <p className="start_title">
                Добро пожаловать <br /> SavePass
            </p>
            <div className="start_boxs">
                <div tabIndex="0" className="box"  onKeyDown={(e)=> e.key=="Enter"?openFile():null }  onClick={openFile}>
                    <AiFillFile className="box_icon" />
                    <p className="box_text">Открыть файл</p>
                </div>
                <div tabIndex="0" className="box" onKeyDown={(e)=> e.key=="Enter"?createFile():null } onClick={createFile}>
                    <AiFillFileAdd className="box_icon" />
                    <p className="box_text">Создать файл</p>
                </div>
            </div>
        </div>
    );
});

export default Start;
