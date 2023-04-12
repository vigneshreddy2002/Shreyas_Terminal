import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import * as style1 from 'react-syntax-highlighter/dist/esm/styles/prism';
// import * as style2 from "react-syntax-highlighter/dist/esm/styles/hljs"
import {AiOutlineCheckCircle, AiFillPlayCircle} from 'react-icons/ai'
import * as FiIcons from "react-icons/fi"
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import "../styles/Markdown.css"
import { useEffect, useState } from 'react';
// import {GiBackwardTime} from "react-icons/gi"
import "../styles/Codenew.css"
// import ReactMarkdown from "react-markdown"
import Markdown from "markdown-to-jsx";
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash'
import * as Suite from '@rsuite/icons';
// import { color } from '@mui/system';
// import Code2 from './Code2';
import '../styles/sidebar.css'
// import { SidebarData } from './SidebarData';
import Terminal from './Terminal';

var cmd1:any;
var c:any;

SyntaxHighlighter.registerLanguage('bash', bash)
var Children_li: any[] = []
var Complete_li:boolean[] = []
var Children_h2:any[] = []
// var Complete_h2:any[] = [] 
var comp:any[]=[]
var chi=0,ch=0,h22=0;
var count_h2 = 0
var count_li = 0

var cmd1:any;
var clr1:any

var pb:any;
// const NewPage = () =>{
//   return(
//     <div>
//        <Code2 content={''}></Code2>
//     </div>
//   )
// }
// const IconChange = [
//   {
//     title:'redcheck',
//     icon: <AiOutlineCheckCircle color='red'></AiOutlineCheckCircle>
//   },
//   {
//     title: 'greencheck',
//     icon: <AiOutlineCheckCircle color='green'></AiOutlineCheckCircle>
//   }
// ]
// let countOL = 0;
const IconControlRed = () =>{
  var lengthy = 1;
  let i:number
  for(i=0;i<Children_li.length;i++){
    
  if(Complete_li[i]==false){
  
  lengthy++;
  }
  else
  break;
  }

   
  
  var y = document.getElementsByClassName('icon_everything') as HTMLCollectionOf<HTMLDivElement>;
  var sidey = document.getElementsByClassName('side_icons') as HTMLCollectionOf<HTMLDivElement>;
  for(i=0;i<count_li;i++){
    if(y[i])
    y[i].style.color = 'red';
    }
  for(i=0;i<lengthy;i++){
  if(sidey[i])
   sidey[i].style.color = 'red';
  }
}
const IconControlGreen = () =>{
  // let i:number
  var y = document.getElementsByClassName('icon_everything') as HTMLCollectionOf<HTMLDivElement>;
  var sidey = document.getElementsByClassName('side_icons') as HTMLCollectionOf<HTMLDivElement>;
  // for(i=0;i<count_li;i++){
  //   if(y[i])
  //   y[i].style.color = 'green';
    
  // }
  // for(i=0;i<y.length;i++){
  // if(sidey[i])
  // sidey[i].style.color = 'green';
  // }
  
  
 
}


const TextHead = ({ children }:any ) => {
  
  return (
    <div className="h1">
      
      {children}
    </div>
  );
  
};
const TextHead2 = ({ children }:any) => {

  comp[count_h2]=chi;
  Children_h2[count_h2] = {children}
  count_h2++;
  
chi=0;
  // console.log({children}+" "+count_h2+" "+comp)
  return (
    <div className="h2">
      <AiOutlineCheckCircle className='icon_everything' />
      {children}
    </div>
  );
};
const TextHead3 = ({ children }:any) => {
  return (
    <div className="h3">
      {children}
    </div>
  );
};
const TextBlock = ({children }:any) => {
  Children_li[count_li] = "li"
  Complete_li[count_li] = false;
  // count_li++;
  
  
  
  return(
   <div className="everything">
  {/* <AiOutlineCheckCircle className='icon_everything' /> */}
  <span className='contents'>
  {children}
  </span>
  </div>
  )
}

const Blocky = ({children}:any) => {
  let lang = 'text';
  
  
  
  return (
    
    
    <div className='blockpart'>
    
    
    <SyntaxHighlighter language = {lang} style={materialDark }>
      
      {children}
    </SyntaxHighlighter>
    
  
    </div>
  )
}

const Set_True = () =>{
  Complete_li[count_li-1] = true;
  // IconControlRed();
}

const CodeBlock = ({className,children}:any) => {
  let lang = 'bash';
  const [isActive, setIsActive] = useState(false);
  Children_li[count_li] = "code"
  count_li++;
  // console.log(count_li)
  chi++;
  ch++;
  console.log(Children_li)

    
  function fcmd()
  {
    // console.log(children)
    
    cmd1(children);

  }
  function cclr(event:any)
  {
    event.currentTarget.style.color="green"
    console.log(event.currentTarget)
  }
  return (
    <>
    
    <div className='codepart'>
    <div style={{margin: '2rem'}}>
    <div >{ !isActive? <><FiIcons.FiPlay  onClick={() => {
            setIsActive(!isActive); Set_True();fcmd();count_li=0;
          } } style={{ fontSize: '1.2rem', color: "grey", fontWeight: "bold"  }} /></>:<><Suite.Reload spin 
          style={{ fontSize: '1.2rem' }} 
          color="darkgoldenrod" onClick={(event) => {
              IconControlGreen(); count_li--;cclr(event)
          } } /></>}
    </div>
    
    </div>
    
    <SyntaxHighlighter language={lang} style={style1.coy } >
      
      {children}
    </SyntaxHighlighter>
    
  
    </div></>
  )
}

const PreBlock = ({children, ...rest}:any) => {
  //if (children ['type'] === 'code') 
    
    return(
     
      CodeBlock(children['props'])
      
    );
  
  
  
}
// const TextPreBlock = ({children, ...rest}:any) => {
//   //if (children ['type'] === 'code') 
    
//     return(
     
//       Blocky(children['props'])
      
//     );
  
  
  
// }


// interface PostProps{
//   content:any
//   cmd:any
// }
const Code = ({content,cmd,clr}:any) => {
  const [postContent, setPostContent] = useState("");
  console.log(clr)
// console.log(postContent)
  useEffect(() => {
    const set=async()=>{
      let a=await fetch(content)
      // console.log(a)
      let d=await a.text();
      setPostContent(d);

    }
    set();

  }, [])
  
  return (
    <>
    {cmd1=cmd}
    { clr1=clr}
    <div className='markdown'>
    
    <Markdown options={{
            overrides: {
            pre: PreBlock,
            
          
            li: TextBlock,
            
            h1:TextHead,
            h2:TextHead2,
            h3:TextHead3
        
            },
          }}>{postContent}</Markdown></div>
         
    </>
  )
}

  /*return (
    <div>  
      <AiFillPlayCircle className='play'></AiFillPlayCircle>
      <SyntaxHighlighter
    language={lang}
    style={materialDark}
  >
    {children}
  </SyntaxHighlighter></div>
  )
}*/

export default Code

// function rgba(arg0: number, arg1: number, arg2: number, arg3: number): string {
//   throw new Error('Function not implemented.');
// }
