import React from "react";

import { useSelector } from "react-redux";

import { BiHide, BiShow } from "react-icons/bi";
import { BsFillKeyFill } from "react-icons/bs";
import { IoIosWarning } from "react-icons/io";

import { uniquePassword } from "../function";

export const InputPassword = ({
    password = "",
    setPassword = () => {},
    id = null,
}) => {
    const [show, setShow] = React.useState(false);
    const [status, setStatus] = React.useState("");
    const { list } = useSelector((state) => state.data);
    const [unique, setUnique] = React.useState(false);

    React.useEffect(() => {
        const level = window.password.passwordCheck(password);
        setStatus(level);
        setUnique(uniquePassword(password, list, id));
    }, [id, password]);

    React.useEffect(()=>{
        function funSetPassword(event){
            const generate_password = event?.detail?.password;
            if(generate_password){
                setPassword(generate_password);
                setShow(true)
                setTimeout(()=>{
                    setShow(false)
                },1800)
            }
        }
        window.addEventListener("setpasswordinput", funSetPassword)
        return ()=>{
            window.removeEventListener("setpasswordinput", funSetPassword)
        }
    },[])

    const onShow = () => {
        setShow(true);
    };
    const onHide = () => {
        if (show) {
            setShow(false);
        }
    };

    const showGenerate = (event) => {
        event.preventDefault();
        window.app.openGenerate(true)
    };
    const onInput = (event) => {
        const newPassword = event.target.value.replace(/\s/g, "");
        setPassword(newPassword);
    };

    return (
        <div className="form_row input">
            <label>Пароль*</label>
            <div className="input_item input_item_btns">
                <input
                    type={show ? "text" : "password"}
                    value={password}
                    onInput={onInput}
                    required
                />
                <p className="btns">
                    <button
                        type="button"
                        className="btn btn_svg"
                        onClick={showGenerate}
                    >
                        <BsFillKeyFill />
                    </button>
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
            <p className={`status ${unique ? "error" : "level_" + status}`}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </p>
            {unique ? (
                <p className="warning">
                    <IoIosWarning /> Не рекомендуем использовать одинаковые
                    пароли
                </p>
            ) : null}
        </div>
    );
};
