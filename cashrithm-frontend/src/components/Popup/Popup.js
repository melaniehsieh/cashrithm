import React, {useEffect} from "react";
import {VscCheck, VscChromeClose} from "react-icons/vsc"
import "./popup.css";

const Popup = ({type, text, setErrorPopup, setSuccessPopup}) => {
  
  useEffect(()=> {
    if(setErrorPopup) setTimeout(() => setErrorPopup(false), 3000);
    
    if(setSuccessPopup) setTimeout(() => setSuccessPopup(false), 3000);
  }, [setSuccessPopup, setErrorPopup])
  
  if(type === "error" || type === "fail") {
    return(
      <div className="error popup">
        <div><span><VscChromeClose className="popup__btn" /></span><span>{text}</span></div>
      </div>
    );
  }
  
  if(type === "success") {
    return(
      <div className="success popup">
        <div><span><VscCheck className="popup__btn" /></span><span>{text}</span></div>
      </div>
    );
  }
}

export default Popup;