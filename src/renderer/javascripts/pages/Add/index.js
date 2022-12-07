import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { isValidUrl } from "../../function";

import { ac_add_data } from "../../redux/actions/ac_state";
import { ac_hide_load, ac_show_load } from "../../redux/actions/ac_alert";
import {
    Select,
    InputPassword,
    InputView,
    Textarea,
} from "./../../components/Input";
import { Buttons, Button } from "./../../components/Buttons";

import { AiFillSave } from "react-icons/ai";
import { BiLeftArrowAlt } from "react-icons/bi";
import { Form, FormRow } from "./../../components/Form";

export const Add = React.memo(function Add() {
    const { list } = useSelector((state) => state.data);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handelSubmit = (data) => {
        const id = new Date().getTime();
        const body = {
            id: id,
            ...data,
            // binding: data.binding=="0"? "": data.binding,
            href: isValidUrl(data.href),
            created: id,
            lastChange: id,
        };
        dispatch(ac_show_load());
        window.app.addDataFile(body).then((res) => {
            if (res) {
                dispatch(ac_add_data(body));
                dispatch(ac_hide_load());
                navigate("/list");
            }
        });
    };
    const [isBinding, setIsBinding] = React.useState(0);
    return (
        <Form title="Создать" onSubmit={handelSubmit}>
            <FormRow>
                <InputView
                    label="Название"
                    name="title"
                    placeholder="Мой сайт"
                    datalist={list}
                    required
                />
            </FormRow>

            {/* <FormRow>
                <Select
                    label="Привязка"
                    name="binding"
                    defaultValue={isBinding}
                    placeholder="Выберите запись"
                    list={list}
                    onInput={setIsBinding}
                />
            </FormRow> */}

            { !isBinding ?
                <>
                    <FormRow>
                        <InputView
                            label="Логин"
                            name="login"
                            placeholder="login@mail.ru"
                            datalist={list}
                            required
                        />
                    </FormRow>

                    <FormRow>
                        <InputPassword
                            name="password"
                            label="Пароль"
                            placeholder="********"
                            required
                        />
                    </FormRow>
                </> : null
            }

            <FormRow>
                <InputView
                    label="Ссылка"
                    type="url"
                    name="href"
                    placeholder="https://site.ru/"
                />
            </FormRow>

            <FormRow>
                <Textarea label="Заметки" name="comment" />
            </FormRow>

            <FormRow>
                <Buttons>
                    <Button
                        startIcon={<BiLeftArrowAlt />}
                        color="secondary"
                        onClick={() => {
                            navigate(-1);
                        }}
                    >
                        Отмена
                    </Button>
                    <Button type="submit" endIcon={<AiFillSave />}>
                        Сохранить
                    </Button>
                </Buttons>
            </FormRow>
        </Form>
    );
});


