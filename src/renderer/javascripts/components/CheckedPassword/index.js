import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import RowPassord from "./../RowPassord/index";
import { ac_load_data } from "./../../redux/actions/ac_state";

const CheckedPassword = React.memo(function CheckedPassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [password, setPassword] = React.useState([]);
    const onChecked = () => {
        window.app.checketPassword(password.join("")).then((res) => {
            if (res && res.result) {
                dispatch(ac_load_data(res.result));
                window.localStorage.setItem("lastPathFile", res.lastPathFile);
                navigate("/list");
            } else {
                setPassword([]);
            }
        });
    };

    React.useEffect(() => {
        if (password.length == 5) {
            onChecked();
        }
    }, [password]);

    return (
        <div className="start">
            <div className="start_container">
                <p className="start_title">Введите код</p>
                <RowPassord password={password} setPassword={setPassword} />
                <div className="start_btns">
                    <Link className="btn btn_default" to="/">
                        Отмена
                    </Link>
                </div>
            </div>
        </div>
    );
});

export default CheckedPassword;
