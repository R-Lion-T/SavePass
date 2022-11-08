import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { isValidUrl } from "../../function";

import { ac_delete_data, ac_update_data } from "../../redux/actions/ac_state";
import { ac_hide_load, ac_show_load } from '../../redux/actions/ac_alert';
import { InputPassword, InputView, Textarea } from './../../components/Input';
import { Button, Buttons } from './../../components/Buttons';

import { AiFillDelete, AiFillSave } from "react-icons/ai";
import { BiLeftArrowAlt } from 'react-icons/bi';


export const Edit = React.memo(function Edit() {
    let { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { list } = useSelector((state) => state.data);
    const [login, setLogin] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [href, setHref] = React.useState("");
    const [comment, setCommetn] = React.useState("");
    React.useEffect(() => {
        if(id){
            const item = list.filter((item) => Number(item.id) === Number(id))[0];
            if (item) {
                setLogin(item.login);
                setTitle(item.title);
                setPassword(item.password);
                setHref(item.href);
                setCommetn(item.comment)
            }
        }
         else {
            // не найден
            window.app.showMessageWindow(
                "Возникла ошибка: карточка для редактирования не найдена.\nПожалуйста попробуйте еще раз или обратитесь к разработчику"
            );
            history.goBack();
        }
    }, [id]);

    const onDelete = () => {
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
                    navigate(-1);
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
            comment,
            lastChange:new Date().getTime(),
        };
        dispatch(ac_show_load())
        window.app.updateDataFile(body).then((res) => {
            if (res) {
                dispatch(ac_update_data(body));
                dispatch(ac_hide_load())
                navigate(-1);
            }
        });
    };

    return (
        <form className="form scroll" onSubmit={onSave}>
            <div className="wrapper">
                <p className="title">Редактирование</p>

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

                <InputPassword password={password} setPassword={setPassword} id={id} />

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

                <Textarea
                    onInput={setCommetn}
                    label="Коментарий"
                    name="commets"
                    required={false}
                    defaultValue={comment}
                />


                <Buttons>
                    <Button color="secondary" startIcon={<BiLeftArrowAlt/>} onClick={()=>{navigate(-1)}}> Отмена </Button>
                    <Button color="danger"  startIcon={<AiFillDelete/>} onClick={onDelete}> Удалить </Button>
                    <Button type="submit" endIcon={<AiFillSave/>}> Сохранить </Button>
                </Buttons>
            </div>

        </form>
    );
});
