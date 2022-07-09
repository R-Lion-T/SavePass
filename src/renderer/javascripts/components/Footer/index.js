import React from "react"

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
            <div className="footer">
                <div className="footer_left">
                    <p>Автор: Роман Тамазян</p>
                </div>
                <div className="footer_rigth">
                    <p>v{ver}</p>
                </div>
            </div>
        )
    }
)

export default Footer