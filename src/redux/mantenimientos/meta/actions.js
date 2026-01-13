import axios from "axios";
import * as actions from "./actionsType";
import MetaServices from "./meta.services"
import messages from "../../../Utilities/messages";
import { toast } from 'react-toastify';
import metaServices from "./meta.services";

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


export const getMeta = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_META,
      payload: true,
    });
    const resp = await MetaServices.getMeta(filters);
    dispatch({
      type: actions.GET_META,
      payload: {
        metas: resp.data,
        metaLength: resp.data.length,
      },
    });
    dispatch({
      type: actions.META_FAIL,
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
      type: actions.META_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_META,
      payload: false,
    });
  }
};

export const saveMeta =
  (data, setShowModal) => async (dispatch, getState) => {
    try {
      dispatch({
        type: actions.SAVE_LOADING_META,
        payload: true,
      });
      const resp = await metaServices.saveMeta(data);
      const { metas, metaLength } = getState().metas;
      const _metas = [...metas, resp.data];
      dispatch({
        type: actions.GET_META,
        payload: {
          metas: _metas,
          metaLength: metaLength + 1,
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
        type: actions.SAVE_LOADING_META,
        payload: false,
      });
    }
  };

export const editMeta =
  (data, id, index, setShowModal) => async (dispatch, getState) => {
    try {
      dispatch({
        type: actions.LOADING_META,
        payload: true,
      });
      const resp = await metaServices.editMeta(id, data);
      const { metas, metaLength } = getState().metas;
      const updatedMetas = [...metas]; 
      updatedMetas[index] = resp.data;
      dispatch({
        type: actions.GET_META,
        payload: {
          metas: updatedMetas,
          metaLength: metaLength,
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
        type: actions.LOADING_META,
        payload: false,
      });
    }
  };

  export const deleteMeta = (data, id, index) => async (dispatch, getState) => {
    try {
      dispatch({
        type: actions.LOADING_META,
        payload: true,
      });
      await metaServices.editMeta(id, data);
      const { metas, metaLength } = getState().metas;
      const deleteMeta = [...metas]
      deleteMeta.splice(index, 1);
      dispatch({
        type: actions.GET_META,
        payload: {
          metas: deleteMeta,
          metaLength: metaLength - 1,
        },
      });
      dispatch({
        type: actions.META_FAIL,
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
        type: actions.META_FAIL,
        payload: message,
      });
    } finally {
      dispatch({
        type: actions.LOADING_META,
        payload: false,
      });
    }
  };
    

  