import axios from "axios";
import * as actions from "./actionsType";
import PermisosServices from "./Permisos.services"
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

export const getPermisos = (filters) => async (dispatch) => {

  try {
    dispatch({
      type: actions.LOADING_PERMISOS,
      payload: true,
    });
    const resp = await PermisosServices.getPermisosSistema(filters);
    dispatch({
      type: actions.GET_PERMISOS,
      payload: {
        permisos: resp.data,
        permisosLength: resp.data.length,
      },
    });
    dispatch({
      type: actions.PERMISOS_FAIL,
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
      type: actions.PERMISOS_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_PERMISOS,
      payload: false,
    });
  }
};

export const getPermisosById = (id) => async (dispatch) => {
  try {
    debugger
    dispatch({
      type: actions.LOADING_PERMISOS_BY_ID,
      payload: true,
    });
    const resp = await PermisosServices.getPermisosByID(id);
    dispatch({
      type: actions.GET_PERMISOS_BY_ID,
      payload: resp.data,

    });
    dispatch({
      type: actions.PERMISOS_BY_ID_FAIL,
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
      type: actions.PERMISOS_BY_ID_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_PERMISOS_BY_ID,
      payload: false,
    });
  }
};

export const savePermisos =
  (data, setShowModal) => async (dispatch, getState) => {
    try {
      dispatch({
        type: actions.SAVE_LOADING_PERMISOS,
        payload: true,
      });
      debugger
      const resp = await PermisosServices.savePermisos(data);
      const { permisos, permisosLength } = getState().permisos;
      const _permisos = [...permisos, resp.data];
      dispatch({
        type: actions.GET_PERMISOS,
        payload: {
          permisos: _permisos,
          permisosLength: permisosLength + 1,
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
        type: actions.SAVE_LOADING_PERMISOS,
        payload: false,
      });
    }
  };

export const editPermisos =
  (data, id) => async (dispatch, getState) => {
    try {
      debugger
      dispatch({
        type: actions.SAVE_LOADING_PERMISOS,
        payload: true,
      });
      await PermisosServices.editPermisos(id, data);
      const resp = await PermisosServices.getPermisosByID(id);
      dispatch({
        type: actions.GET_PERMISOS_BY_ID,
        payload: resp.data,

      });
      dispatch({
        type: actions.FORM_FAIL,
        payload: "",
      });
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
        type: actions.SAVE_LOADING_PERMISOS,
        payload: false,
      });
    }
  };

export const deletePermisos = (data, id, index) => async (dispatch, getState) => {
  try {
    debugger
    dispatch({
      type: actions.LOADING_PERMISOS,
      payload: true,
    });
    await PermisosServices.editPermisos(id, data);
    const { permisos, permisosLength } = getState().permisos;
    const deletePermiso = [...permisos]
    deletePermiso.splice(index, 1);
    dispatch({
      type: actions.GET_PERMISOS,
      payload: {
        permisos: deletePermiso,
        permisosLength: permisosLength - 1,
      },
    });
    dispatch({
      type: actions.PERMISOS_FAIL,
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
      type: actions.PERMISOS_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_PERMISOS,
      payload: false,
    });
  }
};
