import React, { useState, useEffect } from "react";
import "./Home.css";
import facebook from "../assets/Images/facebook.png";
import gmail from "../assets/Images/gmail.png";
import apple from "../assets/Images/apple.png";
import { Link } from "react-router-dom";

const QAScreen = () => {
  return (
    <div className="QA">
      <div className="qa-icon">
        <span className="q">Q</span>
        <span className="a">A</span>
        <h1 className="chatbox-text">chatbox.....</h1>
      </div>
    </div>
  );
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  if (isLoading) {
    return <QAScreen />;
  }

  return (
    <>
      <section className="home">
        <div className="qa-icon-home">
          <span className="q">Q</span>
          <span style={{ marginRight: "7px" }} className="a">
            A
          </span>
          <h1 className="chatbox-text-home">chatbox</h1>
        </div>

        <div>
          <h1  className="connect-text">
            Connect <br /> friends <br /> 
            easily & <br />
            Quickly
          </h1>
          <p className="chat-text">
            Our chat app is the perfect way to stay <br /> connected with
            friends and family.
          </p>
        </div>

        <div className="social">
        <img className="flogo" src={facebook} alt="facebook" />
        <img className="flogo" src={gmail} alt="gmail" />
        <img className="flogo" src={apple} alt="apple" />
        </div>

      <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
      <div style={{ flex: 0.7, height: '1px', backgroundColor: '#ccc' }}></div>
      <span style={{ padding: '0 10px', color: '#666', fontWeight: 'bold' }}>OR</span>
      <div style={{ flex: 0.8, height: '1px', backgroundColor: '#ccc' }}></div>
    </div> 

    <div>
        <h1 className="footer"> <Link style={{textDecoration:"none", color:"black"}} to="/signup">Sign up with email</Link></h1>  
    </div> 

    <div>
        <h1 className="foot">Existing account? <Link style={{textDecoration:"none", color:"white"}} to="/login">Log in</Link></h1>
    </div>
 


      </section>
    </>
  );
}
