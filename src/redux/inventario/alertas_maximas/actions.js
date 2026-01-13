import axios from "axios";
import * as actions from "./actionsType";
import alertasMaxServices from "./alertasMaximas.services";
import messages from "../../../Utilities/messages"
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

export const getAlertasMax = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_ALERTAS_MAXIMAS,
      payload: true,
    });
    const resp = await alertasMaxServices.getAlertasMax(filters);
    dispatch({
      type: actions.GET_ALERTAS_MAXIMAS,
      payload: {
        alertas: resp.data,
        alertasLength: resp.data.length,
      },
    });
    dispatch({
      type: actions.ALERTAS_MAXIMAS_FAIL,
      payload: "",
    });
  } catch (ex) {
    let message = null;
    if (axios.isAxiosError(ex)) {
      if (ex.response?.status) {
        switch (ex.response.status) {
          case 400:
            message = messages.message_400 + " " + ex.response.statusText;
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
    dispatch({
      type: actions.ALERTAS_MAXIMAS_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_ALERTAS_MAXIMAS,
      payload: false,
    });
  }
};

// Obtener alerta por ID
export const getAlertaById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_ALERTAS_MAXIMAS,
      payload: true,
    });

    const resp = await alertasMaxServices.getAlertaMaxById(id);
    
    dispatch({
      type: actions.GET_ALERTA_MAXIMA_BY_ID,
      payload: {
        alerta: resp.data,
      },
    });
    
    dispatch({
      type: actions.ALERTAS_MAXIMAS_FAIL,
      payload: "",
    });
  } catch (ex) {
    let message = null;
    if (axios.isAxiosError(ex)) {
      if (ex.response?.status) {
        switch (ex.response.status) {
          case 400:
            message = messages.message_400 + " " + ex.response.statusText;
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
    dispatch({
      type: actions.ALERTAS_MAXIMAS_FAIL,
      payload: message,
    });
    toast.error(message, toastOptions);
  } finally {
    dispatch({
      type: actions.LOADING_ALERTAS_MAXIMAS,
      payload: false,
    });
  }
};
