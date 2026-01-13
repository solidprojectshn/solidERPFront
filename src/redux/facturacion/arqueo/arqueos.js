import * as actions from "./actionsType";

const initialData = {
  loading: false,
  loadingById: false,
  saveLoading: false,
  arqueoLength: 0,
  arqueos: [],
  arqueo: {},
  arqueoError: "",
  arqueoByIdError: "",
  formError: "",
  resumenMetodoPago: {},
  loadingResumenMetodoPago: false,
  resumenMetodoPagoError: "",
 
  denominaciones: {},
  loadingDenominaciones: false,
  denominacionesPagoError: ""
};

export default function ArqueosReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_ARQUEO:
      return { ...state, loading: action.payload };

    case actions.LOADING_ARQUEO_BY_ID:
      return { ...state, loadingById: action.payload };

    case actions.SAVE_LOADING_ARQUEO:
      return { ...state, saveLoading: action.payload };

    case actions.GET_ARQUEO:
      return {
        ...state,
        arqueos: action.payload.arqueos,
        arqueoLength: action.payload.arqueoLength,
      };

    case actions.GET_ARQUEO_BY_ID:
      return { ...state, arqueo: action.payload };

    case actions.FORM_FAIL:
      return { ...state, formError: action.payload };

    case actions.ARQUEO_FAIL:
      return { ...state, arqueoError: action.payload };

    case actions.ARQUEO_BY_ID_FAIL:
      return { ...state, arqueoByIdError: action.payload };

    case actions.GET_RESUMEN_METODO_PAGO:
      return { ...state, resumenMetodoPago: action.payload };

    case actions.LOADING_RESUMEN_METODO_PAGO:
      return { ...state, loadingResumenMetodoPago: action.payload };

    case actions.RESUMEN_METODO_PAGO_FAIL:
      return { ...state, resumenMetodoPagoError: action.payload };



   
    case actions.GET_DENOMINACION:
      return { ...state, denominaciones: action.payload };

    case actions.LOADING_DENOMINACION:
      return { ...state, loadingDenominaciones: action.payload };

    case actions.DENOMINACION_FAIL:
      return { ...state, denominacionesError: action.payload };


    default:
      return state;
  }
}
