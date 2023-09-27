import "./comment.css";
import {useEffect, useState} from "react"
import All_Comments from "./all-comments"



let Comment = (props) => {

    const [Avatar,setAvatar] = useState()
    const token = localStorage.getItem("token");
    const [sendstyle,setstyle] = useState("material-symbols-outlined")
    const [comVal,setComVal] = useState() ;
    const [comments,setComments] = useState([])


    useEffect(()=>{
      getUserdata()
    },[])


    let getUserdata = () => {
        fetch("/user/LoggedUser", {
            method: "GET",
            headers: {
                Authorization: token,
            },
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error("Failed to fetch user data");
            }
            return resp.json();
        })
        .then((data) => {
            setAvatar(data.profile.dp);
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        });
    }

    let ComHandler = (e) => {
        setComVal(e.target.value)     
    }


    useEffect(()=>{
        comVal ? setstyle("material-symbols-sharp") : setstyle("material-symbols-outlined")
    },[comVal])



    let SendComment = () => {
        if (comVal) {
            const data = { input: comVal };
            fetch("/reaction/AddPostComment", {
                method: "POST",
                headers: {
                    Authorization: token,
                    postId: props.postId,
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error("Failed to send comment");
                }
                return resp.json();
            })
            .then((data) => {
                setComVal("");
                GetPostComment();
            })
            .catch((error) => {
                console.error("Error sending comment:", error);
            })
        } else {
            console.log(false);
        }
    }

    useEffect(()=>{
        GetPostComment()
    },[])

let GetPostComment = () => {
    fetch("/reaction/GetPostComment", {
        method: "get",
        headers: {
            Authorization: token,
            postId: props.postId,
        },
    })
    .then((resp) => {
        if (!resp.ok) {
            throw new Error(`Error: ${resp.status} - ${resp.statusText}`);
        }
        return resp.json();
    })
    .then((data) => {
        console.log(data);
        setComments(data.comments);
    })
    .catch((error) => {
        console.error("Fetch error:", error);
    });
}


    let filterComments = comments.filter((com)=>{
        return com.postId == props.postId
    })


    return(
            <>
                <form className="logged-user-comment">
                    <img src={`/Files/${Avatar}`} title="profile" />
                    <input type="text" name="Input" value={comVal} placeholder="Write a public comment" onChange={ComHandler} />  
                    <span className={sendstyle} title="Enter" onClick={SendComment} >send</span>                       
                </form>

                {
                    filterComments.map((item,index)=>{
                        return(
                            <All_Comments
                            key={index} 
                            item={item}
                            Avatar={item.userData.profile.dp}
                            />
                        )
                    })
                }            
            
            </>
    )
}

export default Comment