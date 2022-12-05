import React from "react";
import PropTypes from "prop-types";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import {
    AiFillEdit,
    AiFillCopy,
    AiFillPlayCircle,
    AiOutlineLink,
} from "react-icons/ai";
import { BiShow, BiHide, BiCommentDetail } from "react-icons/bi";
import imgError from "./../../../../images/errorImg.ico";

import style from "./style.module.css";

const ListItem = React.memo(function ListItem(props) {
    const {
        id,
        title,
        href,
        login,
        password,
        comment,
        parent,
        binding,
        onCopyText,
        onHref,
    } = props;
    const params = useParams();
    const navigate = useNavigate();

    const [hidePassword, setHidePassword] = React.useState(true);
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
                className={`${style.item} ${
                    params.id == id ? style.active : ""
                }`}
                tabIndex="0"
                id={id}
            >
                <div className={style.row}>
                    <div className={`${style.text} ${style.head}`}>
                        <img
                            className={style.icon}
                            src={icon}
                            onError={(e) => {
                                e.target.src = imgError;
                            }}
                        />
                        <span className={style.title}>{title}</span>
                    </div>
                    <div className={style.btns}>
                        {binding && (
                        <HashLink to={`#${binding}`} className={style.btn} title={`${title} привязан к ${parent}`}>
                            <AiOutlineLink />
                        </HashLink>
                        )}

                        <button
                            className={style.btn}
                            disabled={!comment}
                            title="Комментарий"
                            onClick={() => {
                                navigate("/list/comment/" + id);
                            }}
                        >
                            <BiCommentDetail />
                        </button>

                        <Link
                            to={`/edit/${id}`}
                            draggable="false"
                            className={style.btn}
                            title="Редактировать"
                        >
                            <AiFillEdit />
                        </Link>
                    </div>
                </div>

                <div className={style.row}>
                    <p className={style.text}>Логин: {login}</p>
                    <div className={style.btns}>
                        <button
                            className={style.btn}
                            onClick={onHref(href, login)}
                            disabled={!href?.length}
                            title="Открыть ссылку"
                        >
                            <AiFillPlayCircle />
                        </button>

                        <button
                            className={style.btn}
                            onClick={() =>
                                onCopyText(login, "Логин скопирован")
                            }
                            title="Скопировать логин"
                        >
                            <AiFillCopy />
                        </button>
                    </div>
                </div>

                <div className={style.row}>
                    <p className={style.text}>
                        Пароль:{" "}
                        <span
                            className={hidePassword ? style.hidePassword : ""}
                        >
                            {password}
                        </span>
                    </p>
                    <div className={style.btns}>
                        <button
                            className={style.btn}
                            onMouseDown={onShowpassord}
                            onMouseLeave={onHidepassord}
                            onMouseUp={onHidepassord}
                            title="Показать пароль"
                        >
                            {hidePassword ? <BiShow /> : <BiHide />}
                        </button>
                        <button
                            className={style.btn}
                            onClick={() =>
                                onCopyText(password, "Пароль скопирован")
                            }
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

//  значение по умолчанию
ListItem.defaultProps = {
    parent:null,
    binding: false,
};
//  типизация
ListItem.propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    login: PropTypes.string,
    password: PropTypes.string,
    comment: PropTypes.string,
    parent:PropTypes.string,
    binding: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    onCopyText: PropTypes.func.isRequired,
    onHref: PropTypes.func.isRequired,
};

export default ListItem;
