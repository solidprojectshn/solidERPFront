import axios from "axios";
import axiosRetry from "axios-retry";
import generateStore from "../redux/store";
import jwtDecode from 'jwt-decode';
import { refreshAccessToken } from "../redux/auth/actions";
import { toast } from "react-toastify";
import store from "../redux/store";
import { useNavigate } from "react-router-dom";

const api = axios.create({ 
  baseURL: process.env.REACT_APP_URL,
  headers: { 'Content-Type': 'application/json' }
});


axiosRetry(api, {
  retries: 5,
  retryDelay: axiosRetry.exponentialDelay,
});

// Interceptor de solicitudes para añadir el token
api.interceptors.request.use(
  (config) => {
    //const store = generateStore()
    const state = store.getState();

    const accessToken = state.auth.accessToken;  // Obtener el accessToken desde el estado de Redux
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas para manejar expiración de token y refrescar el token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
   // const store = generateStore()
    const originalRequest = error.config;
    const state = store.getState();
    const refreshToken = state.auth.refreshToken;

    if (error.response.status === 401 && refreshToken && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await store.dispatch(refreshAccessToken(refreshToken));  // Refrescar token usando Redux
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem('user-info');
        store.dispatch({ type: 'LOGOUT' });
        //toast.error("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");

        const navigate = useNavigate();
        navigate("/");

        return Promise.reject(err);
      }
    }
    if (!error.response || error.response.status !== 401) {
      toast.error("Error de comunicación con el servidor.");
    }
    return Promise.reject(error);
  }
);

export default api;
