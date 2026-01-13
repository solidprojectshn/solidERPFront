import * as actions from "./actionsType";

const initialData = {
  loading: false,
  loadingById: false,
  saveLoading: false,
  usuarioLength: 0,
  usuarios: [],
  usuario: {},
  usuarioError: "",
  formError: "",
};

export default function usuarioReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_USUARIO:      
      return { ...state, loading: action.payload };

    case actions.LOADING_USUARIO_BY_ID:
      return { ...state, loadingById: action.payload };

    case actions.SAVE_LOADING_USUARIO:
      return { ...state, saveLoading: action.payload };

    case actions.GET_USUARIO:
      return {
        ...state,
        usuarios: action.payload.usuarios,
        usuarioLength: action.payload.usuarioLength,
      };

    case actions.GET_USUARIO_BY_ID:
      return { ...state, usuario: action.payload };

    case actions.FORM_FAIL:
      return { ...state, formError: action.payload };

    case actions.USUARIO_FAIL:
      return { ...state, usuarioError: action.payload };

    default:
      return state;
  }
}
