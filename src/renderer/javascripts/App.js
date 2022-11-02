import React from "react";
import { List } from "./components/List";
import Header from "./components/Header/index";
import { Add } from "./components/Add/index";
import { Routes, Route } from "react-router";
import { Edit } from "./components/Edit/index";
import Start from "./components/Start";
import CreatePassword from "./components/CreatePassword/index";
import CheckedPassword from "./components/CheckedPassword/index";
import { useNavigate } from "react-router-dom";
import Footer from "./components/Footer/index";
import { useSelector } from 'react-redux';
import { Loading } from "./components/Alert";

export const App = () => {
    const navigate = useNavigate();
    const {auth,list, is_load}= useSelector(state=>state.data)
    console.log(list)
    React.useEffect(() => {
        if(!auth){
            navigate("/")
        }
        window.addEventListener("goOverPage", (event) => {
            navigate(event.detail.page);
        });
        window.addEventListener("openPageCheckedPassword", () => {
            navigate("/checkedPassword");
        });
        window.addEventListener("console.log", (event) => {
            console.log(event.detail)
        });
    }, []);
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Start />} />
                <Route path="/createPassword" element={<CreatePassword />} />
                <Route path="/checkedPassword" element={<CheckedPassword />} />
                <Route path="/list" element={<List />} />
                <Route path="/add" element={<Add />} />
                <Route path="/edit/:id" element={<Edit />} />
            </Routes>
            <Footer />
            {is_load && <Loading/>}
        </>
    );
};
