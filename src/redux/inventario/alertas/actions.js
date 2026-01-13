import axios from "axios";
import * as actions from "./actionsType";
import alertasServices from "./alertas.services";
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

export const getAlertas = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_ALERTAS,
      payload: true,
    });
    const resp = await alertasServices.getAlertas(filters);
    dispatch({
      type: actions.GET_ALERTAS,
      payload: {
        alertas: resp.data,
        alertasLength: resp.data.length,
      },
    });
    dispatch({
      type: actions.ALERTAS_FAIL,
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
      type: actions.ALERTAS_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_ALERTAS,
      payload: false,
    });
  }
};

// Obtener alerta por ID
export const getAlertaById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_ALERTAS,
      payload: true,
    });

    const resp = await alertasServices.getAlertaById(id);
    
    dispatch({
      type: actions.GET_ALERTA_BY_ID,
      payload: {
        alerta: resp.data,
      },
    });
    
    dispatch({
      type: actions.ALERTAS_FAIL,
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
      type: actions.ALERTAS_FAIL,
      payload: message,
    });
    toast.error(message, toastOptions);
  } finally {
    dispatch({
      type: actions.LOADING_ALERTAS,
      payload: false,
    });
  }
};
