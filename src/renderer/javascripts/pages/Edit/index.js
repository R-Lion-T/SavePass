import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { isValidUrl } from "../../function";

import { ac_delete_data, ac_update_data } from "../../redux/actions/ac_state";
import { ac_hide_load, ac_show_load } from "../../redux/actions/ac_alert";
import { InputPassword, InputView, Textarea ,Select} from "./../../components/Input";
import { Button, Buttons } from "./../../components/Buttons";

import { AiFillDelete, AiFillSave } from "react-icons/ai";
import { BiLeftArrowAlt } from "react-icons/bi";
import { Form, FormRow } from "./../../components/Form/index";

export const Edit = React.memo(function Edit() {
    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { list } = useSelector((state) => state.data);
    const [card, setCard] = React.useState(null);
    const [isBinding, setIsBinding] = React.useState(0);
    React.useEffect(() => {
        if (id) {
            const item = list.filter(
                (item) => Number(item.id) === Number(id)
            )[0];
            if (item) {
                setCard(item);
                setIsBinding(item?.binding?item?.binding:0)
            }
        } else {
            // не найден
            window.app.showMessageWindow(
                "Возникла ошибка: карточка для редактирования не найдена.\nПожалуйста попробуйте еще раз или обратитесь к разработчику"
            );
            history.goBack();
        }
    }, [id]);

    const onDelete = () => {
        dispatch(ac_show_load());
        window.app
            .deleteDataFile({
                id: card.id,
                title: card.title,
            })
            .then((res) => {
                if (res) {
                    dispatch(ac_delete_data(card.id));
                    navigate(-1);
                }
            })
            .finally(() => {
                dispatch(ac_hide_load());
            });
    };
    const handelSubmit = (data) => {
        const body = {
            id: id,
            ...data,
            binding:(data.binding=="0")?"":data.binding,
            href: isValidUrl(data.href),
            lastChange: new Date().getTime(),
        };
        if(body.binding){
            body["login"] = "";
            body["password"] = "";
        }

        dispatch(ac_show_load());
    
        window.app.updateDataFile(body).then((res) => {
            if (res) {
                dispatch(ac_update_data(body));
                dispatch(ac_hide_load());
                navigate(-1);
            }
        });
    };

    const isDisabled = React.useMemo(() => {
        return !Boolean(card);
    }, [card]);

    return (
        <Form title="Редактирование" onSubmit={handelSubmit}>
            <FormRow>
                <InputView
                    label="Название"
                    name="title"
                    defaultValue={card?.title}
                    placeholder="Мой сайт"
                    required
                />
            </FormRow>

            <FormRow>
                <Select
                    ignoreId={id}
                    label="Привязка"
                    name="binding"
                    defaultValue={isBinding}
                    placeholder="Выберите запись"
                    list={list}
                    onInput={setIsBinding}
                />
            </FormRow>

            {!isBinding ?  (
                <>
                    <FormRow>
                        <InputView
                            label="Логин"
                            name="login"
                            defaultValue={card?.login}
                            placeholder="login@mail.ru"
                            required
                        />
                    </FormRow>
                    <FormRow>
                        <InputPassword
                            id={id}
                            label="Пароль"
                            name="password"
                            defaultValue={card?.password}
                            placeholder="********"
                            required
                        />
                    </FormRow>
                </>
            ):null}

            <FormRow>
                <InputView
                    label="Ссылка"
                    type="url"
                    name="href"
                    defaultValue={card?.href}
                    placeholder="https://site.ru/"
                />
            </FormRow>

            <FormRow>
                <Textarea
                    label="Коментарий"
                    name="comment"
                    defaultValue={card?.comment}
                />
            </FormRow>

            <FormRow>
                <Buttons>
                    <Button
                        color="secondary"
                        startIcon={<BiLeftArrowAlt />}
                        onClick={() => {
                            navigate(-1);
                        }}
                    >
                        Отмена
                    </Button>
                    <Button
                        color="danger"
                        startIcon={<AiFillDelete />}
                        onClick={onDelete}
                        disabled={isDisabled}
                    >
                        Удалить
                    </Button>
                    <Button
                        type="submit"
                        endIcon={<AiFillSave />}
                        disabled={isDisabled}
                    >
                        Сохранить
                    </Button>
                </Buttons>
            </FormRow>
        </Form>
    );
});
