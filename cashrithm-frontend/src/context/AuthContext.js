import React, { createContext, useState } from 'react';
//import { useHistory } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  //const token = localStorage.getItem("token");
  const exp = localStorage.getItem("exp");
  const user = localStorage.getItem("user");
  
  const [authState, setAuthState] = useState({
    token: null,
    exp,
    user: user ? JSON.parse(user) : {}
  });
  
  const setAuthData = ({token, exp, user}) => {
    //localStorage.setItem("token", token);
    localStorage.setItem("exp", exp);
    localStorage.setItem("user", JSON.stringify(user));
    setAuthState({
      token,
      exp,
      user
    });
  };
  
  const isAuthenticated = () => {
    if(!authState.exp) {
      return false
    }
    
    return new Date().getTime() / 1000 < authState.exp;
  };
  
  const logout = () => {
    //localStorage.removeItem("token");
    localStorage.removeItem("exp");
    localStorage.removeItem("user");
    
    setAuthState({
      token: null,
      exp: null,
      user: {}
    })
  }
  
  const isAdmin = () => {
    return authState.user.role === "admin";
  };
  
  return (
    <AuthContext.Provider
      value={{
        authState,
        isAuthenticated,
        setAuthState: (authData) => setAuthData(authData),
        logout,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };