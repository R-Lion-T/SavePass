import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiShow, BiHide } from "react-icons/bi";
import { isValidUrl, passwordCheck, uniquePassword } from "./../../function";
import { useSelector, useDispatch } from "react-redux";
import { ac_add_data } from "../../redux/actions/ac_state";

export const Add = React.memo(function Add() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { list } = useSelector((state) => state.data);
    const [unique, setUnique] = React.useState(false);
    const [isHttps, setIsHttps] = React.useState(false);
    const [show, setShow] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [login, setLogin] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [href, setHref] = React.useState("");
    const [status, setStatus] = React.useState("");
    const onShow = () => {
        setShow(true);
    };
    const onHide = () => {
        if (show) {
            setShow(false);
        }
    };
    const onCheckedPassword = (event) => {
        const newPassword = event.target.value.replace(/\s/g, "");
        const newStatus = passwordCheck(newPassword);
        setPassword(newPassword);
        setStatus(newStatus);
    };
    const chekedUniquePassword = () => {
        const result = uniquePassword(password, list);
        setUnique(result);
    };
    const onInputLogin = (event) => {
        setLogin(event.target.value.replace(/\s+/g, ""));
    };
    const onCheckedHref = (event) => {
        const newHref = event.target.value.replace(/\s/g, "");
        setHref(newHref);
    };
    const chekedUrl = () => {
        if (href.length) setIsHttps(href.indexOf("https") == -1);
    };
    const onInputTitle = (event) => {
        setTitle(event.target.value);
    };
    const onCheckedTitle = (event) => {
        const newTitle = event.target.value.replace(/\s+/g, " ").trim();
        setTitle(newTitle);
    };
    const onSave = (event) => {
        event.preventDefault();
        const body = {
            id: new Date().getTime(),
            title,
            login,
            href: isValidUrl(href),
            password,
        };
        window.app.addDataFile(body).then((res) => {
            if (res) {
                dispatch(ac_add_data(body));
                navigate("/list");
            }
        });
    };

    return (
        <form className="form scroll" onSubmit={onSave}>
            <p className="form_title">??????????????</p>
            <div className="form_row input">
                <label>????????????????*</label>
                <p className="input_item">
                    <input
                        type="text"
                        value={title}
                        onInput={onInputTitle}
                        onBlur={onCheckedTitle}
                        required
                    />
                </p>
            </div>
            <div className="form_row input">
                <label>??????????*</label>
                <p className="input_item">
                    <input
                        type="text"
                        value={login}
                        onInput={onInputLogin}
                        required
                    />
                </p>
            </div>

            <div className="form_row input">
                <label>????????????*</label>
                <div className="input_item">
                    <input
                        type={show ? "text" : "password"}
                        value={password}
                        onInput={onCheckedPassword}
                        onBlur={chekedUniquePassword}
                        onMouseLeave={chekedUniquePassword}
                        required
                    />
                    <p className="btns">
                        <button
                            type="button"
                            className="btn btn_svg"
                            onMouseDown={onShow}
                            onMouseUp={onHide}
                            onMouseLeave={onHide}
                        >
                            {show ? <BiHide /> : <BiShow />}
                        </button>
                    </p>
                </div>
                <p className={`status ${unique ? "error" : status}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                </p>
                {unique && (
                    <p className="warning">
                        ???????? ???????????? ?????? ?????????????? ?? ???????????? ???????????? ?????????????? ?????? ????
                        ??????????????????! <br /> ???????? ???????????? ?????????? ???????? ?????? ??????????????!
                    </p>
                )}
            </div>

            <div className="form_row input">
                <label>????????????</label>
                <p className="input_item">
                    <input
                        type="url"
                        placeholder="https://site.ru/"
                        value={href}
                        onMouseLeave={chekedUrl}
                        onBlur={chekedUrl}
                        onInput={onCheckedHref}
                    />
                </p>
                {isHttps && (
                    <p className="warning">
                        ?? ?????????? ?????????? ???????????????????????? ????????????????????! <br /> ????????
                        ???????????? ?????????? ???????? ?????? ??????????????!
                    </p>
                )}
            </div>

            <p className="form_btns">
                <Link to="/list" className="btn btn_default" draggable="false">
                    ????????????
                </Link>
                <button className="btn btn_primary">??????????????????</button>
            </p>
        </form>
    );
});
