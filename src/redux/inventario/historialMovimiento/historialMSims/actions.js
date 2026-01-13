import axios from "axios";
import * as actions from "./actionsType";
import historialmovServices from "./historialmov.services";
import messages from "../../../Utilities/messages"

export const getHistorialM = (filters) => async (dispatch) => {
    try {
      dispatch({
        type: actions.LOADING_HISTORIAL_MOVIMIENTO,
        payload: true,
      });
      const resp = await historialmovServices.getHistorial(filters);
      dispatch({
        type: actions.GET_HISTORIAL_MOVIMIENTO,
        payload: {
          historialM: resp.data,
          historialMLength: resp.data.length,
        },
      });
      dispatch({
        type: actions.HISTORIAL_MOVIMIENTO_FAIL,
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
        type: actions.HISTORIAL_MOVIMIENTO_FAIL,
        payload: message,
      });
    } finally {
      dispatch({
        type: actions.LOADING_HISTORIAL_MOVIMIENTO,
        payload: false,
      });
    }
  };
