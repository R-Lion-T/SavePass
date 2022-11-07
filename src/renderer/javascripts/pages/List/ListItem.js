import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { AiFillEdit, AiFillCopy, AiFillPlayCircle } from "react-icons/ai";
import { BiShow, BiHide, BiCommentDetail } from "react-icons/bi";
import imgError from "./../../../images/errorImg.ico";
const ListItem = React.memo(function ListItem({
    id,
    title,
    href,
    login,
    password,
    comment,
    onCopyText,
    onHref,
}) {
    const params = useParams();
    const [hidePassword, setHidePassword] = React.useState(true);
    const navigate = useNavigate();
    const onShowpassord = () => {
        setHidePassword(false);
    };
    const onHidepassord = () => {
        if (!hidePassword) {
            setHidePassword(true);
        }
    };
    const icon = React.useMemo(() => {
        if (href && href.length) {
            try {
                return new URL(href).origin + "/favicon.ico";
            } catch (e) {
                return "";
            }
        } else {
            return "";
        }
    }, [href]);

    return (
        <>
            <div
                className={`list_item ${params.id == id ? "active" : ""}`}
                tabIndex="0"
            >
                <div className="list_item_row">
                    <div className="list_item_text list_item_head">
                        <img
                            className="list_item_icon"
                            src={icon}
                            onError={(e) => {
                                e.target.src = imgError;
                            }}
                        />
                        <span className="list_item_title">{title}</span>
                    </div>
                    <div className="list_item_btns">
                        <button
                            className="list_item_btns_item"
                            disabled={!comment}
                            title="Комментарий"
                            onClick={()=>{navigate("/list/comment/"+id)}}
                        >
                            <BiCommentDetail />
                        </button>

                        <Link
                            to={`/edit/${id}`}
                            draggable="false"
                            className="list_item_btns_item"
                            title="Редактировать"
                        >
                            <AiFillEdit />
                        </Link>
                    </div>
                </div>

                <div className="list_item_row">
                    <p className="list_item_text">Логин: {login}</p>
                    <div className="list_item_btns">
                        <button
                            className="list_item_btns_item"
                            onClick={onHref(href, login)}
                            disabled={!href?.length}
                            title="Открыть ссылку"
                        >
                            <AiFillPlayCircle />
                        </button>

                        <button
                            className="list_item_btns_item"
                            onClick={()=>onCopyText(login, "Логин скопирован")}
                            title="Скопировать логин"
                        >
                            <AiFillCopy />
                        </button>
                    </div>
                </div>

                <div className="list_item_row">
                    <p className="list_item_text">
                        Пароль:{" "}
                        <span className={hidePassword ? "hide-password" : ""}>
                            {password}
                        </span>
                    </p>
                    <div className="list_item_btns">
                        <button
                            className="list_item_btns_item"
                            onMouseDown={onShowpassord}
                            onMouseLeave={onHidepassord}
                            onMouseUp={onHidepassord}
                            title="Показать пароль"
                        >
                            {hidePassword ? <BiShow /> : <BiHide />}
                        </button>
                        <button
                            className="list_item_btns_item"
                            onClick={()=>onCopyText(password, "Пароль скопирован")}
                            title="Скопировать пароль"
                        >
                            <AiFillCopy />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
});

export default ListItem;
