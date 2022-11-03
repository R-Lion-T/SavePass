import React from "react";

import { useSelector } from "react-redux";

import { BiHide, BiShow } from "react-icons/bi";
import { BsFillKeyFill } from "react-icons/bs";

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
        let status = "";
        switch (level) {
            case 0: {
                setUnique(`Ваш пароль входит в топ 200 НЕБЕЗОПАСНЫХ паролей`);
                return;
            }
            case 1: {
                status = "weak";

                break;
            }
            case 2: {
                status = "average";
                break;
            }
            case 3: {
                status = "high";
                break;
            }
        }
        if (level) {
            setUnique(false);
        }
        setStatus(status);
        if (uniquePassword(password, list, id)) {
            setUnique(`Этот пароль был замечен в других учетых записях это не
                безопасно! \n Ваши данные могут быть под угрозой!`);
        } else {
            setUnique(false);
        }
    }, [id, password]);

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
        window.app.openGenerate();
    };
    const onInput = (event) => {
        const newPassword = event.target.value.replace(/\s/g, "");
        setPassword(newPassword);
    };

    return (
        <div className="form_row input">
            <label>Пароль*</label>
            <div className="input_item">
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
            <p className={`status ${unique ? "error" : status}`}>
                <span></span>
                <span></span>
                <span></span>
            </p>
            {unique ? <p className="warning">{unique}</p> : null}
        </div>
    );
};
