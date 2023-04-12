import {useEffect, useState} from "react";
import "../styles/tab.css";
import { Link, useLocation,useNavigate } from "react-router-dom";
import { GrFormClose } from "react-icons/gr";
const Tab = () => {
  const location =useLocation();
  const [p, setp] = useState([])
  const navigate = useNavigate();
  // let pathname=p;

  let s1=location.pathname;
  useEffect(() => {
   tabs(s1)
    // if(localStorage.getItem("tabs")!==null){
    
    //     let a = JSON.parse(localStorage.getItem('tabs'));
    //     setp(a);
    // }

    
    //   if(s1 !=="/" && !p.includes(s1)){

    //     let b=[...p]
    //     b.push(s1);
    //     // localStorage.setItem("tabs",JSON.stringify(b));
    //     setp(b)
    //    }
  }, [location])
  
  
function tabs(s1){
  let a=JSON.parse(localStorage.getItem("tabs"));
  if(!a.includes(s1) && s1!=="/"){
    a.push(s1)
    localStorage.setItem("tabs",JSON.stringify(a))
  }
  
    if(a.length!==0){
      setp(a);
  }


} 



  function openCity(evt, cityName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");


    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace("active", "");
    }

    // document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += "active";
  }
  function closeCity(event,name) {
   
  //  let c= event.currentTarget.parentElement
  //  console.log(c)
  //  c.style.display="none";
    let x=JSON.parse(localStorage.getItem("tabs"));

      let index=x.indexOf(name)
      // console.log(index)
      // let newArr=p;
      if (index !== -1) {
        x.splice(index, 1);
      
        localStorage.setItem("tabs",JSON.stringify(x))
        let y=JSON.parse(localStorage.getItem("tabs"))
        if(y.length===0){
          
          
            setp(y)
            navigate("/")
  
            
        }
        else{
        let w=y[y.length-1]
        
          
          setp(y)
          navigate(w)

        
      }
      }
  

  }
  return (
    <>
      <div className="tab">
        { p.map((e,index)=>{
          return <button
          className="tablinks"
          key={index}
          
        >
          <Link
            
            to={e}
            onClick={(event) => {
              openCity(event, e);
            }}
            style={{paddingRight:"0.5em"}}
          >
            {(e.slice(e.lastIndexOf("/") , e.length)).substring(1)}
        
          </Link>
          <GrFormClose
              onClick={(event) => {
                closeCity(event,e);
              }} 
            ></GrFormClose>
        </button>
        })}
        {/* <button
          className="tablinks"
          onClick={(event) => {
            openCity(event, "Analytics");
          }}
        >
          <Link
            className="tablinks"
            to={"/analytics"}
            onClick={(event) => {
              openCity(event, "Analytics");
            }}
          >
            Analytics{" "}
            <GrFormClose
              onClick={(event) => {
                closeCity(event);
              }}
            ></GrFormClose>
          </Link>
        </button>
        <button
          className="tablinks"
          onClick={(event) => {
            openCity(event, "About");
          }}
        >
          <Link
            className="tablinks"
            to={"/about"}
            onClick={(event) => {
              openCity(event, "About");
            }}
          >
            About{" "}
            <GrFormClose
              onClick={(event) => {
                closeCity(event);
              }}
            ></GrFormClose>
          </Link>
        </button>
        <button
          className="tablinks"
          onClick={(event) => {
            openCity(event, "Users");
          }}
        >
          <Link
            className="tablinks"
            to={"/overview/users"}
            onClick={(event) => {
              openCity(event, "Users");
            }}
          >
            Users{" "}
            <GrFormClose
              onClick={(event) => {
                closeCity(event);
              }}
            ></GrFormClose>
          </Link>
        </button> */}
      </div>


    </>
  );
};

export default Tab;
