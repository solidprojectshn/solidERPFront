import axios from "axios";
import * as actions from "./actionsType";
import tipoVentaServices from "./tipoVenta.services";
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

export const getTipoVenta = (filters) => async (dispatch) => {
    try {
        dispatch({
            type : actions.LOADING_TIPO_VENTA,
            payload : true,
        });
        const resp = await tipoVentaServices.getTipoVenta(filters);
        console.log("Data de la API:", resp.data);
        console.log("Payload a dispatch:", {
            tipoVentas : resp.data,
            tipoVentaLength : resp.data.length,
        });
        dispatch({
            type : actions.GET_TIPO_VENTA,
            payload : {
                tipoVentas : resp.data,
                tipoVentaLength : resp.data.length,
            },
        });
        dispatch({
            type: actions.TIPO_VENTA_FAIL,
            payload : "",
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
                    default:
                        message = ex.response.data;
                        break;
                }
            } else {
                ex.message === "Network Error" ? messages.message_network_error : ex.message;
            }
        } else {
            ex.message === "Network Error" ? messages.message_network_error : ex.message;
        }
        dispatch({
            type : actions.TIPO_VENTA_FAIL,
            payload : message,
        });
    } finally {
        dispatch({
            type : actions.LOADING_TIPO_VENTA,
            payload : false,
        });
    }
};

export const saveTipoVenta = 
    (data, setShowModal) => async (dispatch, getState) => {
    try {
        dispatch({
            type : actions.SAVE_LOADING_VENTA,
            payload : true,
        });

        const resp = await tipoVentaServices.saveTipoVenta(data);
        const { tipoVentas, tipoVentaLength } = getState().tipoVenta;
        const __tipoVentas = [ ...tipoVentas,resp.data];
        dispatch({
            type : actions.GET_TIPO_VENTA,
            payload : {
                tipoVentas : __tipoVentas,
                tipoVentaLength : tipoVentaLength + 1,
            },
        });
        dispatch({
            type : actions.FORM_FAIL,
            payload : "",
        });
        setShowModal(false);
        toast.success(messages.message_exito_guardado, toastOptions)
    } catch (ex) {
        let message = null;
        if (axios.isAxiosError(ex)) {
            if (ex.response?.status) {
                switch (ex.response.status) {
                    case 400:
                        message = messages.message_400 + "" + ex.response.statusText;
                        break;
                    case 404 :
                        message = messages.message_404 + "" + ex.response.statusText;
                        break;
                    case 500:
                        message = messages.message_500 + "" + ex.response.statusText;
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
            type : actions.FORM_FAIL,
            payload : message,
        });
    } finally {
        dispatch({
            type : actions.SAVE_LOADING_VENTA,
            payload : false,
        });
    }

}       