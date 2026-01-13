import * as actions from "./actionsType";

const initialData = {
  loading: false,
  loadingById: false,
  saveLoading: false,  
  ventaLength: 0,
  ventas: [],
  venta: {},
  tipoVenta: {},
  ventaError: "",
  ventaByIdError: "",
  tipoVentaError: "",
  formError: "",
  numFactura: {},
  loadingTipoVenta: false,
  loadingNumFactura: false,
  numFacturaError: "",
  saveLoadingCuota: false,
  cuotaError: "",
};

export default function VentasReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_VENTA:
      return { ...state, loading: action.payload };

    case actions.LOADING_VENTA_BY_ID:
      return { ...state, loadingById: action.payload };

    case actions.SAVE_LOADING_VENTA:
      return { ...state, saveLoading: action.payload };

    case actions.GET_VENTA:
      return {
        ...state,
        ventas: action.payload.ventas,
        ventaLength: action.payload.ventaLength,
      };

    case actions.GET_VENTA_BY_ID:
      return { ...state, venta: action.payload };

    case actions.FORM_FAIL:
      return { ...state, formError: action.payload };

    case actions.VENTA_FAIL:
      return { ...state, ventaError: action.payload };

    case actions.VENTA_BY_ID_FAIL:
      return { ...state, ventaByIdError: action.payload };

    case actions.GET_NUM_FACTURA:
      return { ...state, numFactura: action.payload };
      
    case actions.LOADING_NUM_FACTURA:
      return {...state, loadingNumFactura: action.payload };
      
    case actions.NUM_FACTURA_FAIL:
      return {...state, numFacturaError: action.payload };
      
    case actions.GET_TIPO_VENTA:
      return {...state, tipoVenta: action.payload};
      
    case actions.LOADING_TIPO_VENTA:
      return {...state, loadingTipoVenta: action.payload };
      
    case actions.TIPO_VENTA_FAIL:
      return {...state, tipoVentaError: action.payload };
      
   
      
    default:
      return state;
  }
}
