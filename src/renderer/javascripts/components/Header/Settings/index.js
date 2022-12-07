import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import style from "./style.module.css";

import { ac_logout } from "../../../redux/actions/ac_state";

import { AiFillSecurityScan } from "react-icons/ai";
import { RiLogoutBoxFill } from "react-icons/ri";
import { MdPassword } from 'react-icons/md';
import { FiMenu } from 'react-icons/fi';
import { WinButton } from "../../Buttons";


const Settings = React.memo(function Settings() {
    const dispath = useDispatch();
    const navigate = useNavigate();
    const { auth } = useSelector((state) => state.data);
    const [show, setShow] = React.useState(false);
    const onToggleSettins = () => {
        setShow(!show);
    };
    const onHideSettings = () => {
        setShow(false);
    };
    const onLogout = () => {
        window.app.logout().then((res) => {
            dispath(ac_logout());
            navigate("/");
        });
    };
    const list = [
        {
            id: 1,
            type: "BUTTON",
            onClick: window.app.openGenerate,
            label: "Генератор",
            icon: <MdPassword/>,
            disabled: false,
        },
        {
            id: 2,
            type: "BUTTON",
            onClick: ()=>{
                navigate("/security")
            },
            label: "Сканировать",
            icon: <AiFillSecurityScan/>,
            disabled: !auth || window.location.hash ==="#/security",
        },
        {
            id: 3,
            type: "BUTTON",
            onClick: onLogout,
            label: "Выход",
            icon: <RiLogoutBoxFill />,
            disabled: !auth,
        },
    ];
    const onListenerClick = () => {
        onHideSettings();
    };
    const onMouseLeave = () => {
        if (show) {
            window.addEventListener("click", onListenerClick, { once: true });
        }
    };
    const onMouseEnter = () => {
        if (show) {
            window.removeEventListener("click", onListenerClick);
        }
    };
    return (
        <div
            className={style.settings}
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}
        >
            <WinButton onClick={onToggleSettins} isActive={show}>
                <FiMenu />
            </WinButton>
            
            {show && (
                <ListSetting list={list} onCloseSetting={onHideSettings} />
            )}
        </div>
    );
});

function ListSetting({ list = [], onCloseSetting = () => {} }) {
    return (
        <div className={style.list}>
            {list.map((item) => {
                switch (item.type) {
                    case "SELECT": {
                        return <Select key={item.id} {...item} />;
                    }
                    case "BUTTON": {
                        return (
                            <Button
                                key={item.id}
                                {...item}
                                onCloseSetting={onCloseSetting}
                            />
                        );
                    }
                    default: {
                        return null;
                    }
                }
            })}
        </div>
    );
};

function Select({ id, label, icon }) {
    return <div className={style.row}>{label}</div>;
};

function Button({
    id,
    label,
    icon,
    disabled,
    onClick = () => {},
    onCloseSetting = () => {},
}) {
    const onHndelClick = () => {
        onCloseSetting();
        onClick();
    };
    return (
        <div className={style.row}>
            <button
                className={style.btn}
                onClick={onHndelClick}
                disabled={disabled}
            >
                {icon}
                {label}
            </button>
        </div>
    );
};

export default Settings;
