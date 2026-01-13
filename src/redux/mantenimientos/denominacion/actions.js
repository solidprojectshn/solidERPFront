import axios from "axios";
import * as actions from "./actionsType";
import DenominacionServices from "./Denominacion.services"
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

export const getDenominacion = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_DENOMINACION,
      payload: true,
    });
    const resp = await DenominacionServices.getDenominacion(filters);
    dispatch({
      type: actions.GET_DENOMINACION,
      payload: {
        denominaciones: resp.data,
        denominacionLength: resp.data.length,
      },
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

export const getDenominacionById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_DENOMINACION,
      payload: true,
    });
    const resp = await DenominacionServices.getDenominacionByID(id);
    dispatch({
      type: actions.GET_DENOMINACION,
      payload: {
        denominacion: resp.data,
      },
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

export const saveDenominacion =
  (data, setShowModal) => async (dispatch, getState) => {
    try {
      dispatch({
        type: actions.SAVE_LOADING_DENOMINACION,
        payload: true,
      });
      const resp = await DenominacionServices.saveDenominacion(data);
      await dispatch(getDenominacion());
      const { denominaciones, denominacionLength } = getState().denominacion;
      const _denominaciones = [...denominaciones, resp.data];
      dispatch({
        type: actions.GET_DENOMINACION,
        payload: {
          denominaciones: _denominaciones,
          denominacionLength: denominacionLength + 1,
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
        type: actions.SAVE_LOADING_DENOMINACION,
        payload: false,
      });
    }
  };

export const editDenominacion =
  (data, id, index, setShowModal) => async (dispatch, getState) => {
    try {
      debugger
      dispatch({
        type: actions.LOADING_DENOMINACION,
        payload: true,
      });
      const resp = await DenominacionServices.editDenominacion(id, data);
      await dispatch(getDenominacion());
      const { denominaciones, denominacionLength } = getState().denominacion;
      const updatedenominaciones = [...denominaciones]; 
      updatedenominaciones[index] = resp.data;
      dispatch({
        type: actions.GET_DENOMINACION,
        payload: {
          denominaciones: denominaciones,
          denominacionLength: denominacionLength,
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
        type: actions.LOADING_DENOMINACION,
        payload: false,
      });
    }
  };

export const deleteDenominacion = (data, id, index) => async (dispatch, getState) => {
  try {
    debugger
    dispatch({
      type: actions.LOADING_DENOMINACION,
      payload: true,
    });
    await DenominacionServices.editDenominacion(id, data);
    const { denominaciones, denominacionLength } = getState().denominacion;
    const deletedenominacion = [...denominaciones]
    deletedenominacion.splice(index, 1);
    dispatch({
      type: actions.GET_DENOMINACION,
      payload: {
        denominaciones: deletedenominacion,
        denominacionLength: denominacionLength - 1,
      },
    });
    dispatch({
      type: actions.DENOMINACION_FAIL,
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
