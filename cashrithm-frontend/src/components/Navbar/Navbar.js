import React, {useContext} from "react";
import { Link, useHistory } from "react-router-dom";
import "./styles.css";
import {AuthContext} from "../../context/AuthContext";


const Navbar = () => {
  const authContext = useContext(AuthContext);
  const history = useHistory();
  
  const handleLogOut = () => {
    authContext.logout();
    history.push("/login");
  };
  
  return (
    <nav>
      <Link to="/reports" className="brand">
        Cashrithm
      </Link>
      <div className="user__nav">
        <div className="user__name">{authContext.isAuthenticated() ? authContext.authState.user.name : "Not authenticated"}</div>
        <button className="btn btn__logout" onClick={handleLogOut}>Log out</button>
      </div>
      
    </nav>
);
};

export default Navbar;
