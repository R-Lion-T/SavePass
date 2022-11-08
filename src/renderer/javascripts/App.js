import React from "react";
import { useSelector } from 'react-redux';
import { Routes, Route } from "react-router";
import { useNavigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Start from "./pages/Start";
import { List } from "./pages/List";
import { Edit } from "./pages/Edit";
import { Add } from './pages/Add';
import CreatePassword from "./pages/CreatePassword";
import CheckedPassword from "./pages/CheckedPassword";
import { Loading } from "./components/Alert";
import Security from './pages/Security';
import Comment from './pages/List/Comment';


export const App = () => {
    const navigate = useNavigate();
    const {auth, is_load}= useSelector(state=>state.data)

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
            <div className="content">
                <Routes>
                    <Route path="/" element={<Start />} />
                    <Route path="/createPassword" element={<CreatePassword />} />
                    <Route path="/checkedPassword" element={<CheckedPassword />} />
                    <Route path="/security" element={<Security />} />
                    <Route path="/list" element={<List />} >
                        <Route path="comment/:id" element={<Comment />} />
                    </Route>
                    <Route path="/add" element={<Add />} />
                    <Route path="/edit/:id" element={<Edit />} />
                </Routes>
            </div>
            <Footer />
            {is_load && <Loading/>}
        </>
    );
};
