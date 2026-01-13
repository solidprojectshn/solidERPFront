import axios from "axios";
import * as actions from "./actionsType";
import ProductTypeServices from "./ProductTypes.services"
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

export const getProductType = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_PRODUCT_TYPE,
      payload: true,
    });
    const resp = await ProductTypeServices.getProductType(filters);
    dispatch({
      type: actions.GET_PRODUCT_TYPE,
      payload: {
        productTypes: resp.data,
        productTypeLength: resp.data.length,
      },
    });
    dispatch({
      type: actions.PRODUCT_TYPE_FAIL,
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
      type: actions.PRODUCT_TYPE_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_PRODUCT_TYPE,
      payload: false,
    });
  }
};

export const getProductById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_PRODUCT_TYPE,
      payload: true,
    });
    const resp = await ProductTypeServices.getProductTypeByID(id);
    dispatch({
      type: actions.GET_PRODUCT_TYPE,
      payload: {
        productType: resp.data,
      },
    });
    dispatch({
      type: actions.PRODUCT_TYPE_FAIL,
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
      type: actions.PRODUCT_TYPE_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_PRODUCT_TYPE,
      payload: false,
    });
  }
};

export const saveProductType =
  (data, setShowModal) => async (dispatch, getState) => {
    try {
      dispatch({
        type: actions.SAVE_LOADING_PRODUCT_TYPE,
        payload: true,
      });
      const resp = await ProductTypeServices.saveProductType(data);
      const { productTypes, productTypeLength } = getState().productType;
      const _productTypes = [...productTypes, resp.data];
      dispatch({
        type: actions.GET_PRODUCT_TYPE,
        payload: {
          productTypes: _productTypes,
          productTypeLength: productTypeLength + 1,
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
        type: actions.SAVE_LOADING_PRODUCT_TYPE,
        payload: false,
      });
    }
  };

export const editProductType =
  (data, id, index, setShowModal) => async (dispatch, getState) => {
    try {
      debugger
      dispatch({
        type: actions.LOADING_PRODUCT_TYPE,
        payload: true,
      });
      const resp = await ProductTypeServices.editProductType(id, data);
      const { productTypes, productTypeLength } = getState().productType;
      const updatedProductTypes = [...productTypes]; 
      updatedProductTypes[index] = resp.data;
      dispatch({
        type: actions.GET_PRODUCT_TYPE,
        payload: {
          productTypes: updatedProductTypes,
          productTypeLength: productTypeLength,
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
        type: actions.LOADING_PRODUCT_TYPE,
        payload: false,
      });
    }
  };

export const deleteProductType = (data, id, index) => async (dispatch, getState) => {
  try {
    debugger
    dispatch({
      type: actions.LOADING_PRODUCT_TYPE,
      payload: true,
    });
    await ProductTypeServices.editProductType(id, data);
    const { productTypes, productTypeLength } = getState().productType;
    const deleteProductType = [...productTypes]
    deleteProductType.splice(index, 1);
    dispatch({
      type: actions.GET_PRODUCT_TYPE,
      payload: {
        productTypes: deleteProductType,
        productTypeLength: productTypeLength - 1,
      },
    });
    dispatch({
      type: actions.PRODUCT_TYPE_FAIL,
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
      type: actions.PRODUCT_TYPE_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_PRODUCT_TYPE,
      payload: false,
    });
  }
};
