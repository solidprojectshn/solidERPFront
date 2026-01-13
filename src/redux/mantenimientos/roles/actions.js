import axios from "axios";
import * as actions from "./actionsType";
import RolServices from "./Roles.services"
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

export const getRol = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_ROL,
      payload: true,
    });
    const resp = await RolServices.getRol(filters);
    dispatch({
      type: actions.GET_ROL,
      payload: {
        roles: resp.data,
        rolLength: resp.data.length,
      },
    });
    dispatch({
      type: actions.ROL_FAIL,
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
      type: actions.ROL_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_ROL,
      payload: false,
    });
  }
};

export const getRolByID = (id) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_ROL,
      payload: true,
    });
    const resp = await RolServices.getRolByID(id);
    dispatch({
      type: actions.GET_ROL,
      payload: {
        rol: resp.data,
      },
    });
    dispatch({
      type: actions.ROL_FAIL,
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
      type: actions.ROL_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_ROL,
      payload: false,
    });
  }
};

export const saveRol =
  (data, setShowModal) => async (dispatch, getState) => {
    try {
      dispatch({
        type: actions.SAVE_LOADING_ROL,
        payload: true,
      });
      const resp = await RolServices.saveRol(data);
      const { roles, rolLength } = getState().rol;
      const _roles = [...roles, resp.data];
      dispatch({
        type: actions.GET_ROL,
        payload: {
          roles: _roles,
          rolLength: rolLength + 1,
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
        type: actions.SAVE_LOADING_ROL,
        payload: false,
      });
    }
  };

export const editRol =
  (data, id, index, setShowModal) => async (dispatch, getState) => {
    try {
      debugger
      dispatch({
        type: actions.LOADING_ROL,
        payload: true,
      });
      const resp = await RolServices.editRol(id, data);
      const { roles, rolLength } = getState().rol;
      const updatedRoles = [...roles]; 
      updatedRoles[index] = resp.data;
      dispatch({
        type: actions.GET_ROL,
        payload: {
          roles: updatedRoles,
          rolLength: rolLength,
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
        type: actions.LOADING_ROL,
        payload: false,
      });
    }
  };

export const deleteRol = (data, id, index) => async (dispatch, getState) => {
  try {
    debugger
    dispatch({
      type: actions.LOADING_ROL,
      payload: true,
    });
    await RolServices.deleteRol(id, data);
    const { roles, rolLength } = getState().rol;
    const deleteRol = [...roles]
    deleteRol.splice(index, 1);
    dispatch({
      type: actions.GET_ROL,
      payload: {
        roles: deleteRol,
        rolLength: rolLength - 1,
      },
    });
    dispatch({
      type: actions.ROL_FAIL,
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
      type: actions.ROL_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_ROL,
      payload: false,
    });
  }
};
