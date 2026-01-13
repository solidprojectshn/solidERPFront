import * as actions from "./actionsType";

const initialData = {
  loading: false,
  loadingById: false,
  saveLoading: false,
  tipoLocalLength: 0,
  tipoLocales: [],
  tipoLocal: {}, 
  tipoLocalError: "",
  formError: "",
};

export default function TipoLocalReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_TIPO_LOCAL:      
      return { ...state, loading: action.payload };

    case actions.LOADING_TIPO_LOCAL_BY_ID:
      return { ...state, loadingById: action.payload };

    case actions.SAVE_LOADING_TIPO_LOCAL:
      return { ...state, saveLoading: action.payload };

    case actions.GET_TIPO_LOCAL:
      return {
        ...state,
        tipoLocales: action.payload.tipoLocales,
        tipoLocalLength: action.payload.tipoLocalLength,
      };

    case actions.GET_TIPO_LOCAL_BY_ID:
      return { ...state, tipoLocal: action.payload };

    case actions.FORM_FAIL:
      return { ...state, formError: action.payload };

    case actions.TIPO_LOCAL_FAIL:
      return { ...state, tipoLocalError: action.payload };

    default:
      return state;
  }
}
