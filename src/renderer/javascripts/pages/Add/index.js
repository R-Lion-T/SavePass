import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { isValidUrl } from "../../function";

import { ac_add_data } from "../../redux/actions/ac_state";
import { ac_hide_load, ac_show_load } from '../../redux/actions/ac_alert';
import {InputPassword, InputView} from './../../components/Input';

export const Add = React.memo(function Add() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [password, setPassword] = React.useState("");
    const [login, setLogin] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [href, setHref] = React.useState("");

    const onSave = (event) => {
        event.preventDefault();
        const body = {
            id: new Date().getTime(),
            title,
            login,
            href: isValidUrl(href),
            password,
        };
        dispatch(ac_show_load())
        window.app.addDataFile(body).then((res) => {
            if (res) {
                dispatch(ac_add_data(body));
                dispatch(ac_hide_load())
                navigate("/list");
            }
        });
    };

    return (
        <form className="form scroll" onSubmit={onSave}>
            <p className="title">Создать</p>

            <InputView
                classNames="form_row"
                label="Название"
                name="title"
                defaultValue={title}
                onInput={setTitle}
            />

            <InputView
                classNames="form_row"
                label="Логин"
                name="login"
                defaultValue={login}
                onInput={setLogin}
            />

            <InputPassword password={password} setPassword={setPassword} />

            <InputView
                classNames="form_row"
                type="url"
                label="Ссылка"
                name="href"
                required={false}
                defaultValue={href}
                onInput={setHref}
                placeholder="https://site.ru/"
            />

            <p className="btns form_btns">
                <Link to="/list" className="btn btn_default" draggable="false">
                    Отмена
                </Link>
                <button className="btn btn_primary">Сохранить</button>
            </p>
        </form>
    );
});
