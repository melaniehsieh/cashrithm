import React, { useState, useContext } from "react";
import {Redirect, Link} from "react-router-dom";
import {VscLoading} from "react-icons/vsc";
import {VscRss} from "react-icons/vsc";
import {VscTriangleUp} from "react-icons/vsc";
import Popup from "../Popup/Popup"

import "./styles.css";
import {publicFetch} from "../../utils/PublicFetch";
import {AuthContext} from "../../context/AuthContext";



const Signup = () => {
  const authContext = useContext(AuthContext);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);
  const [redirectOnSuccess, setRedirectOnSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleOnchange = (e) => {
    const {name, value} = e.target;
    setUserData({...userData, [name]: value});
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      const {data} = await publicFetch.post("/user/signup", userData);
      authContext.setAuthState(data);
      setSuccessPopup(true);
      setTimeout(() => setRedirectOnSuccess(true), 1500);
    } catch (e) {
      console.log(e);
      setErrorPopup(true);
      setIsLoading(false)
      setErrorMessage(e.response.data.message);
    }
  };

  const {name, email, password, passwordConfirm} = userData;
  return (
    <form className="auth-container" onSubmit={handleSubmit}>
      {redirectOnSuccess && <Redirect to ="/reports" />}
      {successPopup && <Popup type="success" text="user successful created" setSuccessPopup={setSuccessPopup} />}
      {errorPopup && <Popup type="error" text={errorMessage} setErrorPopup={setErrorPopup} />}
      <h4>Join Us!</h4>
      <input
        id="name"
        type="text"
        name="name"
        placeholder="Name"
        value={name}
        onChange={handleOnchange}
        required
      />
      <input
        id="email"
        type="email"
        name="email"
        placeholder="Email"
        value={email}
        onChange={handleOnchange}
        required
      />
      <input
        id="password"
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={handleOnchange}
        required
        minLength="8"
      />
      <input
        id="password"
        type="password"
        name="passwordConfirm"
        placeholder="Password Confirm"
        value={passwordConfirm}
        onChange={handleOnchange}
        required
        minLength="8"
      />
      <button>{isLoading ? <div><VscTriangleUp className="spinner" /><span>Signing up...</span></div> : <span>Signup</span>}</button>
      <p>
        Already have an account?
        <Link to="/login"> Login</Link>
      </p>
    </form>
  );
};

export default Signup;
