import * as actions from "./actionsType";

const initialData = {
  loading: false,
  loadingById: false,
  saveLoading: false,
  metodoPagoLength: 0,
  metodosPago: [],
  metodoPago: {},
  metodoPagoError: "",
  formError: "",
};

export default function MetodoPagoReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_METODO_PAGO:      
      return { ...state, loading: action.payload };

    case actions.LOADING_METODO_PAGO_BY_ID:
      return { ...state, loadingById: action.payload };

    case actions.SAVE_LOADING_METODO_PAGO:
      return { ...state, saveLoading: action.payload };

    case actions.GET_METODO_PAGO:
      return {
        ...state,
        metodosPago: action.payload.metodosPago,
        metodoPagoLength: action.payload.metodoPagoLength,
      };

    case actions.GET_METODO_PAGO_BY_ID:
      return { ...state, metodoPago: action.payload };

    case actions.FORM_FAIL:
      return { ...state, formError: action.payload };

    case actions.METODO_PAGO_FAIL:
      return { ...state, metodoPagoError: action.payload };

    default:
      return state;
  }
}
