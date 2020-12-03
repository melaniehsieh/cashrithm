import axios from 'axios';

export const publicFetch = axios.create({
  baseURL: "http://localhost:3333/api/v1"
  //baseURL: process.env.REACT_API_URL
});
