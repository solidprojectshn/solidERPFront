import axios from "axios";
import axiosRetry from "axios-retry";
import * as actions from "./actionsType";
import api from "../../services/axios.services";
import messages from "../../Utilities/messages";
import { toast } from 'react-toastify';

const toastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light"
};

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_URL,
  headers: { 'Content-Type': 'application/json' }
});


axiosRetry(apiClient, {
  retries: 5,
  retryDelay: axiosRetry.exponentialDelay,
});


// Acción para manejar el inicio de sesión
export const login = (credentials) => async (dispatch) => {
  dispatch({ type: actions.LOGIN_REQUEST }); // Despachar acción de inicio de login

  try {
    const response = await apiClient.post('/api/token/', credentials); // Cambia a /api/token/
    const { access, refresh } = response.data;

    // Después de obtener los tokens, puedes hacer otra solicitud para obtener los permisos del usuario
    const userDataReponse = await apiClient.get('/usuario-info/', {
      headers: { Authorization: `Bearer ${access}` },
    });

    // Obtener permisos del usuario desde la respuesta
    const userData = userDataReponse.data;

    let authInfo = {
      accessToken: access,
      refreshToken: refresh,
      user: userData.empleado_info,
      permissions: userData.permisos,
      username: userData.username
    }

    localStorage.setItem('user-info', JSON.stringify(authInfo))

    // Despachar acción de éxito de login
    dispatch({
      type: actions.LOGIN_SUCCESS,
      payload: authInfo,
    });
  } catch (ex) {
    let message = null;
    console.log(ex)

    if (axios.isAxiosError(ex)) {
      if (ex.response?.status) {
        switch (ex.response.status) {
          case 400:
            message = messages.message_400 + " " + ex.response.statusText;
            break;
          case 401:
            message = messages.message_error_login;
            break;
          case 404:
            message = messages.message_404 + " " + ex.response.statusText;
            break;
          case 500:
            message = messages.message_500 + " " + ex.response.statusText;
            break;
          default:
            message = ex.response.data;
            break;
        }
      } else {
        message =
          ex.message === "Network Error" ? messages.message_network_error : ex.message;
      }
    } else {
      message =
        ex.message === "Network Error" ? messages.message_network_error : ex.message;
    }
    console.log(message)
    dispatch({
      type: actions.LOGIN_FAIL,
      payload: {
        error: message, // Manejo del error
      },
    });
    toast.error(message, toastOptions);
  }
};


export const refreshAccessToken = (refreshToken) => async (dispatch) => {
  try {
    const response = await apiClient.post('/api/token/refresh/', { refresh: refreshToken }); // Cambia a /api/token/refresh/
    const newAccessToken = response.data.access;

    const userInfo = JSON.parse(localStorage.getItem('user-info'))
    userInfo.accessToken = newAccessToken;
    localStorage.setItem('user-info', JSON.stringify(userInfo));

    // Despachar acción para actualizar el accessToken en el store
    dispatch({
      type: actions.REFRESH_TOKEN_SUCCESS,
      payload: { accessToken: newAccessToken },
    });

    return newAccessToken;
  } catch (ex) {
    let message = null;
    console.log(ex)

    if (axios.isAxiosError(ex)) {
      if (ex.response?.status) {
        switch (ex.response.status) {
          case 400:
            message = messages.message_400 + " " + ex.response.statusText;
            break;
          case 401:
            message = messages.message_cierre_sesion;
            break;
          case 404:
            message = messages.message_404 + " " + ex.response.statusText;
            break;
          case 500:
            message = messages.message_500 + " " + ex.response.statusText;
            break;
          default:
            message = ex.response.data;
            break;
        }
      } else {
        message =
          ex.message === "Network Error" ? messages.message_network_error : ex.message;
      }
    } else {
      message =
        ex.message === "Network Error" ? messages.message_network_error : ex.message;
    }
    console.log(message)
    toast.error(message, toastOptions); // Manejo de errores
    throw message;
  }
};



// Acción para manejar la carga inicial
export const loadInitialData = () => async (dispatch, getState) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    if (userInfo) {
      dispatch({
        type: actions.LOGIN_SUCCESS,
        payload: userInfo,
      });
    }} catch (ex) {
      console.log(ex)

    }
  }



    // Acción para manejar el cierre de sesión
    export const logout = () => (dispatch) => {
      localStorage.removeItem('user-info');
      dispatch({ type: actions.LOGOUT });
      toast.info("Sesión cerrada.", toastOptions);
    };