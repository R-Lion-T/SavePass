import React from "react";
import { AiFillInfoCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
const Alert = React.memo(function Alert() {
    const ALERT = useSelector((state) => state.alert);
    return (
        <div className="alerts">
            {ALERT.map((item) => {
                if (item.type === "info") {
                    return <AlertInfo key={item.id} {...item} />;
                }
            })}
        </div>
    );
});
const AlertInfo = React.memo(function AlertInfo({ text }) {
    return (
        <div className="alert alert-info">
            <div className="alert-row">
                <AiFillInfoCircle size="1.5em" className="alert-icon" />
                {text}
            </div>
        </div>
    );
});

export default Alert;
