import React from "react";
import { AiFillCopy, AiOutlineReload } from "react-icons/ai";
import { BsFillShieldSlashFill, BsShieldFillCheck } from "react-icons/bs";
import "./style.scss";
function App() {
    const [isInput, setIsInput] = React.useState(false);
    const [length, setLength] = React.useState(10);
    const [number, setNumber] = React.useState(true);
    const [symbol, setSymbol] = React.useState(true);
    const [lower, setLower] = React.useState(true);
    const [upper, setUpper] = React.useState(true);
    const [update, setUpdate] = React.useState(true);
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
            setNumber(local_number === "true");
        }
        if (local_symbol) {
            setSymbol(local_symbol === "true");
        }
        if (local_upper) {
            setUpper(local_upper === "true");
        }
        if (local_lower) {
            setLower(local_lower === "true");
        }

        function generateSetSettings(event){
            setIsInput(event.detail?.isInput)
        }
        window.addEventListener("generateSetSettings",generateSetSettings)
        return()=>{
            window.removeEventListener("generateSetSettings",generateSetSettings)
        }
    }, []);

    const hendelonLength = (val)=>{
        if(length != val){
            setLength(val)
        }
    }

    const onSaveParapms = ()=>{
        window.localStorage.setItem("generate-password-length", length);
        window.localStorage.setItem("generate-password-number", number);
        window.localStorage.setItem("generate-password-symbol", symbol);
        window.localStorage.setItem("generate-password-upper", upper);
        window.localStorage.setItem("generate-password-lower", lower);
    }

    const onClose =()=>{
        window.app.closeGenerate();
    };

    

    const params = React.useMemo(function(){
        // можно ли переключать кнопки
        const isToggle =  !Boolean( 1 < [upper, lower, symbol, number].filter(boll => boll).length);

        const value = window.password.getRandomPassword({
            length,
            lower,
            upper,
            number,
            symbol,
        });

        let getStatus = window.password.passwordCheck(value);

        return{
            isToggle,
            getStatus,
            value
        }

    },[upper, lower, symbol, number, length, update]);

    let statusText = "";

    switch (params.getStatus) {
        case 0: {
            statusText = (
                <p className="generate_window_foot_text color-warning">
                    <BsFillShieldSlashFill />
                    Этот пароль входит топ 200 список самых распространенных у
                    пользователей
                </p>
            );
            break;
        }
        case 1: {
            statusText = (
                <p className="generate_window_foot_text color-warning">
                    <BsFillShieldSlashFill />
                     Ненадёжный пароль
                </p>
            );
            break;
        }
        case 2: {
            statusText = (
                <p className="generate_window_foot_text color-average">
                    <BsShieldFillCheck />
                    Не очень надёжный пароль
                </p>
            );
            break;
        }
        case 3: {
            statusText = (
                <p className="generate_window_foot_text color-normal">
                    <BsShieldFillCheck />
                    Надёжный пароль
                </p>
            );
            break;
        }
        case 4: {
            statusText = (
                <p className="generate_window_foot_text color-high">
                    <BsShieldFillCheck />
                    Хороший пароль
                </p>
            );
            break;
        }
        default: {
            break;
        }
    }

    const onSubmit=()=>{
        window.password.submitPasswordMainProccess({
            password:params.value
        })
        .then(()=>{
            onSaveParapms()
            onClose()
        })
        .catch(err=>{
            console.log("Пароль не был отправлен: ",err)
        })

    }

    return (
        <div className="generate">
            <div className="generate_window">
                <p className="generate_window_text">{params.value}</p>
                <div className="generate_window_foot">
                    {params.getStatus && statusText}
                    <p className="generate_window_foot_btns">
                        <button className="btn_input" onClick={()=>setUpdate(!update)} title="Обновить">
                            <AiOutlineReload />
                        </button>
                        <button
                            title="Скопировать"
                            className="btn_input"
                            onClick={() => window.app.onCopy(params.value)}
                        >
                            <AiFillCopy />
                        </button>
                    </p>
                </div>
            </div>

            <div className="generate_row">
                <p className="generate_row_text">Длина</p>
                <InputRange defaultValue={length} onInput={hendelonLength} />
            </div>

            <div className="generate_row">
                <p className="generate_row_text">Строчные буквы (a-z)</p>
                <BtnApple value={lower} onInput={setLower} disabled={params.isToggle}/>
            </div>
            <div className="generate_row">
                <p className="generate_row_text">Заглавные буквы (A-Z)</p>
                <BtnApple value={upper} onInput={setUpper} disabled={params.isToggle}/>
            </div>

            <div className="generate_row">
                <p className="generate_row_text">Цифры (0-9)</p>
                <BtnApple value={number} onInput={setNumber} disabled={params.isToggle}/>
            </div>

            <div className="generate_row">
                <p className="generate_row_text">Симфолы (@!$%&*)</p>
                <BtnApple value={symbol} onInput={setSymbol} disabled={params.isToggle}/>
            </div>

            <div className="generate_row generate_btns">
                <button className="btn btn_default" onClick={onClose}>
                    Закрыть
                </button>
                {
                    isInput?
                    <button className="btn btn_primary" onClick={onSubmit}>
                        Вставить
                    </button>
                    : null
                }
            </div>
        </div>
    );
};

const InputRange = React.memo(function InputRange({
    onInput = () => {},
    defaultValue=10
}) {

    const [value, setValue] = React.useState(defaultValue);

    React.useEffect(()=>{
        if(defaultValue!=value){
            setValue(defaultValue)
        }
    },[defaultValue])

    return (
        <p className="input_range">
            <input
                type="range"
                min="6"
                max="60"
                value={value}
                onChange={(e)=>setValue(e.target.value)}
                onMouseUp={(e)=>onInput(e.target.value)}
                onKeyUp={e=> onInput(e.target.value)}
            />
            <span className="input_range_value">{value}</span>
        </p>
    );
});

export const BtnApple = React.memo(function BtnApple({
    value = false,
    onInput = () => {},
    disabled = false
}) {
  
    return (
        <button
            type="button"
            className={`btn-apple ${value && "active"}`}
            onClick={() => {
                if(disabled ){
                    if(!value){
                        onInput(!value);
                    }
                }else{
                    onInput(!value);
                }
            }}
        >
            <span></span>
        </button>
    );
});

export default App;
