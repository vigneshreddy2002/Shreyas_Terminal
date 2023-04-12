import { useState, useEffect } from "react";
// import * as TbIcons from "react-icons/tb"
import TextField from "@mui/material/TextField";
// import List from "./List";
import "../styles/Header.css";
import { InputAdornment } from '@mui/material';

import { AiOutlineSearch } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { CiSquareQuestion } from "react-icons/ci";

import logo from "../components/logohp.png";
import {GrNotification} from "react-icons/gr";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
const Header1 = () => {
  let p: any = [];
  let q: any = [];
  {
    SidebarData.map((item) => {
      if (item.title === "Install and Configure") {
        p = item.subNav;
      }
    });
  }
  {
    for (let i = 0; i < SidebarData.length; i++) {
      let temp1 = { name: SidebarData[i].title, path: SidebarData[i].path };
      q.push(temp1);
      if (SidebarData[i].subNav !== null) {
        let sub = SidebarData[i].subNav || [];
        for (let j = 0; j < sub.length; j++) {
          let temp2 = { name: sub[j].title, path: sub[j].path };
          q.push(temp2);
        }
      }
    }
  }
  console.log(p);
  const closeModal = () => {
    let modal = document.getElementById("myModal");

    if (modal != null) {
      modal.style.display = "none";
    }
  };
  const showModal = () => {
    let modal = document.getElementById("myModal");

    if (modal != null) {
      modal.style.display = "block";
    }
  };
  const [recentArr, setrecentArr] = useState<any>([]);

  useEffect(() => {
    if (localStorage.getItem("recents") !== null) {
      let a = JSON.parse(localStorage.getItem("recents") || "{}");
      setrecentArr(a);
    }

    console.log(q);
  }, []);

  const addToRecent = (name: any, path: any) => {
    console.log(name);
    let y = [...recentArr];
    
      let temp = { name, path },
        flag = false;
      for (let i = 0; i < y.length; i++) {
        if (y[i].name === temp.name && y[i].path === temp.path) {
          flag = true;
        }
      }
      if (!flag) {
        y.push(temp);

        localStorage.setItem("recents", JSON.stringify(y));
        setrecentArr(y);
      
    }
  };

  const filterSearch = (e: any) => {
    let input = (document.getElementById("outlined-basic") as any).value;

    input = input.toLowerCase();
    // input=input.toLowerCase();
    let y = document.getElementsByClassName("searchbar") as any;
    let x = document.getElementsByClassName("search_list") as any;

    // console.log(x[0].innerHTML)
    // y[0].style.display="none"

    for (let i = 0; i < x.length; i++) {
      let z = Math.floor(i / 4);

      if (!x[i].innerHTML.toLowerCase().includes(input)) {
        x[i].style.display = "none";

        // y[z].style.display="none"
      } else {
        x[i].style.display = "list-item";

        y[z].style.display = "flex";
      }
    }
    if (e.keyCode === 13) {

let y = [...recentArr];
    
      
        let flag = false;
      for (let i = 0; i < y.length; i++) {
        if (y[i].name.toLowerCase() === input ) {
          flag = true;
        }
      }
      if (!flag){


      if (input !== null) {
        for (let index = 0; index < q.length; index++) {
          let cmp = q[index].name;
          cmp = cmp.toLowerCase();
          if (input === cmp) {
            console.log("first");
            let x = JSON.parse(localStorage.getItem("recents") || "{}");
            x.push({ name: q[index].name, path: q[index].path });
            localStorage.setItem("recents", JSON.stringify(x));

            setrecentArr(x);
          }
        }
      }
    }
     
    }
  };

  return (
    <div className="header">
      <h1 className="logo">
        <img src={logo} width="60px" height="30px"></img>HPE Cray EX Console
      </h1>
      <div className="search">
        <div>
        <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            label="Search "
            placeholder="Search docs,flows,nodes" 
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AiOutlineSearch/>
                </InputAdornment>
                
              ),
              
            }}
            onClick={showModal}
            onKeyUp={filterSearch}
          />
        </div>

        {/* <div className="icon1">
          <IconContext.Provider value={{ className: "top-react-icons" }}>
            <BiIcons.BiSearchAlt />
          </IconContext.Provider>
        </div> */}

        <div id="myModal" className="modal">
          {/* <!-- Modal content --> */}
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <div className="searchbar">
              <div className="sideContent">
                <div className="side ">Recents</div>
                <ul style={{ listStyle: "none" }}>
                  {recentArr.map((e: any) => {
                    return (
                      <li className="search_list" key={e}>
                        <Link to={e.path}>{e.name}</Link>
                      </li>
                    );
                  })}

                  {/* <li className="search_list"><Link to={"/overview"}>Upgrade CSM-Stage-0</Link></li>
                  <li className="search_list"><Link to={"/overview"}>Upgrade CSM-Stage-0</Link></li> 
                  <li className="search_list"><Link to={"/overview"}>Upgrade CSM-Stage-0</Link></li> 
                  <li className="search_list"><Link to={"/overview"}>Upgrade CSM-Stage-0</Link></li> */}
                </ul>
              </div>
            </div>
            <hr></hr>
            <div className="searchbar">
              <div className="sideContent">
                <div className="side ">Install and Configure</div>
                <ul style={{ listStyle: "none" }}>
                  {p.map((e: any) => {
                    return (
                      <li
                        className="search_list"
                        key={e}
                        onClick={() => {
                          addToRecent(e.title, e.path);
                        }}
                      >
                        <Link to={e.path}>{e.title}</Link>
                      </li>
                    );
                  })}
                  {/* <li className="search_list"><Link to={"/overview"}>Install CSM-Stage-0</Link></li>
                  <li className="search_list"><Link to={"/overview"}>Install CSM-Stage-0</Link></li>
                  <li className="search_list"><Link to={"/overview"}>Install CSM-Stage-0</Link></li> 
                  <li className="search_list"><Link to={"/overview"}>Install CSM-Stage-0</Link></li> */}
                </ul>
              </div>
            </div>
            <hr></hr>
            <div className="searchbar">
              <div className="sideContent">
                <div className="side ">Upgrade</div>
                <ul style={{ listStyle: "none" }}>
                  <li className="search_list">
                    <Link to={"/overview"}>NCN CSM-Stage-0</Link>
                  </li>
                  <li className="search_list">
                    <Link to={"/overview"}>NCN CSM-Stage-0</Link>
                  </li>
                  <li className="search_list">
                    <Link to={"/overview"}>NCN CSM-Stage-0</Link>
                  </li>
                  <li className="search_list">
                    <Link to={"/overview"}>NCN CSM-Stage-0</Link>
                  </li>
                </ul>
              </div>
            </div>
            <hr></hr>
            <div className="searchbar">
              <div className="sideContent">
                <div className="side ">
                  <span style={{ lineHeight: "2px" }}>NCN</span>
                </div>
                <ul style={{ listStyle: "none" }}>
                  <li className="search_list">
                    <Link to={"/overview"}>checking CSM-Stage-0</Link>
                  </li>
                  <li className="search_list">
                    <Link to={"/overview"}>checking CSM-Stage-0</Link>
                  </li>
                  <li className="search_list">
                    <Link to={"/overview"}>checking CSM-Stage-0</Link>
                  </li>
                  <li className="search_list">
                    <Link to={"/overview"}>checking CSM-Stage-0</Link>
                  </li>
                </ul>
              </div>
            </div>
            <hr></hr>
          </div>
        </div>
        <CiSquareQuestion fontSize={"xx-large"} bbox={"solid"} />
        <GrNotification fontSize={"x-large"}/>
        <BiUser fontSize={"x-large"}/>
      </div>
    </div>

    /*
        <div className="headerheader">
           
                <span className="logo"><img src={logo} width="60px" height="30px" ></img></span>
                <span><h2>HPE Cray EX Concole</h2></span>
                
                <span className="extra">
                <span className="main">
      
      <div className="search">
        <TextField
          id="outlined-basic"
          variant="outlined"
          fullWidth
          label="Search            "
        />
      </div>
     
    </span>

                </span>
            
        </div>*/
  );
};

export default Header1;