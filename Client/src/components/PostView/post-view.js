import { useEffect, useState } from "react";
import "./post-view.css";
import { toast} from 'react-toastify';

let Post_View = (props) => {
  let token =  localStorage.getItem("token");
  const [data,setdata] = useState();
  const [UserData,setUserData] = useState()
  const [ShowBtn,setShowBtn] = useState("more-btn-wrapper-Hide")
  
  
   const id = props.postid

    useEffect(()=>{
      getdata()
    },[id])

    let getdata = () => {
      fetch("/post/GetSingleUserPost",{
        method:"GET",
        headers:{
            Authorizaton:token,
            Id:id
        }
      }).then((resp)=>{
          resp.json().then((data)=>{
            setdata(data)
            setUserData(data.LoggedUserId)
          })
      })
    }
  
    let tagName = "";

     if(data){

      let path = "/Files/" + data.file
      // Creating an Image or Video Tag
      data.type == "image" ? tagName = <img src={path} className="Post_View_Photo_Video"  /> :
      tagName = <video src={path}  className="Post_View_Photo_Video" controls/>;
    }
   
    let ShowMore = () => {
      ShowBtn == "more-btn-wrapper-Hide" ? setShowBtn("more-btn-wrapper") : setShowBtn("more-btn-wrapper-Hide")
    }

    let Delete = () => {
      fetch("/post/deletePost",{
        method:"delete",
        headers:{
          Authorization:token,
          Id:id
        }
      }).then((resp)=>{
        resp.json().then((data)=>{
          setShowBtn("more-btn-wrapper-Hide")
          toast.success(data.message,{
            position: 'bottom-left',
          })
          props.ViewPost()

        })
      })
    }

    return(
            <>
                <div className="Post_View_Inner_Wrapper">
                    <div className="Post_View-Post_Wrapper">
                       { 
                          tagName
                       }
                       <span className="material-symbols-outlined" onClick={()=>{
                        props.ViewPost()
                        setShowBtn("more-btn-wrapper-Hide")
                      
                        }}>close</span>
                    </div>
                </div>
               
            </>
    )
}
export default Post_View