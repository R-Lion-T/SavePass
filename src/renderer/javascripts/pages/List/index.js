import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "./style.scss";

import { GrAdd } from "react-icons/gr";
import { BsSortAlphaDown, BsSortAlphaUp } from "react-icons/bs";
import { dis_add_alert } from "../../redux/reducer/alert";

import { Alert } from "../../components/Alert";
import Search from "./Search";
import ListItem from "./ListItem";
import { AiOutlineReload } from 'react-icons/ai';
import { IconButton } from "../../components/Buttons";
import { isMatch,sortAscending } from "../../function";

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

export const List = React.memo(function List() {
    const { list } = useSelector((state) => state.data);
    const [search, setSearch] = React.useState("");
    const [sort, setSort] = React.useState(0);
    React.useEffect(()=>{
        const s = window.localStorage.getItem("sort");
        if(s) setSort(Number(s))
    },[]);
    const dispatch = useDispatch();

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
    const onToggleSort = ()=>{
        const count = (sort + 1 <= 2)? sort+1 : 0;
        window.localStorage.setItem("sort", count);
        setSort(count);
    };
    // поиск
    const searchData = React.useMemo(() => {
        const key = search.toLowerCase().replace(/\s/g, "");
        const cyrillic = /[а-я]/i.test(key) ? "ru" : "en";
        const key2 = key
            .split("")
            .map((s) => simbol[cyrillic]?.[s] || s)
            .join("");

        return list.filter((item) => {
            const title = item.title.toLowerCase().replace(/\s/g, "");
            return isMatch(title, key) || isMatch(title, key2);
        });
    }, [search, list]);
    // сортировка
    const sortData = React.useMemo(()=>{
        const array = [...searchData];
        if(sort) {
            array.sort(sortAscending)
            if(sort==2) {
                array.reverse();
            }
        }
        return array
    },[sort, searchData]);
    // иконка для сортировки текущей
    let sortIcon = <AiOutlineReload/>;
    let sortTitle = "Сброс сортировки";
    switch(sort){
        case 0:{
            sortIcon = <BsSortAlphaDown/>;
            sortTitle = "Cортировать по возростанию";
            break
        }
        case 1:{
            sortIcon = <BsSortAlphaUp/>;
            sortTitle = "Cортировать по убыванию";
            break
        }
    }
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
                <IconButton color="secondary" className="sort" onClick={onToggleSort} title={sortTitle}>
                    {sortIcon}
                </IconButton>
            </div>
            <div className="list scroll">
                {sortData.map((item) => {
                    let {binding} = item;
                    let props = {
                        ...item
                    }
                    if(binding){
                        let parent = list.filter(el=>el.id==binding)[0];
                        if(parent){
                            props = {
                                ...item,
                                parent:parent.title,
                                login:parent.login,
                                password:parent.password,
                            }
                        }
                    }
                    return (
                        <ListItem
                        key={item.id}
                        {...props}
                        onCopyText={onCopyText}
                        onHref={onHref}
                    />
                    )
                })}
            </div>
            <Outlet context={list} />
            <Alert />
        </>
    );
});
