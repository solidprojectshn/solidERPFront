import axios from "axios";
import * as actions from "./actionsType";
import rangoFacturaServices from "./rangoFactura.Services";
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

export const getRangoFactura = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_RANGO_FACTURA,
      payload: true,
    });
    const resp = await rangoFacturaServices.getRangoFactura(filters);
    dispatch({
      type: actions.GET_RANGO_FACTURA,
      payload: {
        rangoFacturas: resp.data,
        rangoFacturaLength: resp.data.length,
      },
    });
    dispatch({
      type: actions.RANGO_FACTURA_FAIL,
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
      type: actions.RANGO_FACTURA_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_RANGO_FACTURA,
      payload: false,
    });
  }
};

export const geRangoFacturaById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_RANGO_FACTURA,
      payload: true,
    });
    const resp = await rangoFacturaServices.getRangoFacturaByID(id);
    dispatch({
      type: actions.GET_RANGO_FACTURA,
      payload: {
        rangoFactura: resp.data,
      },
    });
    dispatch({
      type: actions.GET_RANGO_FACTURA,
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
      type: actions.RANGO_FACTURA_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_RANGO_FACTURA,
      payload: false,
    });
  }
};

export const saveRangoFactura =
  (data, setShowModal) => async (dispatch, getState) => {
    try {
      dispatch({
        type: actions.SAVE_LOADING_RANGO_FACTURA,
        payload: true,
      });
      const resp = await rangoFacturaServices.saveRangoFactura(data);
      const { rangoFacturas, rangoFacturaLength } = getState().rangoFactura; //redux
      const _rangoFacturas = [...rangoFacturas, resp.data];
      dispatch({
        type: actions.GET_RANGO_FACTURA,
        payload: {
          rangoFacturas: _rangoFacturas,
          rangoFacturaLength: rangoFacturaLength + 1,
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
        type: actions.SAVE_LOADING_RANGO_FACTURA,
        payload: false,
      });
    }
  };

export const editRangoFactura =
  (data, id, index, setShowModal) => async (dispatch, getState) => {
    try {
      debugger
      dispatch({
        type: actions.LOADING_RANGO_FACTURA,
        payload: true,
      });
      const resp = await rangoFacturaServices.editRangoFactura(id, data);
      const { rangoFacturas, rangoFacturaLength } = getState().rangoFactura; //store
      const updatedRangoFacturas = [...rangoFacturas]; 
      updatedRangoFacturas[index] = resp.data;
      dispatch({
        type: actions.GET_RANGO_FACTURA,
        payload: {
          rangoFacturas: updatedRangoFacturas,
          rangoFacturaLength: rangoFacturaLength,
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
        type: actions.LOADING_RANGO_FACTURA,
        payload: false,
      });
    }
  };

export const deleteRangoFactura = (data, id, index) => async (dispatch, getState) => {
  try {
    dispatch({
      type: actions.LOADING_RANGO_FACTURA,
      payload: true,
    });
    await rangoFacturaServices.editRangoFactura(id, data);
    const { rangoFacturas, rangoFacturaLength } = getState().rangoFactura;//store
    const deleteRangoFactura = [...rangoFacturas]
    deleteRangoFactura.splice(index, 1);
    dispatch({
      type: actions.GET_RANGO_FACTURA,
      payload: {
        rangoFacturas: deleteRangoFactura,
        rangoFacturaLength: rangoFacturaLength - 1,
      },
    });
    dispatch({
      type: actions.RANGO_FACTURA_FAIL,
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
      type: actions.RANGO_FACTURA_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_RANGO_FACTURA,
      payload: false,
    });
  }
};
