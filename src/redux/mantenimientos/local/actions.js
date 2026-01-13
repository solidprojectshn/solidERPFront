import axios from "axios";
import * as actions from "./actionsType";
import LocalServices from "./Local.services"
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

export const getLocal = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_LOCAL,
      payload: true,
    });
    const resp = await LocalServices.getLocal(filters);
    dispatch({
      type: actions.GET_LOCAL,
      payload: {
        locales: resp.data,
        localLength: resp.data.length,
      },
    });
    dispatch({
      type: actions.LOCAL_FAIL,
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
      type: actions.LOCAL_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_LOCAL,
      payload: false,
    });
  }
};

export const getLocalById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_LOCAL,
      payload: true,
    });
    const resp = await LocalServices.getLocalByID(id);
    dispatch({
      type: actions.GET_LOCAL,
      payload: {
        local: resp.data,
      },
    });
    dispatch({
      type: actions.LOCAL_FAIL,
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
      type: actions.LOCAL_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_LOCAL,
      payload: false,
    });
  }
};

export const saveLocal =
  (data, setShowModal) => async (dispatch, getState) => {
    try {
      debugger
      dispatch({
        type: actions.SAVE_LOADING_LOCAL,
        payload: true,
      });
      const resp = await LocalServices.saveLocal(data);
      const { locales, localLength } = getState().local;
      const _locales = [...locales, resp.data];
      dispatch({
        type: actions.GET_LOCAL,
        payload: {
          locales: _locales,
          localLength: localLength + 1,
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
        type: actions.SAVE_LOADING_LOCAL,
        payload: false,
      });
    }
  };

export const editLocal =
  (data, id, index, setShowModal) => async (dispatch, getState) => {
    try {
      debugger
      dispatch({
        type: actions.LOADING_LOCAL,
        payload: true,
      });
      const resp = await LocalServices.editLocal(id, data);
      const { locales, localLength } = getState().local;
      const updatedLocales = [...locales]; 
      updatedLocales[index] = resp.data;
      dispatch({
        type: actions.GET_LOCAL,
        payload: {
          locales: updatedLocales,
          localLength: localLength,
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
        type: actions.LOADING_LOCAL,
        payload: false,
      });
    }
  };

export const deleteLocal = (data, id, index) => async (dispatch, getState) => {
  try {
    debugger
    dispatch({
      type: actions.LOADING_LOCAL,
      payload: true,
    });
    await LocalServices.editLocal(id, data);
    const { locales, localLength } = getState().local;
    const deleteLocal = [...locales]
    deleteLocal.splice(index, 1);
    dispatch({
      type: actions.GET_LOCAL,
      payload: {
        locales: deleteLocal,
        localLength: localLength - 1,
      },
    });
    dispatch({
      type: actions.LOCAL_FAIL,
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
      type: actions.LOCAL_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_LOCAL,
      payload: false,
    });
  }
};
