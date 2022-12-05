import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { BiHide, BiShow } from "react-icons/bi";
import { BsFillKeyFill } from "react-icons/bs";
import { IoIosArrowDown, IoIosArrowUp, IoIosWarning } from "react-icons/io";

import "./style.scss";
import style from "./input.module.css";

export const InputPassword = (props) => {
    const { label, id, name, defaultValue, placeholder, disabled, onChange } =
        props;

    const inptId = React.useId();
    const refInt = React.useRef();

    const [value, setValue] = React.useState(defaultValue);
    const [show, setShow] = React.useState(false);
    const [status, setStatus] = React.useState("");
    const { list } = useSelector((state) => state.data);
    const [unique, setUnique] = React.useState(false);
    const [isFocus, setIsFocus] = React.useState(false);

    React.useEffect(() => {
        const level = window.password.passwordCheck(value);
        setStatus(level);
        setUnique(window.password.isUnique({ password: value, list, id }));
    }, [id, value, list]);

    React.useEffect(() => {
        function funSetPassword(event) {
            const generate_password = event?.detail?.password;
            if (generate_password) {
                onChange(generate_password);
                setValue(generate_password);
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

    React.useEffect(() => {
        if (defaultValue != value) {
            setValue(defaultValue);
        }
    }, [defaultValue]);

    function onShow() {
        setShow(true);
    }
    function onHide() {
        if (show) {
            setShow(false);
        }
    }

    function showGenerate(event) {
        event.preventDefault();
        window.app.openGenerate(true);
    }

    function onInput(event) {
        const newPassword = event.target.value.replace(/\s/g, "");
        setValue(newPassword);
    }
    function onFocus(e) {
        if (e.target.classList.contains(style.input)) {
            refInt.current.focus();
        }
    }
    function onFocusInput() {
        setIsFocus(true);
    }
    function onHandelChange() {
        onChange(value);
        setIsFocus(false);
    }

    return (
        <>
            {label && (
                <label htmlFor={inptId} className={style.label}>
                    {label}
                </label>
            )}
            <div
                className={`${style.input} ${disabled ? style.disabled : ""} ${
                    isFocus ? style.focus : ""
                }`}
                onClick={onFocus}
            >
                <input
                    id={inptId}
                    ref={refInt}
                    className={style.inputItem}
                    name={name}
                    type={show ? "text" : "password"}
                    value={value}
                    onInput={onInput}
                    required
                    onFocus={onFocusInput}
                    onBlur={onHandelChange}
                    placeholder={placeholder}
                    disabled={disabled}
                />
                <p className={style.btns}>
                    <button
                        type="button"
                        className={style.btn}
                        title="Сгенерировать пароль"
                        onClick={showGenerate}
                    >
                        <BsFillKeyFill />
                    </button>
                    <button
                        type="button"
                        className={style.btn}
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
        </>
    );
};

export const Textarea = React.memo(function Textarea(props) {
    const { label, name, defaultValue, placeholder, disabled, onChange } =
        props;

    const inpId = React.useId();

    function onHandelChange(e) {
        onChange(e.target.value.trim());
    }

    return (
        <>
            {label && (
                <label htmlFor={inpId} className={style.label}>
                    {label}
                </label>
            )}
            <p>
                <textarea
                    className={style.textarea}
                    name={name}
                    id={inpId}
                    spellCheck={false}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    onBlur={onHandelChange}
                    disabled={disabled}
                />
            </p>
        </>
    );
});

export const InputView = React.memo(function InputView(props) {
    const { label, type, name, defaultValue, placeholder } = props;
    const { onChange, required, disabled, datalist, inputProps } = props;

    const refInt = React.useRef();
    const inpId = React.useId();

    const [isFocus, setIsFocus] = React.useState(false);
    const [value, setValue] = React.useState("");

    React.useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    function onHandelChange(e) {
        onChange(e.target.value.trim());
    }
    function onHandelInput(e) {
        const searchType = ["url"];
        const searchName = ["login"];
        const search = [...searchType, ...searchName];

        let regS = " ";

        if (search.includes(type) || search.includes(name)) {
            regS = "";
        }

        setValue(e.target.value.replace(/\s+/g, regS));
    }

    const options = React.useMemo(() => {
        if (datalist?.length) {
            // ищу похожие значения
            let array = datalist.filter((item) => {
                if (item[name] && value.length) {
                    const text = item[name].substr(0, value.length);
                    return (
                        text.toLowerCase() === value.toLowerCase() &&
                        item[name].toLowerCase() != value.toLowerCase()
                    );
                }
                return false;
            });
            // доставю только нужное значение
            array = array.map((item) => item[name]);
            // только уникальные значения
            return Array.from(new Set(array));
        }
        return [];
    }, [datalist, value]);

    return (
        <div
            onFocus={() => {
                setIsFocus(true);
            }}
            onBlur={() => {
                setIsFocus(false);
            }}
        >
            {label && (
                <label htmlFor={inpId} className={style.label}>
                    {label}
                </label>
            )}

            <div style={{ position: "relative" }}>
                <input
                    id={inpId}
                    className={style.input}
                    ref={refInt}
                    type={type}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    onInput={onHandelInput}
                    onBlur={onHandelChange}
                    onFocus={() => setIsFocus(true)}
                    spellCheck={false}
                    {...inputProps}
                />
                {isFocus && <DataList array={options} onChange={setValue} />}
            </div>
        </div>
    );
});

export const InputRadion = React.memo(function InputRadion(props) {
    const { label, name, checked, inputs, onChange } = props;

    return (
        <div>
            {label && <label className={style.label}>{label}</label>}
            <div className={style.row}>
                {inputs.map((item) => {
                    const inpId = React.useId();
                    return (
                        <p key={`label_${inpId}`}>
                            <input
                                className="hidden"
                                id={inpId}
                                name={name}
                                type="radio"
                                defaultChecked={checked == item.value}
                                value={item.value}
                                onChange={() => onChange(item.value)}
                            />
                            <label className={style.radio} htmlFor={inpId}>
                                {item.label}
                            </label>
                        </p>
                    );
                })}
            </div>
        </div>
    );
});

export const Select = React.memo(function Select(props) {
    const {ignoreId, label, list, name, defaultValue, onInput} = props;
    const [value, setValue] = React.useState("0");
    const [text, setText] = React.useState("");
    const [show, setShow] = React.useState(false);
    const inpId = React.useId();

    React.useEffect(() => {
        setValue(defaultValue);
        const item = list.filter(item=>item.id==defaultValue);
        if(item[0]){
            setText(item[0].title)
        }
    }, [defaultValue]);


    const closeOptions = React.useCallback(()=>{
        setShow(false) 
    },[])

    const listenerClick = ()=>{
        window.addEventListener("click",closeOptions)
    }
    const removeListenerClick = ()=>{
        window.removeEventListener("click",closeOptions)
    }

    const onCloseSelect = ()=>{
        setShow(false)
    }

    const onHandelChange = (option)=>{
        setValue(option.id);
        setText(option.title);
        onInput(option.id);
        onCloseSelect();
    }

    const options = React.useMemo(()=>{
        return list.filter(item=>{
            if(item.binding || item.id==ignoreId){
                return false
            }
            return true
        })
    },[list]);

    return (
        <div
            className={style.relative}
            onMouseLeave={listenerClick}
            onMouseEnter={removeListenerClick}
        >
            {label && (
                <label htmlFor={inpId} className={style.label}>
                    {label}
                </label>
            )}
            <div
                className={` ${style.input} ${show ? style.focus : ""}`}
                style={{cursor:"pointer"}}
                onClick={()=>{
                    setShow(!show)
                }}
            >
                <span className={style.inputItem}> {value && text ? text : "Не выбранно"} </span>
                <input
                    className="hidden"
                    type="text"
                    name={name}
                    value={value}
                    onChange={()=>{}}
                />
                <p className={style.btns}>
                    <button
                        type="button"
                        className={style.btn}
                        title="Посмотреть пароль"
                    >
                        {show ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </button>
                </p>
            </div>
            {show && <SelectList array={options} defaultChecked={value} onChange={onHandelChange} /> }
        </div>
    );
});

// Выподашки
const DataList = React.memo(function DataList({ array, onChange }) {
    return (
        <p className={`${style.datalist} scroll`}>
            {array.map((item, ind) => {
                return (
                    <button
                        type="button"
                        className={style.item}
                        value={item}
                        key={ind}
                        onMouseDown={() => {
                            onChange(item);
                        }}
                    >
                        {item}
                    </button>
                );
            })}
        </p>
    );
});

const SelectList = (props)=>{
    const { array, defaultChecked=0, onChange} = props;
    return(
        <p className={`${style.select} scroll`}>
            <button type="button" key={`option_${0}`} className={`${style.option} ${defaultChecked==0? style.checked:""}`} onClick={()=>onChange({id:0,title:"Не выбранно"})}>
               Не выбранно
            </button>
            {array.map(item=>{
                return (
                    <button type="button" key={`option_${item.id}`} className={`${style.option} ${defaultChecked==item.id? style.checked:""}`}   onClick={()=>onChange(item)}>
                        {item.title} <span>{item.login}</span>
                    </button>
                )
            })}
        </p>
    )
}
// значение по умолчанию
InputPassword.defaultProps = {
    label: false,
    onChange: () => {},
    name: "",
    id: false,
    placeholder: "",
    disabled: false,
    defaultValue: "",
};
Textarea.defaultProps = {
    name: "",
    label: false,
    defaultValue: "",
    placeholder: "",
    disabled: false,
    onChange: () => {},
};
InputView.defaultProps = {
    label: false,
    defaultValue: "",
    type: "text",
    name: "",
    placeholder: "",
    inputProps: {},
    disabled: false,
    required: false,
    onChange: () => {},
    datalist: false,
};
Select.defaultProps ={
    ignoreId:false,
    label:"",
    list:[],
    name:"",
    defaultValue:"0",
    onInput:()=>{}
};
// типизация
InputPassword.propTypes = {
    id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.bool,
    ]),
    name: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    disabled: PropTypes.bool,
};
Textarea.propTypes = {
    label: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    name: PropTypes.string.isRequired,
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    placeholder: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
};
InputView.propTypes = {
    label: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    type: PropTypes.oneOf(["text", "url"]),
    name: PropTypes.string.isRequired,
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    placeholder: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    inputProps: PropTypes.exact({
        maxLength: PropTypes.number,
        minLength: PropTypes.number,
    }),
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    datalist: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
};
Select.propTypes ={
    ignoreId:PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
    label: PropTypes.string,
    list:PropTypes.array,
    name:PropTypes.string,
    defaultValue:PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onInput:PropTypes.func
};
