import axios from 'axios';

export const publicFetch = axios.create({
  baseURL: "/api/v1"
  //baseURL: process.env.REACT_API_URL
});
