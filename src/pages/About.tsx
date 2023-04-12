import React from 'react'
import Post from '../components/Post'
import Code from '../components/Code'
const c=require("../markdown/markdown2.md")
const About = ({cmd,clr}:any) => {
  return (
    <div className='pages'> 
    <Code content={c} cmd={cmd} clr={clr}></Code>    </div>
  )
}

export default About