import axios from "axios";
import * as actions from "./actionsType";
import AgregarStockServices from "./AgregarStock.services";
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

export const getProductoAsignado = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_ADD_STOCK,
      payload: true,
    });
    const resp = await AgregarStockServices.getProductoAsignado(filters);
    dispatch({
      type: actions.GET_ADD_STOCK,
      payload: {
        addStocks: resp.data.results,
        addStocksLength: resp.data.length,
      },
    });
    dispatch({
      type: actions.ADD_STOCK_FAIL,
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
      type: actions.ADD_STOCK_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_ADD_STOCK,
      payload: false,
    });
  }
};

export const getUnidades = (filters) => async (dispatch) => {
  try {
    dispatch({
      type: actions.LOADING_UNIDADES,
      payload: true,
    });
    const resp = await AgregarStockServices.getUnidad(filters);
    dispatch({
      type: actions.GET_UNIDADES,
      payload: {
        unidades: resp.data,
      },
    });
    dispatch({
      type: actions.ADD_STOCK_FAIL,
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
      type: actions.ADD_STOCK_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_UNIDADES,
      payload: false,
    });
  }
};
export const deleteUnidad = (data, id, index) => async (dispatch, getState) => {
  try {
    dispatch({
      type: actions.LOADING_UNIDADES,
      payload: true,
    });

    await AgregarStockServices.deleteUnidad(id, data);

    const { unidades, productoAsignado } = getState().addStock;

    // Elimina la unidad del array
    const deleteUnidades = [...unidades];
    deleteUnidades.splice(index, 1);

    dispatch({
      type: actions.GET_UNIDADES,
      payload: {
        unidades: deleteUnidades, // Ya no necesitamos 'unidadesLength'
      },
    });

    if (productoAsignado?.id) {
      await dispatch(getProductoAsignado({ id: productoAsignado.id }));
    }

    dispatch({
      type: actions.ADD_STOCK_FAIL,
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
      type: actions.ADD_STOCK_FAIL,
      payload: message,
    });
  } finally {
    dispatch({
      type: actions.LOADING_UNIDADES,
      payload: false,
    });
  }
};
export const saveAddStock =
  (dataProducto, dataUnidades, type = "tiendas") => async (dispatch) => {
    try {
      dispatch({
        type: actions.SAVE_LOADING_ADD_STOCK,
        payload: true,
      });
      debugger
      //Verificamos que las unidades no existan
      if (dataUnidades?.length > 0) {
        let numeros_serie = dataUnidades.map((item) => item.serie)
        const verify = await AgregarStockServices.verificarUnidades({
          "numeros_serie": numeros_serie
        })
        if (verify.data.exists) {
          let message = "Acción no realizada. Ya existen las siguientes unidades: "
          verify.data.numeros_serie.forEach((numero) => {
            message += numero + "\n"
          })
          toast.error(message, toastOptions);
          return
        }
      }

      const resp = await AgregarStockServices.saveAddStock(dataProducto, type);
      if (dataUnidades?.length > 0) {
        let unidades_data = []
        dataUnidades.forEach(element => {
          unidades_data.push(
            {
              numero_serie: element.serie,
              producto_asignado: resp.data.idProductoAsignado
            }
          )
        });
        await AgregarStockServices.saveAddStockUnits({
          unidades_data: unidades_data,
          id_historial_movimiento: resp.data.idHistorialMovimiento

        })
      }


      dispatch({
        type: actions.FORM_FAIL,
        payload: "",
      });
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
      toast.error(message, toastOptions);
    } finally {
      dispatch({
        type: actions.SAVE_LOADING_ADD_STOCK,
        payload: false,
      });
    }
  };

export const editAddStock =
  (dataProducto, dataUnidades, type = "tiendas") => async (dispatch) => {
    try {
      dispatch({
        type: actions.SAVE_LOADING_ADD_STOCK,
        payload: true,
      });
      debugger
      const resp = await AgregarStockServices.saveAddStock(dataProducto, type);
      if (dataUnidades?.length > 0) {
        await AgregarStockServices.editAddStockUnits({
          unidades_data: dataUnidades,
          producto_asignado: resp.data.idProductoAsignado,
          id_historial_movimiento: resp.data.idHistorialMovimiento

        })
      }
      dispatch({
        type: actions.FORM_FAIL,
        payload: "",
      });
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
      toast.error(message, toastOptions);
    } finally {
      dispatch({
        type: actions.SAVE_LOADING_ADD_STOCK,
        payload: false,
      });
    }
  };



