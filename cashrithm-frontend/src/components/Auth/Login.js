import React, { useState, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import {FetchContext} from "../../context/FetchContext";
import {VscLoading} from "react-icons/vsc";
import {VscRss} from "react-icons/vsc";
import {VscTriangleUp} from "react-icons/vsc";
import {ImSpinner} from "react-icons/im";
import Popup from "../Popup/Popup"
import {publicFetch} from "../../utils/PublicFetch";

import "./styles.css";


const Login = () => {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);
  const [redirectOnSuccess, setRedirectOnSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setIsLoading(true)
      const data = await publicFetch.post("/user/login", {email, password});
      //console.log(data);
      authContext.setAuthState(data.data);
      setSuccessPopup(true);
      setTimeout(() => setRedirectOnSuccess(true) , 1500);
    } catch (e) {
      console.log(e);
      setErrorMessage(e.response.data.message);
      setErrorPopup(true);
      setIsLoading(false);
    }
  }

  return (
    <form className="auth-container" onSubmit={handleSubmit}>
      {redirectOnSuccess && <Redirect to ="/reports" />}
      {successPopup && <Popup type="success" text="login successful" setSuccessPopup={setSuccessPopup} />}
      {errorPopup && <Popup type="error" text={errorMessage} setErrorPopup={setErrorPopup} />}
      <h4>Welcome Back!</h4>
      <input
        id="email"
        type="email"
        placeholder="Email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        required
        minLength="8"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>{isLoading ? <div><VscTriangleUp className="spinner" /><span>Logging in...</span></div> : <span>Login</span>}</button>
      <p>
        Don't have an account?
        <Link to="/signup"> Signup</Link>
      </p>
    </form>
  );
};

export default Login;
