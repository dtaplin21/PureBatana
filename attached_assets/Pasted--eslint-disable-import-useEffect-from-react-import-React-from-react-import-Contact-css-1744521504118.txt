/*eslint-disable*/
import { useEffect } from "react"
import React from 'react'
import './Contact.css'
import Message from '../../assets/messageIcon.png'

const Contact = () => {

    const [result, setResult] = React.useState("");

    const onSubmit = async (event) => {
      event.preventDefault();
      setResult("Sending....");
      const formData = new FormData(event.target);
  
      formData.append("access_key", "bc1845f5-30fe-4454-b722-452f3ec919a1");
  
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
  
      const data = await response.json();
  
      if (data.success) {
        setResult("Form Submitted Successfully");
        event.target.reset();
      } else {
        console.log("Error", data);
        setResult(data.message);
      }
    }

  return (
    <div className="contact">        
        <div className="contact-col">
            <h3>Send us a message <img src={Message} alt="" /></h3>
            <p>Feel free to reach out through contact form or find our
                contact information below. Your feedback, questions, and 
                suggestions are important to us as we strive to provide exeptional 
                service to our customers.
            </p>
            <ul>
                <li>Theunnamedfarm@gmail.com</li>
                <li>+1 510-326-1121</li>
                <li>Segbeh Town, Liberia</li>
            </ul>
        </div>
        <div className="contact-col">
            <form onSubmit={onSubmit}>
                <label>Your Name</label>
                <input type="text" name="name" placeholder="Enter your name"
                 required/>
                 <label>Email</label>
                 <input type="text" name="email" placeholder='Enter your email' 
                 required/>
                 <label>Write your message here</label>
                 <textarea id="comments" name="message" rows="6" 
                 placeholder="Message here" required></textarea>
                 <button type="submit" className="btn dark-btn">Submit</button>
            </form>
            <span>{result}</span>
        </div>
    </div>
  )
}

export default Contact