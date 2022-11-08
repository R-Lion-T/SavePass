import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {useSelector, useDispatch } from "react-redux";

import { isValidUrl } from "../../function";

import { ac_add_data } from "../../redux/actions/ac_state";
import { ac_hide_load, ac_show_load } from '../../redux/actions/ac_alert';
import {InputPassword, InputView, Textarea} from './../../components/Input';
import { Buttons,Button } from './../../components/Buttons';

import { AiFillSave } from "react-icons/ai";
import { BiLeftArrowAlt } from "react-icons/bi";

export const Add = React.memo(function Add() {
    const {list} = useSelector(state=>state.data);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [password, setPassword] = React.useState("");
    const [login, setLogin] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [href, setHref] = React.useState("");
    const [comment, setCommetn] = React.useState("");

    const onSave = (event) => {
        event.preventDefault();
        const id = new Date().getTime();
        const body = {
            id: id,
            title,
            login,
            href: isValidUrl(href),
            password,
            comment,
            created:id,
            lastChange: id,
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
            <div className="wrapper">
                <InputView
                    classNames="form_row"
                    label="Название"
                    name="title"
                    placeholder="Например: Мой сайт"
                    defaultValue={title}
                    onInput={setTitle}
                    candidate={
                    {
                        array:list,
                    }
                    }
                />

                <InputView
                    classNames="form_row"
                    placeholder="Например: login@mail.ru"
                    label="Логин"
                    name="login"
                    defaultValue={login}
                    onInput={setLogin}
                    candidate={
                    {
                        array:list,
                    }
                    }
                />

                <InputPassword password={password} setPassword={setPassword} placeholder="********" />

                <InputView
                    classNames="form_row"
                    type="url"
                    label="Ссылка"
                    name="href"
                    required={false}
                    defaultValue={href}
                    onInput={setHref}
                    placeholder="Например: https://site.ru/"
                />

                <Textarea
                    onInput={setCommetn}
                    label="Коментарий"
                    name="commets"
                    required={false}
                    defaultValue={comment}
                />

                <Buttons>
                    <Button
                        startIcon={<BiLeftArrowAlt/>}
                        color="secondary"
                        onClick={()=>{navigate(-1)}}>
                        Отмена
                    </Button>
                    <Button
                        type="submit"
                        endIcon={<AiFillSave/>}>
                        Сохранить
                    </Button>
                </Buttons>
            </div>
        </form>
    );
});
