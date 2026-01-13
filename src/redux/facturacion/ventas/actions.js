import axios from "axios";
import * as actions from "./actionsType";
import ventasServices from "./ventas.services";
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

export const getVenta = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_VENTA,
      payload: true,
    });
    const resp = await ventasServices.getVentas(filters);
    dispatch({
      type: actions.GET_VENTA,
      payload: {
        ventas: resp.data,
        ventaLength: resp.data.length,
      },
    });
    dispatch({
      type: actions.VENTA_FAIL,
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
      type: actions.VENTA_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_VENTA,
      payload: false,
    });
  }
};

export const getTipoVenta = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_TIPO_VENTA,
      payload: true,
    });
    const resp = await ventasServices.getTipoVenta(filters);
    dispatch({
      type: actions.GET_TIPO_VENTA,
      payload: resp.data,
    });
    dispatch({
      type: actions.TIPO_VENTA_FAIL,
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
      type: actions.TIPO_VENTA_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_TIPO_VENTA,
      payload: false,
    });
  }
};

export const getNumFactura = (id) => async (dispatch) => {
  try {
    debugger
    dispatch({
      type: actions.LOADING_NUM_FACTURA,
      payload: true,
    });

    const resp = await ventasServices.getNumFactura(id);
    dispatch({
      type: actions.GET_NUM_FACTURA,
      payload: resp.data,
    });
    dispatch({
      type: actions.NUM_FACTURA_FAIL,
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
      type: actions.NUM_FACTURA_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_NUM_FACTURA,
      payload: false,
    });
  }
};

export const getVentaById = (id) => async (dispatch) => {
  try {
    
    dispatch({
      type: actions.LOADING_VENTA_BY_ID,
      payload: true,
    });
    const resp = await ventasServices.getVentaByID(id);
    dispatch({
      type: actions.GET_VENTA_BY_ID,
      payload: resp.data
    });
    dispatch({
      type: actions.VENTA_BY_ID_FAIL,
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
      type: actions.VENTA_BY_ID_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_VENTA_BY_ID,
      payload: false,
    });
  }
};


export const saveVenta = (data) => async (dispatch) => {
  try {
    dispatch({
      type: actions.SAVE_LOADING_VENTA,
      payload: true,
    });

    const resp = await ventasServices.saveVenta(data);

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
      type: actions.SAVE_LOADING_VENTA,
      payload: false,
    });
  }
};

export const savePagoCuota = (data) => async (dispatch) => {
  try {
    debugger
    dispatch({
      type: actions.SAVE_LOADING_VENTA,
      payload: true,
    });

    const resp = await ventasServices.savePagoCuota(data);

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
      type: actions.SAVE_LOADING_VENTA,
      payload: false,
    });
  }
};



