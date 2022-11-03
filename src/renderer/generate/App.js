import React from "react";
import { AiFillCopy, AiOutlineReload } from "react-icons/ai";
import { BsFillShieldSlashFill, BsShieldFillCheck } from "react-icons/bs";

function App() {
    const [value, setValue] = React.useState(
        "QWERTYUIOPASDFGHJKLZXCVBNM1234567890@$&_#!%*=-~^?"
    );
    const [status, setStatus] = React.useState(null);
    const [length, setLength] = React.useState(10);
    const [number, setNumber] = React.useState(true);
    const [symbol, setSymbol] = React.useState(true);
    const [lower, setLower] = React.useState(true);
    const [upper, setUpper] = React.useState(true);

    React.useEffect(() => {
        const local_length = window.localStorage.getItem(
            "generate-password-length"
        );
        const local_number = window.localStorage.getItem(
            "generate-password-number"
        );
        const local_symbol = window.localStorage.getItem(
            "generate-password-symbol"
        );
        const local_upper = window.localStorage.getItem(
            "generate-password-upper"
        );
        const local_lower = window.localStorage.getItem(
            "generate-password-lower"
        );

        if (local_length) {
            setLength(Number(local_length));
        }
        if (local_number) {
            let result = false;
            if (local_number === "true") {
                result = true;
            }
            setNumber(result);
        }
        if (local_symbol) {
            let result = false;
            if (local_symbol === "true") {
                result = true;
            }
            setSymbol(result);
        }
        if (local_upper) {
            let result = false;
            if (local_upper === "true") {
                result = true;
            }
            setUpper(result);
        }
        if (local_lower) {
            let result = false;
            if (local_lower === "true") {
                result = true;
            }
            setLower(result);
        }

    }, []);

    const onGenerate = () => {
        const value = window.password.getRandomPassword({
            length,
            lower,
            upper,
            number,
            symbol,
        });
        if (value) {
            let getSatus = window.password.passwordCheck(value);
            setStatus(getSatus);
            setValue(value);
        }
    };

    const onClose =()=>{
        window.localStorage.setItem("generate-password-length", length);
        window.localStorage.setItem("generate-password-number", number);
        window.localStorage.setItem("generate-password-symbol", symbol);
        window.localStorage.setItem("generate-password-upper", upper);
        window.localStorage.setItem("generate-password-lower", lower);
        window.app.closeGenerate();
    }

    React.useEffect(onGenerate, [length, number, upper, symbol, lower]);

    let statusText = "";
    switch (status) {
        case 0: {
            statusText = (
                <p className="generate_window_foot_text color-danger">
                    <BsFillShieldSlashFill />
                    Этот пароль входит топ 200 список самых распространенных у
                    пользователей
                </p>
            );
            break;
        }
        case 1: {
            statusText = (
                <p className="generate_window_foot_text color-danger">
                    <BsFillShieldSlashFill />
                    Пароль не надежный
                </p>
            );
            break;
        }
        case 2: {
            statusText = (
                <p className="generate_window_foot_text color-warning">
                    <BsShieldFillCheck />
                    Пароль не очень надежный
                </p>
            );
            break;
        }
        case 3: {
            statusText = (
                <p className="generate_window_foot_text color-access">
                    <BsShieldFillCheck />
                    Надежный пароль
                </p>
            );
            break;
        }
        default: {
            break;
        }
    }
    return (
        <div className="generate">
            <div className="generate_window">
                <p className="generate_window_text">{value}</p>
                <div className="generate_window_foot">
                    {status !== null && statusText}
                    <p className="generate_window_foot_btns">
                        <button className="btn_input" onClick={onGenerate}>
                            <AiOutlineReload />
                        </button>
                        <button
                            className="btn_input"
                            onClick={() => window.app.onCopy(value)}
                        >
                            <AiFillCopy />
                        </button>
                    </p>
                </div>
            </div>

            <div className="generate_row">
                <p className="generate_row_text">Длина</p>
                <InputRange value={length} onInput={setLength} />
            </div>

            <div className="generate_row">
                <p className="generate_row_text">Строчные буквы (a-z)</p>
                <BtnApple value={lower} onInput={setLower} />
            </div>
            <div className="generate_row">
                <p className="generate_row_text">Заглавные буквы (A-Z)</p>
                <BtnApple value={upper} onInput={setUpper} />
            </div>

            <div className="generate_row">
                <p className="generate_row_text">Цифры (0-9)</p>
                <BtnApple value={number} onInput={setNumber} />
            </div>

            <div className="generate_row">
                <p className="generate_row_text">Симфолы (@!$%&*)</p>
                <BtnApple value={symbol} onInput={setSymbol} />
            </div>

            <div className="generate_row generate_btns">
                <button className="btn btn_default" onClick={onClose}>
                    Закрыть
                </button>
            </div>
        </div>
    );
};

const InputRange = React.memo(function InputRange({
    value,
    onInput = () => {},
}) {
    const onInputRange = (event) => {
        onInput(event.target.value);
    };

    return (
        <p className="input_range">
            <input
                type="range"
                value={value}
                min="6"
                max="60"
                onInput={onInputRange}
            />
            <span className="input_range_value">{value}</span>
        </p>
    );
});

export const BtnApple = React.memo(function BtnApple({
    value = false,
    onInput = () => {},
}) {
    return (
        <button
            type="button"
            className={`btn-apple ${value && "active"}`}
            onClick={() => {
                onInput(!value);
            }}
        >
            <span></span>
        </button>
    );
});

export default App;
