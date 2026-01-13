import * as actions from "./actionsType";

const initialData = {
  loading: false,
  loadingById: false,
  saveLoading: false,
  permisosLength: 0,
  permisos: [],
  permiso: {},
  permisosError: "",
  permisosByIdError: "",
  formError: "",
};

export default function PermisosReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_PERMISOS:
      return { ...state, loading: action.payload };

    case actions.LOADING_PERMISOS_BY_ID:
      return { ...state, loadingById: action.payload };

    case actions.SAVE_LOADING_PERMISOS:
      return { ...state, saveLoading: action.payload };

    case actions.GET_PERMISOS:
      return {
        ...state,
        permisos: action.payload.permisos,
        permisosLength: action.payload.permisosLength,
      };

    case actions.GET_PERMISOS_BY_ID:
      return { ...state, permiso: action.payload };

    case actions.FORM_FAIL:
      return { ...state, formError: action.payload };

    case actions.PERMISOS_FAIL:
      return { ...state, permisosError: action.payload };
    case actions.PERMISOS_BY_ID_FAIL:
      return { ...state, permisosByIdError: action.payload };


    default:
      return state;
  }
}
