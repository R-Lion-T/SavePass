import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "./style.scss";

import { GrAdd } from "react-icons/gr";

import { dis_add_alert } from "../../redux/reducer/alert";

import { Alert } from "../../components/Alert";
import Search from "./Search";
import ListItem from "./ListItem";

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
    let assecc = 0,
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
            .map((s) => simbol[cyrillic]?.[s] || s)
            .join("");

        return list.filter((item) => {
            const title = item.title.toLowerCase().replace(/\s/g, "");
            return checked(title, key) || checked(title, key2);
        });
    }, [search, list]);

    const onCopyText = (text, alertText) => {
        if (window.app.onCopy(text)) {
            dispatch(
                dis_add_alert({
                    id: new Date().getTime(),
                    type: "info",
                    text: alertText,
                })
            );
        }
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
                    className={`btn btn_primary btn-icon mobile-hide-text${
                        list.length ? "" : "animation_scale"
                    }`}
                    draggable="false"
                >
                    <span className="btn-text">Добавить</span>
                    <GrAdd />
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
            <Outlet context={list} />
            <Alert />
        </>
    );
});
