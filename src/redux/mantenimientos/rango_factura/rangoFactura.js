import * as actions from "./actionsType";

const initialData = {
  loading: false,
  loadingById: false,
  saveLoading: false,
  rangoFacturaLength: 0,
  rangoFacturas: [],
  rangoFactura: {},
  rangoFacturaError: "",
  formError: "",
};

export default function rangoFacturaReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_RANGO_FACTURA:      
      return { ...state, loading: action.payload };

    case actions.LOADING_RANGO_FACTURA_BY_ID:
      return { ...state, loadingById: action.payload };

    case actions.SAVE_LOADING_RANGO_FACTURA:
      return { ...state, saveLoading: action.payload };

    case actions.GET_RANGO_FACTURA:
      return {
        ...state,
        rangoFacturas: action.payload.rangoFacturas,
        rangoFacturaLength: action.payload.rangoFacturaLength,
      };

    case actions.GET_RANGO_FACTURA_BY_ID:
      return { ...state, rangoFactura: action.payload };

    case actions.FORM_FAIL:
      return { ...state, formError: action.payload };

    case actions.RANGO_FACTURA_FAIL:
      return { ...state, rangoFacturaError: action.payload };

    default:
      return state;
  }
}