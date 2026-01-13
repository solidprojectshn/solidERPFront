import * as actions from "./actionsType";

const initialData = {
  loading: false,
  loadingById: false,
  saveLoading: false,
  empresaLength: 0,
  empresas: [],
  empresa: {},
  empresaError: "",
  formError: "",
};

export default function EmpresaReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_EMPRESA:      
      return { ...state, loading: action.payload };

    case actions.LOADING_EMPRESA_BY_ID:
      return { ...state, loadingById: action.payload };

    case actions.SAVE_LOADING_EMPRESA:
      return { ...state, saveLoading: action.payload };

    case actions.GET_EMPRESA:
      return {
        ...state,
        empresas: action.payload.empresas,
        empresaLength: action.payload.empresaLength,
      };

    case actions.GET_EMPRESA_BY_ID:
      return { ...state, empresa: action.payload };

    case actions.FORM_FAIL:
      return { ...state, formError: action.payload };

    case actions.EMPRESA_FAIL:
      return { ...state, empresaError: action.payload };

    default:
      return state;
  }
}
