import axios from "axios";
import * as actions from "./actionsType";
import ClienteServices from "./Cliente.services"
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

export const getCliente = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_CLIENTE,
      payload: true,
    });
    const resp = await ClienteServices.getCliente(filters);
    dispatch({
      type: actions.GET_CLIENTE,
      payload: {
        clientes: resp.data,
        clienteLength: resp.data.length,
      },
    });
    dispatch({
      type: actions.CLIENTE_FAIL,
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
      type: actions.CLIENTE_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_CLIENTE,
      payload: false,
    });
  }
};

export const getClienteById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_CLIENTE,
      payload: true,
    });
    const resp = await ClienteServices.getClienteByID(id);
    dispatch({
      type: actions.GET_CLIENTE,
      payload: {
        cliente: resp.data,
      },
    });
    dispatch({
      type: actions.CLIENTE_FAIL,
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
      type: actions.CLIENTE_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_CLIENTE,
      payload: false,
    });
  }
};

export const saveCliente =
  (data, setShowModal) => async (dispatch, getState) => {
    try {
      dispatch({
        type: actions.SAVE_LOADING_CLIENTE,
        payload: true,
      });
      debugger
      const resp = await ClienteServices.saveCliente(data);
      const { clientes, clienteLength } = getState().cliente;
      const _clientes = [...clientes, resp.data];
      dispatch({
        type: actions.GET_CLIENTE,
        payload: {
          clientes: _clientes,
          clienteLength: clienteLength + 1,
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
        type: actions.SAVE_LOADING_CLIENTE,
        payload: false,
      });
    }
  };

export const editCliente =
  (data, id, index, setShowModal) => async (dispatch, getState) => {
    try {
      debugger
      dispatch({
        type: actions.LOADING_CLIENTE,
        payload: true,
      });
      const resp = await ClienteServices.editCliente(id, data);
      const { clientes, clienteLength } = getState().cliente;
      const updatedClientes = [...clientes]; 
      updatedClientes[index] = resp.data;
      dispatch({
        type: actions.GET_CLIENTE,
        payload: {
          clientes: updatedClientes,
          clienteLength: clienteLength,
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
        type: actions.LOADING_CLIENTE,
        payload: false,
      });
    }
  };

export const deleteCliente = (data, id, index) => async (dispatch, getState) => {
  try {
    debugger
    dispatch({
      type: actions.LOADING_CLIENTE,
      payload: true,
    });
    await ClienteServices.deleteCliente(id, data);
    const { clientes, clienteLength } = getState().cliente;
    const deleteCliente = [...clientes]
    deleteCliente.splice(index, 1);
    dispatch({
      type: actions.GET_CLIENTE,
      payload: {
        clientes: deleteCliente,
        clienteLength: clienteLength - 1,
      },
    });
    dispatch({
      type: actions.CLIENTE_FAIL,
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
      type: actions.CLIENTE_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_CLIENTE,
      payload: false,
    });
  }
};
