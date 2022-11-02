import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AiFillEdit, AiFillCopy, AiFillPlayCircle } from "react-icons/ai";
import { GrAdd } from "react-icons/gr";
import { BiShow, BiHide } from "react-icons/bi";
import { Link } from "react-router-dom";
import { Alert} from "./../Alert/index";
import { dis_add_alert } from "../../redux/reducer/alert";
import { Search } from "./Search";

const simbol = {
    ru: {
        й: "q",
        ц: "w",
        у: "e",
        к: "r",
        е: "t",
        н: "y",
        г: "u",
        ш: "i",
        щ: "o",
        з: "p",
        ф: "a",
        ы: "s",
        в: "d",
        а: "f",
        п: "g",
        р: "h",
        о: "j",
        л: "k",
        д: "l",
        я: "z",
        ч: "x",
        с: "c",
        м: "v",
        и: "b",
        т: "n",
        ь: "m",
    },
    en: {
        q: "й",
        w: "ц",
        e: "у",
        r: "к",
        t: "е",
        y: "н",
        u: "г",
        i: "ш",
        o: "щ",
        p: "з",
        "[": "х",
        "]": "ъ",
        a: "ф",
        s: "ы",
        d: "в",
        f: "а",
        g: "п",
        h: "р",
        j: "о",
        k: "л",
        l: "д",
        ";": "ж",
        "'": "э",
        z: "я",
        x: "ч",
        c: "с",
        v: "м",
        b: "и",
        n: "т",
        m: "ь",
        ",": "б",
        ".": "ю",
        "/": ".",
    },
};

function checked(title, key) {
    // проверка на совпадение текста
    if (title.includes(key)) return true;

    // проверка количество совадений букв в тексте
    let assecc =0,
    bad = 0;

    for (let i = 0; i < key.length; i++) {
        key[i] == title[i] ? assecc++ : bad++;
    }
    return assecc > bad && bad < 4;
}

export const List = React.memo(function List() {
    const { list } = useSelector((state) => state.data);
    const [search, setSearch] = React.useState("");
    const dispatch = useDispatch();

    const filterData = React.useMemo(() => {
        const key = search.toLowerCase().replace(/\s/g, "");
        const cyrillic = /[а-я]/i.test(key) ? "ru" : "en";
        const key2 = key
            .split("")
            .map(s => simbol[cyrillic]?.[s] || s)
            .join("");

        return list.filter((item) => {
            const title = item.title.toLowerCase().replace(/\s/g, "");
            return checked(title, key) || checked(title, key2);
        });
    }, [search, list]);

    const onCopyText = (text, alertText) => {
        return () => {
            window.app.onCopy(text);
            // dispatch(dis_add_alert());
            dispatch(
                dis_add_alert({
                    id: new Date().getTime(),
                    type: "info",
                    text: alertText,
                })
            );
        };
    };
    const onHref = (href, login) => {
        return () => {
            window.app.openHref(href);
            window.app.onCopy(login);
        };
    };
    return (
        <>
            <div className="panel">
                <Link
                    to="/add"
                    className={`btn btn_primary ${
                        list.length ? "" : "animation_scale"
                    }`}
                    draggable="false"
                >
                    <span className="btn-text">Добавить</span>
                    <span className="btn-icon">
                        <GrAdd />
                    </span>
                </Link>

                <Search value={search} setSearch={setSearch} />
            </div>

            <div className="list scroll">
                {filterData.map((item) => (
                    <ListItem
                        key={item.id}
                        {...item}
                        onCopyText={onCopyText}
                        onHref={onHref}
                    />
                ))}
            </div>
            <Alert />
        </>
    );
});

const ListItem = React.memo(function ListItem({
    id,
    title,
    href,
    login,
    password,
    onCopyText,
    onHref,
}) {
    const [hidePassword, setHidePassword] = React.useState(true);
    const onShowpassord = () => {
        setHidePassword(false);
    };
    const onHidepassord = () => {
        if (!hidePassword) {
            setHidePassword(true);
        }
    };

    return (
        <>
            <div className="list_item ">
                <div className="list_item_row">
                    <div className="list_item_title list_item_text">
                        {title}
                    </div>
                    <div className="list_item_btns">
                        <Link
                            to={`/edit/${id}`}
                            draggable="false"
                            className="list_item_btns_item"
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
                            disabled={!href.length}
                        >
                            <AiFillPlayCircle />
                        </button>

                        <button
                            className="list_item_btns_item"
                            onClick={onCopyText(login, "Логин скопирован")}
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
                        >
                            {hidePassword ? <BiShow /> : <BiHide />}
                        </button>
                        <button
                            className="list_item_btns_item"
                            onClick={onCopyText(password, "Пароль скопирован")}
                        >
                            <AiFillCopy />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
});
