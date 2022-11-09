import React from 'react'
import style from "./style.module.css";

export const Form = React.memo(
    function Form({title,onSubmit, children}) {
        function onHandelSubmit(e){
          e.preventDefault();
          const formData = new FormData(e.target);
          const formProps = Object.fromEntries(formData);
          onSubmit(formProps)
        }
        return (
          <form className={`scroll ${style.form}`} onSubmit={onHandelSubmit}>
                {title && <p className="title">{title}</p>}
                <div className={style.wrapper}>
                    {children}
                </div>
          </form>
        )
      }
)

export const FormRow = React.memo(
    function FormRow({children}) {
        return (
          <div className={style.row}>
                {children}
          </div>
        )
      }
)
