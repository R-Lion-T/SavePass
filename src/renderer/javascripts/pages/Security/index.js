import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { flushSync } from "react-dom";

import { useSelector, useDispatch } from "react-redux";
import { ac_hide_load, ac_show_load } from "./../../redux/actions/ac_alert";


import { Button } from "../../components/Buttons";

import { BsArrowLeft, BsShieldFillCheck } from "react-icons/bs";
import { BiError } from "react-icons/bi";
import { AiFillEdit,AiFillSecurityScan } from 'react-icons/ai';
import "./style.scss";

const Security = React.memo(function Security() {
    const navigate = useNavigate();
    const [result, setResult] = React.useState([]);

    const goBack = ()=>{
        navigate(-1)
    }
    return (
        <>
            <Button color="secondary" startIcon={<BsArrowLeft />} onClick={goBack}>
                назад
            </Button>
            {result.length ? (
                <SecurityResult result={result} />
            ) : (
                <SecurityWelcome result={result} setResult={setResult} goBack={goBack} />
            )}
        </>
    );
});

const SecurityWelcome = React.memo(function SecurityWelcome({
    result,
    setResult = () => {},
    goBack =()=>{}
}) {
    const { list } = useSelector((state) => state.data);
    const dispatch = useDispatch();
    const onChecked = () => {

        flushSync(()=>{
            dispatch(ac_show_load());
        })

        const array = [];

        list.forEach((item) => {
            // если есть привязка не проверять запись
            if(item.binding) return
            const errors = [];
            // Проверка сложности пароля
            const level = window.password.passwordCheck(item.password);
            if(level <= 1){
                errors.push({
                    type: "error",
                    message: "Ненадёжный пароль",
                })
            }
            else if(level == 2){
                errors.push({
                    type: "warning",
                    message: "Слабый пароль",
                })
            }
            // Проверка есть ли одинаковые пароли
            if (window.password.isUnique({password: item.password, list, id: item.id})) {
                errors.push({
                    type: "error",
                    message: "Пароль встречается в других записях",
                });
            }
            if(errors.length) {
                array.push({
                    ...item,
                    errors
                })
            }
        });

        if(array.length){
            setResult(array);
        }else{
            setResult(false);
        }
        flushSync(()=>{
            dispatch(ac_hide_load());
        })
    };
    return (
        <>
            <div className="security_welcome">
                <p className="security_title title">Сканирование</p>
                <p className="security_desc">
                    Проверьте ваши записи на безопасность
                </p>
                {
                    result?
                    <p className="btns security_btns">
                        <Button endIcon={<AiFillSecurityScan/>} onClick={onChecked}>Проверить</Button>
                    </p>
                    :
                        <>
                        <p className="security_access">
                            <BsShieldFillCheck/>
                            Все записи хорошо защищены
                        </p>
                        <p className="btns security_btns">
                            <Button startIcon={<BsArrowLeft />} onClick={goBack}>Выход</Button>
                        </p>
                    </>
                }
            </div>
        </>
    );
});

const SecurityResult = React.memo(function SecurityResult({ result }) {
    let e = 0;
    let w = 0;
    for(let item of result){
        for(let errors of item.errors){
            if(errors.type=="warning"){
                w++
            }
            else if(errors.type=="error"){
                e++
            }
        }
    }
    return (
        <div className="security">
            <p className="title security_title">Результат сканирование</p>
            <div className="security_list scroll">
                <div className="security_result">
                    <p className="security_result_item ">
                    <b>Итого:</b>
                    </p>
                    <p className="security_result_item message_error" title="Проблемы">
                        <BiError />  {e}
                    </p>
                    <p className="security_result_item message_warning" title="Предупреждение">
                        <BiError />  {w}
                    </p>
                </div>
                {result.map((item) => {
                    return (
                        <div className="security_list_item" key={item.id}>
                            <p className="security_list_item_title">
                                {item.title}
                            </p>
                            <div className="security_list_item_errors">
                                {item.errors.map((err, ind) => {
                                    return (
                                        <div key={`${item.id}_${ind}`} className={`security_list_item_error message_${err.type}`}>
                                            <BiError/> {err.message}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="btns security_list_item_btns">
                                <Link to={`/edit/${item.id}`}> <AiFillEdit/> Исправить</Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

export default Security;
