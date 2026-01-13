import axios from "axios";
import * as actions from "./actionsType";
import existenciasServices from "./existencias.services";
import messages from "Utilities/messages";

export const getExistencias = (filters) => async (dispatch) => {
    try {
      dispatch({
        type: actions.LOADING_EXISTENCIAS,
        payload: true,
      });
      const resp = await existenciasServices.getExistencias(filters);
      dispatch({
        type: actions.GET_EXISTENCIAS,
        payload: {
          existencias: resp.data.results,
          existenciasLength: resp.data.total_count,
          mayorStock: resp.data.mayor_stock,
          menorStock: resp.data.menor_stock,
        },
      });
      dispatch({
        type: actions.EXISTENCIAS_FAIL,
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
        type: actions.EXISTENCIAS_FAIL,
        payload: message,
      });
    } finally {
      dispatch({
        type: actions.LOADING_EXISTENCIAS,
        payload: false,
      });
    }
  };


  export const getExistenciasEmpleados = (filters) => async (dispatch) => {
    try {
      dispatch({
        type: actions.LOADING_EXISTENCIAS,
        payload: true,
      });
      const resp = await existenciasServices.getExistenciasEmpleados(filters);
      dispatch({
        type: actions.GET_EXISTENCIAS,
        payload: {
          existencias: resp.data,
          existenciasLength: resp.data.length,
        },
      });
      dispatch({
        type: actions.EXISTENCIAS_FAIL,
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
        type: actions.EXISTENCIAS_FAIL,
        payload: message,
      });
    } finally {
      dispatch({
        type: actions.LOADING_EXISTENCIAS,
        payload: false,
      });
    }
  };