import axios from "axios";
import * as actions from "./actionsType";
import messages from "../../../Utilities/messages"
import { toast } from 'react-toastify';
import EmpleadoServices from "./Empleado.services";

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

export const getEmpleado = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_EMPLEADO,
      payload: true,
    });
    const resp = await EmpleadoServices.getEmpleado(filters);
    dispatch({
      type: actions.GET_EMPLEADO,
      payload: {
        empleados: resp.data,
        empleadoLength: resp.data.length,
      },
    });
    dispatch({
      type: actions.EMPLEADO_FAIL,
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
      type: actions.EMPLEADO_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_EMPLEADO,
      payload: false,
    });
  }
};

export const getEmpleadoById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_EMPLEADO,
      payload: true,
    });
    const resp = await EmpleadoServices.getEmpleadoByID(id);
    dispatch({
      type: actions.GET_EMPLEADO,
      payload: {
        empleado: resp.data,
      },
    });
    dispatch({
      type: actions.EMPLEADO_FAIL,
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
      type: actions.EMPLEADO_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_EMPLEADO,
      payload: false,
    });
  }
};

export const saveEmpleado =
  (data, setShowModal) => async (dispatch, getState) => {
    try {
      dispatch({
        type: actions.SAVE_LOADING_EMPLEADO,
        payload: true,
      });
      const resp = await EmpleadoServices.saveEmpleado(data);
      const { empleados, empleadoLength } = getState().empleado;
      const _empleados = [...empleados, resp.data];
      dispatch({
        type: actions.GET_EMPLEADO,
        payload: {
          empleados: _empleados,
          empleadoLength: empleadoLength + 1,
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
        type: actions.SAVE_LOADING_EMPLEADO,
        payload: false,
      });
    }
  };

export const editEmpleado =
  (data, id, index, setShowModal) => async (dispatch, getState) => {
    try {
      dispatch({
        type: actions.LOADING_EMPLEADO,
        payload: true,
      });
      const resp = await EmpleadoServices.editEmpleado(id, data);
      const { empleados, empleadoLength } = getState().empleado;
      const updatedEmpleados = [...empleados]; 
      updatedEmpleados[index] = resp.data;
      dispatch({
        type: actions.GET_EMPLEADO,
        payload: {
          empleados: updatedEmpleados,
          empleadoLength: empleadoLength,
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
        type: actions.LOADING_EMPLEADO,
        payload: false,
      });
    }
  };

export const deleteEmpleado = (data, id, index) => async (dispatch, getState) => {
  try {
    debugger
    dispatch({
      type: actions.LOADING_EMPLEADO,
      payload: true,
    });
    await EmpleadoServices.editEmpleado(id, data);
    const { empleados, empleadoLength } = getState().empleado;
    const deleteEmpleados = [...empleados]
    deleteEmpleados.splice(index, 1);
    dispatch({
      type: actions.GET_EMPLEADO,
      payload: {
        empleados: deleteEmpleados,
        empleadoLength: empleadoLength - 1,
      },
    });
    dispatch({
      type: actions.EMPLEADO_FAIL,
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
      type: actions.EMPLEADO_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_EMPLEADO,
      payload: false,
    });
  }
};
