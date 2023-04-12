import React from 'react'
import Post from '../components/Post'
import Code from '../components/Code'
const c1 = require("../markdown/Stage1.md")

const Stag1 = ({cmd,clr}:any) => {
  // let c="a";
  return (
    <div className='pages'>
    <Code content={c1} cmd={cmd} clr={clr}></Code>      
      
      </div>
  )
}

export default Stag1;