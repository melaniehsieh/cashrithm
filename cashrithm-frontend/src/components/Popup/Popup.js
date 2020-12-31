import React, {useEffect} from "react";
import {VscCheck, VscChromeClose} from "react-icons/vsc"
import "./popup.css";

const Popup = ({type, text, setErrorPopup, setSuccessPopup}) => {
  
  useEffect(()=> {
    if(setErrorPopup) setTimeout(() => setErrorPopup(false), 5000);
    
    if(setSuccessPopup) setTimeout(() => setSuccessPopup(false), 5000);
  }, [setSuccessPopup, setErrorPopup])
  
  if(type === "error" || type === "fail") {
    return(
      <div className="error popup">
        <div className="error__label">
        <span><VscChromeClose className="popup__btn" /></span><span>error</span>
        </div>
        <div className="error__text">{text}</div>
      </div>
    );
  }
  
  if(type === "success") {
    return(
      <div className="success popup">
        <div className="success__label"><span><VscCheck className="popup__btn" /></span><span>success</span>
        </div>
        <div className="success__text">{text}</div>
      </div>
    );
  }
}

export default Popup;