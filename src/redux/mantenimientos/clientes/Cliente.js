import * as actions from "./actionsType";

const initialData = {
  loading: false,
  loadingById: false,
  saveLoading: false,
  clienteLength: 0,
  clientes: [],
  cliente: {},
  clienteError: "",
  formError: "",
};

export default function ClienteReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_CLIENTE:      
      return { ...state, loading: action.payload };

    case actions.LOADING_CLIENTE_BY_ID:
      return { ...state, loadingById: action.payload };

    case actions.SAVE_LOADING_CLIENTE:
      return { ...state, saveLoading: action.payload };

    case actions.GET_CLIENTE:
      return {
        ...state,
        clientes: action.payload.clientes,
        clienteLength: action.payload.clienteLength,
      };

    case actions.GET_CLIENTE_BY_ID:
      return { ...state, cliente: action.payload };

    case actions.FORM_FAIL:
      return { ...state, formError: action.payload };

    case actions.CLIENTE_FAIL:
      return { ...state, clienteError: action.payload };

    default:
      return state;
  }
}
