import axios from "axios";
import * as actions from "./actionsType"; // aquí irían las QZ constants
import QZServices from "./QZServices";
import messages from "../../../Utilities/messages";
import { toast } from "react-toastify";

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

export const getQZCertificate = () => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_QZ_CERTIFICATE,
      payload: true,
    });

    const resp = await QZServices.getCertificate(); // llamado al endpoint de certificado
    dispatch({
      type: actions.SAVE_QZ_CERTIFICATE,
      payload: resp.data, // asumiendo que retorna { certificate: "...", signature: "..." }
    });

    dispatch({
      type: actions.QZ_CERTIFICATE_FAIL,
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
      type: actions.QZ_CERTIFICATE_FAIL,
      payload: message,
    });

    toast.error(message, toastOptions);
  } finally {
    dispatch({
      type: actions.LOADING_QZ_CERTIFICATE,
      payload: false,
    });
  }
};
