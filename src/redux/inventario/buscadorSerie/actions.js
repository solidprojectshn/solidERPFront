import axios from "axios";
import * as actions from "./actionsType";
import buscadorSerieServices from "./buscadorSerie.services";
import messages from "Utilities/messages";

export const getBuscadorSerie = (filters) => async (dispatch) => {
    try {
      dispatch({
        type: actions.LOADING_BUSCADOR,
        payload: true,
      });
      const resp = await buscadorSerieServices.getBuscadorSeries(filters);
      dispatch({
        type: actions.GET_BUSCADOR,
        payload: resp.data,
      });
      dispatch({
        type: actions.BUSCADOR_FAIL,
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
        type: actions.BUSCADOR_FAIL,
        payload: message,
      });
    } finally {
      dispatch({
        type: actions.LOADING_BUSCADOR,
        payload: false,
      });
    }
  };
