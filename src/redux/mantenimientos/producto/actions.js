import axios from "axios";
import * as actions from "./actionsType";
import ProductoServices from "./Producto.services"
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

export const getProducto = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_PRODUCTO,
      payload: true,
    });
    const resp = await ProductoServices.getProducto(filters);
    dispatch({
      type: actions.GET_PRODUCTO,
      payload: {
        productos: resp.data,
        productoLength: resp.data.length,
      },
    });
    dispatch({
      type: actions.PRODUCTO_FAIL,
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
      type: actions.PRODUCTO_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_PRODUCTO,
      payload: false,
    });
  }
};

export const getProductById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_PRODUCTO,
      payload: true,
    });
    const resp = await ProductoServices.getProductoByID(id);
    dispatch({
      type: actions.GET_PRODUCTO,
      payload: {
        producto: resp.data,
      },
    });
    dispatch({
      type: actions.PRODUCTO_FAIL,
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
      type: actions.PRODUCTO_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_PRODUCTO,
      payload: false,
    });
  }
};

export const saveProducto =
  (data, setShowModal) => async (dispatch, getState) => {
    try {
      dispatch({
        type: actions.SAVE_LOADING_PRODUCTO,
        payload: true,
      });
      const resp = await ProductoServices.saveProducto(data);
      const { productos, productoLength } = getState().producto;
      const _productos = [...productos, resp.data];
      dispatch({
        type: actions.GET_PRODUCTO,
        payload: {
          productos: _productos,
          productoLength: productoLength + 1,
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
        type: actions.SAVE_LOADING_PRODUCTO,
        payload: false,
      });
    }
  };

export const editProducto =
  (data, id, index, setShowModal) => async (dispatch, getState) => {
    try {
      debugger
      dispatch({
        type: actions.LOADING_PRODUCTO,
        payload: true,
      });
      const resp = await ProductoServices.editProducto(id, data);
      const { productos, productoLength } = getState().producto;
      const updatedProductos = [...productos]; 
      updatedProductos[index] = resp.data;
      dispatch({
        type: actions.GET_PRODUCTO,
        payload: {
          productos: updatedProductos,
          productoLength: productoLength,
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
        type: actions.LOADING_PRODUCTO,
        payload: false,
      });
    }
  };

export const deleteProducto = (data, id, index) => async (dispatch, getState) => {
  try {
    dispatch({
      type: actions.LOADING_PRODUCTO,
      payload: true,
    });
    await ProductoServices.editProducto(id, data);
    const { productos, productoLength } = getState().producto;
    const deleteProducto = [...productos]
    deleteProducto.splice(index, 1);
    dispatch({
      type: actions.GET_PRODUCTO,
      payload: {
        productos: deleteProducto,
        productoLength: productoLength - 1,
      },
    });
    dispatch({
      type: actions.PRODUCTO_FAIL,
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
      type: actions.PRODUCTO_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_PRODUCTO,
      payload: false,
    });
  }
};
