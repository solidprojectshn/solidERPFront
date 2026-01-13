import axios from "axios";
import * as actions from "./actionsType";
import EmpresaServices from "./Empresa.services"
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

export const getInfoEmpresa = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_EMPRESA,
      payload: true,
    });
    const resp = await EmpresaServices.getInfoEmpresa(filters);
    console.log('Respuesta de la API:', resp.data);
    dispatch({
      type: actions.GET_EMPRESA,
      payload: {
        empresas: resp.data,
        empresaLength: resp.data.length,
      },
    });
    dispatch({
      type: actions.EMPRESA_FAIL,
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
      type: actions.EMPRESA_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_EMPRESA,
      payload: false,
    });
  }
};

export const getInfoEmpresaById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_EMPRESA,
      payload: true,
    });
    const resp = await EmpresaServices.getInfoEmpresaByID(id);
    dispatch({
      type: actions.GET_EMPRESA,
      payload: {
        empresa: resp.data,
      },
    });
    dispatch({
      type: actions.EMPRESA_FAIL,
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
      type: actions.EMPRESA_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_EMPRESA,
      payload: false,
    });
  }
};

export const saveInfoEmpresa =
  (data, setShowModal) => async (dispatch, getState) => {
    try {
      dispatch({
        type: actions.SAVE_LOADING_EMPRESA,
        payload: true,
      });
      const resp = await EmpresaServices.saveInfoEmpresa(data);
      const { empresas, empresaLength } = getState().empresa;
      const _empresas = [...empresas, resp.data];
      dispatch({
        type: actions.GET_EMPRESA,
        payload: {
          empresas: _empresas,
          empresaLength: empresaLength + 1,
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
        type: actions.SAVE_LOADING_EMPRESA,
        payload: false,
      });
    }
  };

export const editInfoEmpresa =
  (data, id, index, setShowModal) => async (dispatch, getState) => {
    try {
      debugger
      dispatch({
        type: actions.LOADING_EMPRESA,
        payload: true,
      });
      const resp = await EmpresaServices.editInfoEmpresa(id, data);
      const { empresas, empresaLength } = getState().empresa;
      const updatedEmpresas = [...empresas]; 
      updatedEmpresas[0] = resp.data;
      dispatch({
        type: actions.GET_EMPRESA,
        payload: {
          empresas: updatedEmpresas,
          empresaLength: empresaLength,
        },
      });
      console.log("Actualización Empresas:", updatedEmpresas);
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
        type: actions.LOADING_EMPRESA,
        payload: false,
      });
    }
  };

export const deleteInfoEmpresa = (data, id, index) => async (dispatch, getState) => {
  try {
    debugger
    dispatch({
      type: actions.LOADING_EMPRESA,
      payload: true,
    });
    await EmpresaServices.editInfoEmpresa(id, data);
    const { empresas, empresaLength } = getState().empresa;
    const deleteEmpresa = [...empresas]
    deleteEmpresa.splice(index, 1);
    dispatch({
      type: actions.GET_EMPRESA,
      payload: {
        empresas: deleteEmpresa,
        empresaLength: empresaLength - 1,
      },
    });
    dispatch({
      type: actions.EMPRESA_FAIL,
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
      type: actions.EMPRESA_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_EMPRESA,
      payload: false,
    });
  }
};
