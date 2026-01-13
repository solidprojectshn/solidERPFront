import axios from "axios";
import * as actions from "./actionsType";
import MetodoPagoServices from "./MetodoPago.services"
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

export const getMetodoPago = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_METODO_PAGO,
      payload: true,
    });
    const resp = await MetodoPagoServices.getMetodoPago(filters);
    dispatch({
      type: actions.GET_METODO_PAGO,
      payload: {
        metodosPago: resp.data,
        metodoPagoLength: resp.data.length,
      },
    });
    dispatch({
      type: actions.METODO_PAGO_FAIL,
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
      type: actions.METODO_PAGO_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_METODO_PAGO,
      payload: false,
    });
  }
};

export const getMetodoPagoByID = (id) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_METODO_PAGO,
      payload: true,
    });
    const resp = await MetodoPagoServices.getMetodoPagoByID(id);
    dispatch({
      type: actions.GET_METODO_PAGO,
      payload: {
        metodoPago: resp.data,
      },
    });
    dispatch({
      type: actions.METODO_PAGO_FAIL,
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
      type: actions.METODO_PAGO_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_METODO_PAGO,
      payload: false,
    });
  }
};

export const saveMetodoPago =
  (data, setShowModal) => async (dispatch, getState) => {
    try {
      dispatch({
        type: actions.SAVE_LOADING_METODO_PAGO,
        payload: true,
      });
      const resp = await MetodoPagoServices.saveMetodoPago(data);
      const { metodosPago, metodoPagoLength } = getState().metodoPago;
      const _metodosPago = [...metodosPago, resp.data];
      dispatch({
        type: actions.GET_METODO_PAGO,
        payload: {
          metodosPago: _metodosPago,
          metodoPagoLength: metodoPagoLength + 1,
        },
      });
      dispatch({
        type: actions.FORM_FAIL,
        payload: "",
      });
      setShowModal(false);
      toast.success(messages.message_exito_guardado, toastOptions);
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
    } finally {
      dispatch({
        type: actions.SAVE_LOADING_METODO_PAGO,
        payload: false,
      });
    }
  };

export const editMetodoPago =
  (data, id, index, setShowModal) => async (dispatch, getState) => {
    try {
      debugger
      dispatch({
        type: actions.LOADING_METODO_PAGO,
        payload: true,
      });
      const resp = await MetodoPagoServices.editMetodoPago(id, data);
      const { metodosPago, metodoPagoLength } = getState().metodoPago;
      const updatedmetodosPago = [...metodosPago]; 
      updatedmetodosPago[index] = resp.data;
      dispatch({
        type: actions.GET_METODO_PAGO,
        payload: {
          metodosPago: updatedmetodosPago,
          metodoPagoLength: metodoPagoLength,
        },
      });
      dispatch({
        type: actions.FORM_FAIL,
        payload: "",
      });
      setShowModal(false);

      toast.success(messages.message_exito_editado, toastOptions);

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
    } finally {
      dispatch({
        type: actions.LOADING_METODO_PAGO,
        payload: false,
      });
    }
  };

export const deleteMetodoPago = (data, id, index) => async (dispatch, getState) => {
  try {
    debugger
    dispatch({
      type: actions.LOADING_METODO_PAGO,
      payload: true,
    });
    await MetodoPagoServices.editMetodoPago(id, data);
    const { metodosPago, metodoPagoLength } = getState().metodoPago;
    const deleteMetodoPago = [...metodosPago]
    deleteMetodoPago.splice(index, 1);
    dispatch({
      type: actions.GET_METODO_PAGO,
      payload: {
        metodosPago: deleteMetodoPago,
        metodoPagoLength: metodoPagoLength - 1,
      },
    });
    dispatch({
      type: actions.METODO_PAGO_FAIL,
      payload: "",
    });
    toast.success(messages.message_exito_eliminado, toastOptions);
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
      type: actions.METODO_PAGO_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_METODO_PAGO,
      payload: false,
    });
  }
};
