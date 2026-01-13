import axios from "axios";
import * as actions from "./actionsType";
import UsuarioServices from "./Usuario.services"
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

export const getUsuario = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_USUARIO,
      payload: true,
    });
    const resp = await UsuarioServices.getUser(filters);
    dispatch({
      type: actions.GET_USUARIO,
      payload: {
        usuarios: resp.data,
        usuarioLength: resp.data.length,
      },
    });
    dispatch({
      type: actions.USUARIO_FAIL,
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
      type: actions.USUARIO_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_USUARIO,
      payload: false,
    });
  }
};

export const getUsuarioById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_USUARIO,
      payload: true,
    });
    const resp = await UsuarioServices.getUserByID(id);
    dispatch({
      type: actions.GET_USUARIO,
      payload: {
        usuario: resp.data,
      },
    });
    dispatch({
      type: actions.USUARIO_FAIL,
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
      type: actions.USUARIO_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_USUARIO,
      payload: false,
    });
  }
};

export const saveUsuario =
  (data, setShowModal) => async (dispatch, getState) => {
    try {
      debugger
      dispatch({
        type: actions.SAVE_LOADING_USUARIO,
        payload: true,
      });
      const resp = await UsuarioServices.saveUser(data);
      const { usuarios, usuarioLength } = getState().usuario;
      const _usuarios = [...usuarios, resp.data];
      dispatch({
        type: actions.GET_USUARIO,
        payload: {
          usuarios: _usuarios,
          usuarioLength: usuarioLength + 1,
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
        type: actions.SAVE_LOADING_USUARIO,
        payload: false,
      });
    }
  };

export const editUsuario =
  (data, id, index, setShowModal) => async (dispatch, getState) => {
    try {
      debugger
      dispatch({
        type: actions.LOADING_USUARIO,
        payload: true,
      });
      const resp = await UsuarioServices.editUser(id, data);
      const { usuarios, usuarioLength } = getState().usuario;
      const updatedUsuarios = [...usuarios]; 
      updatedUsuarios[index] = resp.data;
      dispatch({
        type: actions.GET_USUARIO,
        payload: {
          usuarios: updatedUsuarios,
          usuarioLength: usuarioLength,
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
        type: actions.LOADING_USUARIO,
        payload: false,
      });
    }
  };

export const deleteUsuario = (id, index) => async (dispatch, getState) => {
  try {
    debugger
    dispatch({
      type: actions.LOADING_USUARIO,
      payload: true,
    });
    await UsuarioServices.deleteUser(id);
    const { usuarios, usuarioLength } = getState().usuario;
    const deleteUsuario = [...usuarios]
    deleteUsuario.splice(index, 1);
    dispatch({
      type: actions.GET_USUARIO,
      payload: {
        usuarios: deleteUsuario,
        usuarioLength: usuarioLength - 1,
      },
    });
    dispatch({
      type: actions.USUARIO_FAIL,
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
      type: actions.USUARIO_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_USUARIO,
      payload: false,
    });
  }
};
