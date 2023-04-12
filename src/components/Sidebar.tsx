
import React,{useState,useEffect} from 'react'
import { SidebarData } from './SidebarData'
import * as FaIcons from 'react-icons/fa';
import {AiFillCloseCircle} from 'react-icons/ai'
import {AiFillCaretDown} from 'react-icons/ai'
import {AiFillCaretUp} from 'react-icons/ai'
import {BiGitBranch} from 'react-icons/bi'
import {BiTerminal} from 'react-icons/bi'
import "../styles/sidebar.css"
import SidebarItem from './SidebarItem'
interface Props {
  ter: boolean;
 
}

const Sidebar = ({ter}:any) => {
    const [sidebar, setSidebar] = useState(true);
    // const [dropdown, setDropdown] = useState(false);
   
  
  const showSidebar = () => setSidebar(!sidebar);
  // const showDropdown = () => setDropdown(!dropdown);
  
  return (
    <>
    <div className="container">
      <div className="sidebar" style={{width:sidebar?"20rem":"2rem"}}>
        <div className="top_section">
          <h3 className="logo">{sidebar?"Upgrade Cray EX":""}</h3>
          
          <div style={{marginLeft:sidebar?"5rem":"1rem"}} className="bars"> 
          
          <div style={{"marginRight":"5px","cursor":"pointer","fontSize":"1.3rem"}}>{sidebar?<BiGitBranch/>:""}</div>
            <div style={{"marginRight":"5px","cursor":"pointer","fontSize":"1.5rem"}}>{sidebar?<BiTerminal onClick={ter}/>:""}</div>
           <div style={{'display':'inline-block', paddingTop:"0.2rem"}}>{ sidebar?< AiFillCloseCircle onClick={showSidebar}/>:<FaIcons.FaBars  onClick={showSidebar}/>}</div>
          </div>
          
        </div>
        { SidebarData.map((item,index)=>{return <SidebarItem key={index} item={item} sidebar={sidebar}></SidebarItem>})}
      </div>
    </div>
    
</>
  )
}
//{ SidebarData.map((item,index)=>{return <SidebarItem key={index} item={item} sidebar={sidebar}></SidebarItem>})}
export default Sidebar