import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;


const baseApi = axios.create({
  baseURL: apiUrl, 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

baseApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


baseApi.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );

export default baseApi;
