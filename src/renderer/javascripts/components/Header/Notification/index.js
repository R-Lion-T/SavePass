import React from "react";
import { WinButton } from "../../Buttons";
import { IoMdNotifications, IoMdNotificationsOutline } from 'react-icons/io';

export const Notification = React.memo(function Notification() {
    React.useEffect(()=>{

    },[]);
    return (
        <WinButton title="Уведомление">
            <IoMdNotificationsOutline />
        </WinButton>
    );
});
