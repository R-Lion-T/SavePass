import React from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useOutletContext } from "react-router-dom";
import { GrClose } from 'react-icons/gr';
const Comment = React.memo(
    function Comment(){
        const {id}= useParams();
        const data = useOutletContext();
        const navigate = useNavigate();
        const comment = data.filter(item=>item.id==id)[0]?.comment;
        const onClose = (event)=>{
            if(event.target.classList.contains("comment")){
                navigate(-1)
            }
        }
        return (
            <div className="comment" onClick={onClose}>
                <div className="comment_wrapper scroll">
                    <button className="comment_btn" onClick={()=>navigate(-1)}><GrClose/></button>
                    <p className="comment_text">{comment}</p>
                </div>
            </div>
        )
    }
)
export default Comment