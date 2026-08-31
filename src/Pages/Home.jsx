import React, { useState, useEffect } from "react";
import "./Home.css";

const QAScreen = () => {
  return (
    <div className="QA">
      <div className="qa-icon">
        <span className="q" >Q</span>
        <span className="a" >A</span>
        <h1 className="chatbox-text" >chatbox.....</h1>  
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
    <div >
      <h1>chatbox</h1>
      <p>sign in </p>
    </div>
  );
}


