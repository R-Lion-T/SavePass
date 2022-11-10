import React from 'react'
import style from "./style.module.css";
import { Buttons,Button } from './../../components/Buttons';
import { BsArrowLeft } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
export default function NotFound() {
  const navigate= useNavigate()
  return (
    <div className={style.page}>
        <h1 className={style.text}>
         NotFound
        </h1>
        <Buttons>
            <Button color="secondary" startIcon={<BsArrowLeft/>} onClick={()=>navigate(-1)}>Вернуться назад</Button>
        </Buttons>
    </div>
  )
}
