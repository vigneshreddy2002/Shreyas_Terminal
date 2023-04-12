import React from 'react'
import MarkDown from "markdown-to-jsx"
import {useState,useEffect} from 'react'
import Code from './Code'
import "../styles/Markdown.css"
// const c=require("../markdown/markdown.md")
interface PostProps{
  content:any
}
const Post = ({content}:PostProps) => {
  const [postContent, setPostContent] = useState("");
console.log(postContent)
  useEffect(() => {
    const set=async()=>{
      let a=await fetch(content)
      console.log(a)
      let d=await a.text();
      setPostContent(d);

    }
    set();

  }, [])
  
  return (
    <>
    <div className='markdown'>
    <MarkDown options={{
            overrides: {
              Code: {
                component: Code
              },
              code:{
                component:Code
              }
            }
          }}>{postContent}</MarkDown></div>
    </>
  )
}

export default Post 