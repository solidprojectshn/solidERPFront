import axios from "axios";
import * as actions from "./actionsType";
import TipoLocalServices from "./TipoLocal.services"
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

export const getTipoLocal = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_TIPO_LOCAL,
      payload: true,
    });
    const resp = await TipoLocalServices.getTipoLocal(filters);
    dispatch({
      type: actions.GET_TIPO_LOCAL,
      payload: {
        tipoLocales: resp.data,
        tipoLocalLength: resp.data.length,
      },
    });
    dispatch({
      type: actions.TIPO_LOCAL_FAIL,
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
      type: actions.TIPO_LOCAL_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_TIPO_LOCAL,
      payload: false,
    });
  }
};

export const getTipoLocalByID = (id) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_TIPO_LOCAL,
      payload: true,
    });
    const resp = await TipoLocalServices.getTipoLocalByID(id);
    dispatch({
      type: actions.GET_TIPO_LOCAL,
      payload: {
        tipoLocal: resp.data,
      },
    });
    dispatch({
      type: actions.TIPO_LOCAL_FAIL,
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
      type: actions.TIPO_LOCAL_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_TIPO_LOCAL,
      payload: false,
    });
  }
};

export const saveTipoLocal =
  (data, setShowModal) => async (dispatch, getState) => {
    try {
      dispatch({
        type: actions.SAVE_LOADING_TIPO_LOCAL,
        payload: true,
      });
      const resp = await TipoLocalServices.saveTipoLocal(data);
      const { tipoLocales, tipoLocalLength } = getState().tipoLocal;
      const _tipoLocales = [...tipoLocales, resp.data];
      dispatch({
        type: actions.GET_TIPO_LOCAL,
        payload: {
          tipoLocales: _tipoLocales,
          tipoLocalLength: tipoLocalLength + 1,
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
        type: actions.SAVE_LOADING_TIPO_LOCAL,
        payload: false,
      });
    }
  };

export const editTipoLocal =
  (data, id, index, setShowModal) => async (dispatch, getState) => {
    try {
      debugger
      dispatch({
        type: actions.LOADING_TIPO_LOCAL,
        payload: true,
      });
      const resp = await TipoLocalServices.editTipoLocal(id, data);
      const { tipoLocales, tipoLocalLength } = getState().tipoLocal;
      const updatedTipoLocales = [...tipoLocales]; 
      updatedTipoLocales[index] = resp.data;
      dispatch({
        type: actions.GET_TIPO_LOCAL,
        payload: {
          tipoLocales: updatedTipoLocales,
          tipoLocalLength: tipoLocalLength,
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
        type: actions.LOADING_TIPO_LOCAL,
        payload: false,
      });
    }
  };

export const deleteTipoLocal = (data, id, index) => async (dispatch, getState) => {
  try {
    debugger
    dispatch({
      type: actions.LOADING_TIPO_LOCAL,
      payload: true,
    });
    await TipoLocalServices.editTipoLocal(id, data);
    const { tipoLocales, tipoLocalLength } = getState().tipoLocal;
    const deleteTipoLocal = [...tipoLocales]
    deleteTipoLocal.splice(index, 1);
    dispatch({
      type: actions.GET_TIPO_LOCAL,
      payload: {
        tipoLocales: deleteTipoLocal,
        tipoLocalLength: tipoLocalLength - 1,
      },
    });
    dispatch({
      type: actions.TIPO_LOCAL_FAIL,
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
      type: actions.TIPO_LOCAL_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_TIPO_LOCAL,
      payload: false,
    });
  }
};
  


