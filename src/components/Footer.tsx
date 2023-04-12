import {useState,useEffect} from 'react'
import "../styles/footer.css"
import {AiFillTwitterCircle} from 'react-icons/ai'
import {BsFacebook} from 'react-icons/bs'
interface PostProps{
  data:any
}
const Footer = ({data}:PostProps) => {
 
  return (
    <footer>
      
      <div className="footer-container">
        <div className="left-col">
          <img src="logo.png" alt="" className="logo"/>
          <div className="social-media">
            <a href=""><BsFacebook></BsFacebook></a>
            <a href=""><AiFillTwitterCircle></AiFillTwitterCircle></a>
          </div>
          <p className="rights-text">© 2020 Created By <b>XYX Pvt. Ltd.</b>  All Rights Reserved.</p>
        </div>
 
        <div className="right-col">
          <h1>Our Newsletter</h1>
          <div className="border"></div>
          <p>Enter Your Email to get our news and updates.</p>
          <form action="" className="newsletter-form">
            <input type="text" className="txtb" placeholder="Enter Your Email"/>
            <input type="submit" className="btn" value="submit"/>
          </form>
        </div>
      </div>
    </footer>
  )
}

export default Footer