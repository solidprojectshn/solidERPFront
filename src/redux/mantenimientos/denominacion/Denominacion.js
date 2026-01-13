import * as actions from "./actionsType";

const initialData = {
  loading: false,
  loadingById: false,
  saveLoading: false,
  denominacionLength: 0,
  denominaciones: [],
  denominacion: {},
  denominacionError: "",
  formError: "",
};

export default function DenominacionReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_DENOMINACION:      
      return { ...state, loading: action.payload };

    case actions.LOADING_DENOMINACION_BY_ID:
      return { ...state, loadingById: action.payload };

    case actions.SAVE_LOADING_DENOMINACION:
      return { ...state, saveLoading: action.payload };

    case actions.GET_DENOMINACION:
      return {
        ...state,
        denominaciones: action.payload.denominaciones,
        denominacionLength: action.payload.denominacionLength,
      };

    case actions.GET_DENOMINACION_BY_ID:
      return { ...state, denominacion: action.payload };

    case actions.FORM_FAIL:
      return { ...state, formError: action.payload };

    case actions.DENOMINACION_FAIL:
      return { ...state, denominacionError: action.payload };

    default:
      return state;
  }
}
