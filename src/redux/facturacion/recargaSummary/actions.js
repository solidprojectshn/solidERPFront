import axios from "axios";
import * as actions from "./actionsType";
import recargasSummaryServices from "./recargasSummary.services";
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

export const getRecargaSummary = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_RECARGA_SUMMARY,
      payload: true,
    });
    const resp = await recargasSummaryServices.getRecargaSummary(filters);
    dispatch({
      type: actions.GET_RECARGA_SUMMARY,
      payload: resp.data,
    });
    dispatch({
      type: actions.RECARGA_SUMMARY_FAIL,
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
      type: actions.RECARGA_SUMMARY_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_RECARGA_SUMMARY,
      payload: false,
    });
  }
};
