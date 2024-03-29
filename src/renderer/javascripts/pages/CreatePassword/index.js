import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import RowPassword from '../../components/RowPassword';

import { ac_load_data } from "./../../redux/actions/ac_state";
import { InputView } from './../../components/Input/index';

const CreatePassword = React.memo(function CreatePassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [step, setStep] = React.useState(0);
    const [name, setName] = React.useState("");
    const [password, setPassword] = React.useState([]);
    const [password2, setPassword2] = React.useState([]);

    const checked = React.useMemo(() => {
        if (!password.length && !password2.length) {
            return null;
        } else {
            if (password.length === 5 && password2.length === 5) {
                return password.join("") === password2.join("")
            } else {
                return null;
            }
        }
    }, [password, password2]);

    const onNext = () => {
        setStep(step+1);
    };
    const onPrev = () => {
        if(step-1 != -1){
            setStep(step-1);
        }
    };
    const onSave = () => {
        if (checked) {
            window.app.createFile({
                fileName:name,
                password:password.join(""),
            }).then((res) => {
                if (res) {
                    dispatch(ac_load_data(res));
                    navigate("/list");
                } else {
                    navigate("/");
                }
            });
        }
    };


    return (
        <div className="start">
            <div className="start_container">
                {
                    step==0 ?<StepOne  name={name} setName={setName} onNext={onNext}/>:null
                }
                {
                    step==1 ?<StepTwo
                        password={password}
                        setPassword={setPassword}
                        onNext={onNext}
                    />
                    :null
                }
                {step==2 ?
                    <StepTree
                        password={password2}
                        setPassword={setPassword2}
                        checked={checked}
                        onPrev={onPrev}
                        onSave={onSave}
                    />
                    :null
                }
            </div>
        </div>
    );
});
const StepOne = React.memo(
    function StepOne(props){
        const {name, setName, onNext} = props;
        return(
            <>
            <p className="start_title">Создание файла</p>
            <InputView onChange={setName} defaultValue={name} name="name" placeholder="Имя файла"/>
            <div className="start_btns">
                <Link className="btn btn_default" to="/">
                    Отмена
                </Link>
                <button
                    className="btn btn_primary"
                    disabled={!name.length}
                    onClick={onNext}
                    
                >
                    Далее
                </button>
            </div>
            </>
        )
    }
);
const StepTwo = React.memo(function StepTwo(props) {
   const {password, setPassword, onNext } = props;

    return (
        <>
            <p className="start_title">Придумайте код</p>
            <RowPassword password={password} setPassword={setPassword} />
            <div className="start_btns">
                <Link className="btn btn_default" to="/">
                    Отмена
                </Link>
                <button
                    className="btn btn_primary"
                    disabled={password.length != 5}
                    onClick={onNext}
                >
                    Далее
                </button>
            </div>
        </>
    );
});
const StepTree = React.memo(function StepTree({
    password,
    setPassword,
    checked,
    onSave,
    onPrev,
}) {
    return (
        <>
            <p className="start_title">Повторите код</p>
            <RowPassword password={password} setPassword={setPassword} />
            <div className="start_btns">
                <button className="btn btn_default" onClick={onPrev}>
                    Назад
                </button>
                <button
                    className="btn btn_primary"
                    disabled={password.length != 5 || !checked}
                    onClick={onSave}
                >
                    Сохранить
                </button>
            </div>
        </>
    );
});

export default CreatePassword;
