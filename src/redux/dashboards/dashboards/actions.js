import axios from "axios";
import * as actions from "./actionsType";
import DashboardServices from "./Dashboard.services"
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

export const getCumpMetas = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_CUMPLIMIENTO_METAS,
      payload: true,
    });
    const resp = await DashboardServices.getCumpMetas(filters);
    dispatch({
      type: actions.GET_CUMPLIMIENTO_METAS,
      payload: resp.data,
    });
    dispatch({
      type: actions.CUMPLIMIENTO_METAS_FAIL,
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
      type: actions.CUMPLIMIENTO_METAS_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_CUMPLIMIENTO_METAS,
      payload: false,
    });
  }
};


export const getVentasMensuales = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_VENTAS_MENSUALES,
      payload: true,
    });
    const resp = await DashboardServices.getVentasMensuales(filters);
    dispatch({
      type: actions.GET_VENTAS_MENSUALES,
      payload: resp.data,
    });
    dispatch({
      type: actions.VENTAS_MENSUALES_FAIL,
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
      type: actions.VENTAS_MENSUALES_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_VENTAS_MENSUALES,
      payload: false,
    });
  }
};


export const getTopProductos = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_TOP_PRODUCTOS,
      payload: true,
    });
    const resp = await DashboardServices.getTopProductos(filters);
    dispatch({
      type: actions.GET_TOP_PRODUCTOS,
      payload: resp.data,
    });
    dispatch({
      type: actions.TOP_PRODUCTOS_FAIL,
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
      type: actions.TOP_PRODUCTOS_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_TOP_PRODUCTOS,
      payload: false,
    });
  }
};


export const getTopLocales = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_TOP_LOCALES,
      payload: true,
    });
    const resp = await DashboardServices.getTopLocales(filters);
    dispatch({
      type: actions.GET_TOP_LOCALES,
      payload: resp.data,
    });
    dispatch({
      type: actions.TOP_LOCALES_FAIL,
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
      type: actions.TOP_LOCALES_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_TOP_LOCALES,
      payload: false,
    });
  }
};

export const getKpis = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_KPIS,
      payload: true,
    });
    const resp = await DashboardServices.getKpis(filters);
    dispatch({
      type: actions.GET_KPIS,
      payload: resp.data,
    });
    dispatch({
      type: actions.KPIS_FAIL,
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
      type: actions.KPIS_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_KPIS,
      payload: false,
    });
  }
};