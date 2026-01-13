import axios from "axios";
import * as actions from "./actionsType";
import arqueosServices from "./arqueos.services";
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

export const getArqueo = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_ARQUEO,
      payload: true,
    });
    const resp = await arqueosServices.getArqueos(filters);
    dispatch({
      type: actions.GET_ARQUEO,
      payload: {
        arqueos: resp.data,
        arqueoLength: resp.data.length,
      },
    });
    dispatch({
      type: actions.ARQUEO_FAIL,
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
      type: actions.ARQUEO_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_ARQUEO,
      payload: false,
    });
  }
};

export const getDenominaciones= (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_DENOMINACION,
      payload: true,
    });
    const resp = await arqueosServices.getDenominaciones(filters);
    dispatch({
      type: actions.GET_DENOMINACION,
      payload: resp.data,
    });
    dispatch({
      type: actions.DENOMINACION_FAIL,
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
      type: actions.DENOMINACION_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_DENOMINACION,
      payload: false,
    });
  }
};
export const getResumenMetodoPago = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_RESUMEN_METODO_PAGO,
      payload: true,
    });
    const resp = await arqueosServices.getResumenMetodoPago(filters);
    dispatch({
      type: actions.GET_RESUMEN_METODO_PAGO,
      payload: resp.data,
    });
    dispatch({
      type: actions.RESUMEN_METODO_PAGO_FAIL,
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
      type: actions.RESUMEN_METODO_PAGO_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_RESUMEN_METODO_PAGO,
      payload: false,
    });
  }
};


export const getArqueoById = (id) => async (dispatch) => {
  try {
    
    dispatch({
      type: actions.LOADING_ARQUEO_BY_ID,
      payload: true,
    });
    const resp = await arqueosServices.getArqueoByID(id);
    dispatch({
      type: actions.GET_ARQUEO_BY_ID,
      payload: resp.data
    });
    dispatch({
      type: actions.ARQUEO_BY_ID_FAIL,
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
      type: actions.ARQUEO_BY_ID_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_ARQUEO_BY_ID,
      payload: false,
    });
  }
};


export const saveArqueo = (data) => async (dispatch) => {
  try {
    dispatch({
      type: actions.SAVE_LOADING_ARQUEO,
      payload: true,
    });

    const resp = await arqueosServices.saveArqueo(data);

    dispatch({
      type: actions.FORM_FAIL,
      payload: "",
    });
    toast.success(messages.message_exito_guardado, toastOptions);

    // Devuelve los datos de la respuesta
    return resp.data;
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
      type: actions.FORM_FAIL,
      payload: message,
    });
    toast.error(message, toastOptions);
  } finally {
    dispatch({
      type: actions.SAVE_LOADING_ARQUEO,
      payload: false,
    });
  }
};





