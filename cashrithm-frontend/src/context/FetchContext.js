import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const FetchContext = createContext();

export const FetchProvider = ({ children }) => {
  const authContext = useContext(AuthContext);

  const authAxios = axios.create({
    baseURL: "http://localhost:3333/api/v1"
  });
  
  authAxios.interceptors.request.use(
    config => {
      config.headers.Authorization = `Bearer ${authContext.authState.token}`
      return config;
    },
    error => {
      return Promise.reject(error)
    }
  );

  return (
    <FetchContext.Provider
      value={{
        authAxios
      }}
    >
      {children}
    </FetchContext.Provider>
  );
};

export { FetchContext };