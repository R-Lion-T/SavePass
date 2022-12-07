import React from "react"
import style from "./style.module.css";

const Footer = React.memo(
    function Footer(){
        const [ver,setVer] = React.useState("")
        React.useEffect(()=>{
            window.app.getVersionApp()
                .then(res=>{
                    setVer(res)
                })
        },[])
        return(
            <div className={style.footer}>
                <div className={style.author}>
                    <p>Автор: Роман Тамазян</p>
                </div>
                <div className={style.version}>
                    <p>v{ver}</p>
                </div>
            </div>
        )
    }
)

export default Footer