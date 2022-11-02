import React from "react";
import { Link } from "react-router-dom";
import { BiShow, BiHide } from "react-icons/bi";
import { isValidUrl, passwordCheck } from "../../function";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { uniquePassword } from "./../../function";
import { ac_delete_data, ac_update_data } from "./../../redux/actions/ac_state";
import { ac_hide_load, ac_show_load } from './../../redux/actions/ac_alert';

export const Edit = React.memo(function Edit() {
    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { list } = useSelector((state) => state.data);
    const [isHttps, setIsHttps] = React.useState(false);
    const [unique, setUnique] = React.useState(false);
    const [show, setShow] = React.useState(false);
    const [login, setLogin] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [href, setHref] = React.useState("");
    const [status, setStatus] = React.useState("");
    React.useEffect(() => {
        const item = list.filter((item) => Number(item.id) === Number(id))[0];
        if (item) {
            setLogin(item.login);
            setTitle(item.title);
            setPassword(item.password);
            setHref(item.href);
            setStatus(passwordCheck(item.password));
            setUnique(uniquePassword(item.password, list, id));
            if (item.href.length) setIsHttps(item.href.indexOf("https") == -1);
        } else {
            // не найден
            window.app.showMessageWindow(
                "Возникла ошибка: карточка для редактирования не найдена.\nПожалуйста попробуйте еще раз или обратитесь к разработчику"
            );
            history.goBack();
        }
    }, [id]);
    const onShow = () => {
        setShow(true);
    };
    const onHide = () => {
        if (show) {
            setShow(false);
        }
    };
    const onInputLogin = (event) => {
        setLogin(event.target.value.replace(/\s+/g, ""));
    };
    const onCheckedPassword = (event) => {
        const newPassword = event.target.value.replace(/\s/g, "");
        const newStatus = passwordCheck(newPassword);
        setPassword(newPassword);
        setStatus(newStatus);
    };
    const chekedUniquePassword = () => {
        const result = uniquePassword(password, list, id);
        setUnique(result);
    };
    const onCheckedHref = (event) => {
        const newHref = event.target.value.replace(/\s/g, "");
        setHref(newHref);
    };
    const chekedUrl = () => {
        if (href.length) setIsHttps(href.indexOf("https") == -1);
    };
    const onInputTitle = (event) => {
        setTitle(event.target.value);
    };
    const onCheckedTitle = (event) => {
        const newTitle = event.target.value.replace(/\s+/g, " ").trim();
        setTitle(newTitle);
    };
    const onDelete = (event) => {
        event.preventDefault();
        dispatch(ac_show_load())
        
        window.app.deleteDataFile({
                id,
                title,
            })
            .finally(()=>{
                dispatch(ac_hide_load())
            }).then((res) => {
                if (res) {
                    dispatch(ac_delete_data(id));
                    navigate("/list");
                }
            })
    };
    const onSave = (event) => {
        event.preventDefault();
        const body = {
            id,
            title,
            login,
            href: isValidUrl(href),
            password,
        };
        dispatch(ac_show_load())
        window.app.updateDataFile(body).then((res) => {
            if (res) {
                dispatch(ac_update_data(body));
                dispatch(ac_hide_load())
                navigate("/list");
            }
        });
    };

    return (
        <form className="form scroll" onSubmit={onSave}>
            <p className="form_title">Редактирование</p>
            <div className="form_row input">
                <label>Название*</label>
                <p className="input_item">
                    <input
                        type="text"
                        name="title"
                        required
                        value={title}
                        onInput={onInputTitle}
                        onBlur={onCheckedTitle}
                    />
                </p>
            </div>
            <div className="form_row input">
                <label>Логин*</label>
                <p className="input_item">
                    <input
                        type="text"
                        value={login}
                        onInput={onInputLogin}
                        required
                    />
                </p>
            </div>
            <div className="form_row input">
                <label>Пароль*</label>
                <div className="input_item">
                    <input
                        type={show ? "text" : "password"}
                        name="password"
                        required
                        onInput={onCheckedPassword}
                        onBlur={chekedUniquePassword}
                        onMouseLeave={chekedUniquePassword}
                        value={password}
                    />
                    <p className="btns">
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
                {unique && (
                    <p className="warning">
                        Этот пароль был замечен в других учетых записях это не
                        безопасно! <br /> Ваши данные могут быть под угрозой!
                    </p>
                )}
            </div>

            <div className="form_row input">
                <label>Ссылка</label>
                <p className="input_item">
                    <input
                        type="url"
                        name="href"
                        placeholder="https://site.ru/"
                        onBlur={chekedUrl}
                        onMouseLeave={chekedUrl}
                        value={href}
                        onInput={onCheckedHref}
                    />
                </p>
                {isHttps && (
                    <p className="warning">
                        У этого сайта небезопасное соединение! <br /> Ваши
                        данные могут быть под угрозой!
                    </p>
                )}
            </div>

            <p className="form_btns">
                <Link to="/list" className="btn btn_default" draggable="false">
                    Отмена
                </Link>
                <button className="btn btn_delete" onClick={onDelete}>
                    Удалить
                </button>
                <button className="btn btn_primary">Сохранить</button>
            </p>
        </form>
    );
});
