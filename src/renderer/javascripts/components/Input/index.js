import React from "react";

import { useSelector } from "react-redux";

import { BiHide, BiShow } from "react-icons/bi";
import { BsFillKeyFill } from "react-icons/bs";
import { IoIosWarning } from "react-icons/io";
import "./style.scss";

export const InputPassword = ({
    password = "",
    setPassword = () => {},
    id = null,
    placeholder="",
}) => {
    const [show, setShow] = React.useState(false);
    const [status, setStatus] = React.useState("");
    const { list } = useSelector((state) => state.data);
    const [unique, setUnique] = React.useState(false);
    const [focus, setFocus] = React.useState(false);

    React.useEffect(() => {
        const level = window.password.passwordCheck(password);
        setStatus(level);
        setUnique(window.password.isUnique({ password, list, id }));
    }, [id, password, list]);

    React.useEffect(() => {
        function funSetPassword(event) {
            const generate_password = event?.detail?.password;
            if (generate_password) {
                setPassword(generate_password);
                setShow(true);
                setTimeout(() => {
                    setShow(false);
                }, 1800);
            }
        }
        window.addEventListener("setpasswordinput", funSetPassword);
        return () => {
            window.removeEventListener("setpasswordinput", funSetPassword);
        };
    }, []);

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
        window.app.openGenerate(true);
    };
    const onInput = (event) => {
        const newPassword = event.target.value.replace(/\s/g, "");
        setPassword(newPassword);
    };
    const inptId = React.useId();
    return (
        <div className="form_row input">
            <label htmlFor={inptId}>Пароль*</label>
            <div
                className={`input_item input_item_btns ${focus ? "focus" : ""}`}
            >
                <input
                    id={inptId}
                    type={show || focus ? "text" : "password"}
                    value={password}
                    onInput={onInput}
                    required
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    placeholder={placeholder}
                />
                <p className="btns">
                    <button
                        type="button"
                        className="btn btn_svg"
                        title="Сгенерировать пароль"
                        onClick={showGenerate}
                    >
                        <BsFillKeyFill />
                    </button>
                    <button
                        type="button"
                        className="btn btn_svg"
                        title="Посмотреть пароль"
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
                <p className="input-warning">
                    <IoIosWarning /> Не рекомендуем использовать одинаковые
                    пароли
                </p>
            ) : null}
        </div>
    );
};

export const InputView = React.memo(function InputView({
    label = "",
    type = "text",
    name = "",
    defaultValue = "",
    onInput = () => {},
    required = true,
    disabled = false,
    classNames = "",
    placeholder = "",
    candidate = null, // кадитанты на автозаполнение {array}
    children,
}) {
    const [value, setValue] = React.useState(defaultValue);
    const inputEl = React.useRef(null);

    React.useEffect(() => {
        if (value != defaultValue) {
            setValue(defaultValue);
        }
    }, [defaultValue]);

    function handelChange(e) {
        const searchType = ["url"];
        const searchName = ["login"];
        const search = [...searchType, ...searchName];

        let regS = " ";

        if (search.includes(type) || search.includes(name)) {
            regS = "";
        }

        setValue(e.target.value.replace(/\s+/g, regS));
    }
    function sendValue() {
        if (!disabled) {
            onInput(value.trim());
        }
    }

    const inpId = React.useId();

    const option = React.useMemo(() => {
        if (candidate && candidate?.array.length && value.length) {
            for (let item of candidate.array) {
                const text = item[name].substr(0, value.length);
                if (text.toLowerCase() === value.toLowerCase()) {
                    return item[name];
                }
            }
            return false;
        }
        return false;
    }, [candidate, value]);

    const keys = ["Tab", "Enter"];

    const onKeyDown = (e) => {
        if (keys.includes(e.key) && option && value != option) {
            e.preventDefault();
            setValue(option);
        }
    };
    return (
        <div className={`input ${classNames}`}>
            {label.length ? (
                <label htmlFor={inpId}>
                    {label}
                    {required ? "*" : ""}
                </label>
            ) : null}
            <p className="input_item">
                <input
                    id={inpId}
                    ref={inputEl}
                    type={type}
                    name={name}
                    value={value}
                    onInput={handelChange}
                    onBlur={sendValue}
                    required={required}
                    disabled={disabled}
                    placeholder={placeholder}
                    spellCheck={false}
                    onKeyDown={onKeyDown}
                />
                {option && option != value ? (
                    <span className="input_placeholder">{option}</span>
                ) : null}
            </p>
            {children}
        </div>
    );
});

export const Textarea = React.memo(function Textarea({
    label = "",
    name = "",
    defaultValue = "",
    onInput = () => {},
    required = true,
    disabled = false,
    placeholder = "",
}) {
    const [value, setValue] = React.useState(defaultValue);

    React.useEffect(() => {
        if (value != defaultValue) {
            setValue(defaultValue);
        }
    }, [defaultValue]);

    function handelChange(e) {
        setValue(e.target.value);
    }

    function sendValue() {
        if (!disabled) {
            onInput(value.trim());
        }
    }
    const inpId = React.useId();
    return (
        <div className="form_row input">
            {label.length ? (
                <label htmlFor={inpId}>
                    {label}
                    {required ? "*" : ""}
                </label>
            ) : null}
            <p className="input_item">
                <textarea
                    name={name}
                    id={inpId}
                    spellCheck={false}
                    placeholder={placeholder}
                    value={value}
                    onInput={handelChange}
                    onBlur={sendValue}
                    disabled={disabled}
                />
            </p>
        </div>
    );
});
