import React from "react";
import { AiFillInfoCircle, AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";

export const Alert = React.memo(function Alert() {
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


export const Loading = React.memo(
    function Loading(){
        return (
            <div className="loading">
                <AiOutlineLoading3Quarters/>
            </div>
        )
    }
)

