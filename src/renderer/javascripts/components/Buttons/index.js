import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';

import style from "./btn.module.css";

export const Buttons = React.memo(function Buttons({ children }) {
    return <div className={style.btns}>{children}</div>;
});

export const Button = React.memo(function Button(props) {
    const navigate = useNavigate()
    const {
        children,
        variant,
        color,
        type,
        href,
        disabled,
        startIcon,
        endIcon,
        onClick,
    } = props;

    const onHandelClick = (e) => {
        if(href) {
            e.preventDefault();
            return navigate(href)
        }
        if (type == "button") {
            e.preventDefault();
            onClick();
            return
        }
    };

    return (
        <button
            className={`${style.btn} ${style[`${variant}`]} ${style[color]} `}
            type={type}
            disabled={disabled}
            onClick={onHandelClick}
        >
            {startIcon}
            {children}
            {endIcon}
        </button>
    );
});

export const IconButton = React.memo(function IconButton(props){
    const {variant, color, href, type, children, title, disabled, onClick} = props;
    const navigate = useNavigate()
    const onHandelClick = (e) => {
        if(href) {
            e.preventDefault();
            return navigate(href)
        }
        if (type == "button") {
            e.preventDefault();
            onClick();
            return
        }
    };
    return(
        <button type={type} className={`${style.btn} ${style[variant]} ${style[color]}` } title={title} onClick={onHandelClick} disabled={disabled}>
            {children}
        </button>
    )
})
// параметры по умолчанию
Button.defaultProps = {
    variant: "contained",
    color: "primary",
    type: "button",
    href: false,
    disabled: false,
    startIcon: null,
    endIcon: null,
    onClick: () => {},
};
IconButton.defaultProps={
    variant: "contained",
    color: "primary",
    href: false,
    disabled: false,
    title:"",
    children:null,
    type:"button",
    onClick:()=>{}
}
// типизация
Button.propTypes = {
    children: PropTypes.string,
    variant: PropTypes.oneOf(['text', 'contained','outlined']),
    color: PropTypes.oneOf(['primary', 'secondary','danger']),
    type: PropTypes.oneOf(['button', 'submit','reset']).isRequired,
    href:PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),
    disabled: PropTypes.bool.isRequired,
    startIcon: PropTypes.element,
    endIcon: PropTypes.element,
    onClick: PropTypes.func.isRequired,
};
IconButton.propTypes={
    children: PropTypes.element,
    type: PropTypes.oneOf(['button', 'submit','reset']).isRequired,
    variant: PropTypes.oneOf(['text', 'contained','outlined']),
    color: PropTypes.oneOf(['primary', 'secondary','danger']),
    href:PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),
    disabled: PropTypes.bool.isRequired,
    title:PropTypes.string,
    onClick:PropTypes.func,
}