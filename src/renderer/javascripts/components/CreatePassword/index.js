import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ac_load_data } from "./../../redux/actions/ac_state";
import RowPassord from "./../RowPassord/index";

const CreatePassword = React.memo(function CreatePassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [step, setStep] = React.useState(true);
    const [password, setPassword] = React.useState([]);
    const [password2, setPassword2] = React.useState([]);

    const checked = React.useMemo(() => {
        if (!password.length && !password2) {
            return null;
        } else {
            if (password.length === 5 && password2.length === 5) {
                if (password.join("") === password2.join("")) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return null;
            }
        }
    }, [password, password2]);

    const onNext = () => {
        setStep(false);
    };
    const onPrev = () => {
        setStep(true);
    };
    const onSave = () => {
        if (checked) {
            window.app.createFile(password.join("")).then((res) => {
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
                {step ? (
                    <StepOne
                        password={password}
                        setPassword={setPassword}
                        onNext={onNext}
                    />
                ) : (
                    <StepTwo
                        password={password2}
                        setPassword={setPassword2}
                        checked={checked}
                        onPrev={onPrev}
                        onSave={onSave}
                    />
                )}
            </div>
        </div>
    );
});

const StepOne = React.memo(function StepOne({ password, setPassword, onNext }) {
    return (
        <>
            <p className="start_title">Придумайте код</p>
            <RowPassord password={password} setPassword={setPassword} />
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
const StepTwo = React.memo(function StepTwo({
    password,
    setPassword,
    checked,
    onSave,
    onPrev,
}) {
    return (
        <>
            <p className="start_title">Повторите код</p>
            <RowPassord password={password} setPassword={setPassword} />
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
