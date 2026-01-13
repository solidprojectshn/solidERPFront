import * as actions from "./actionsType";

const initialData = {
  loading: false,
  loadingById: false,
  saveLoading: false,
  rolLength: 0,
  roles: [],
  rol: {},
  rolError: "",
  formError: "",
};

export default function RolReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_ROL:      
      return { ...state, loading: action.payload };

    case actions.LOADING_ROL_BY_ID:
      return { ...state, loadingById: action.payload };

    case actions.SAVE_LOADING_ROL:
      return { ...state, saveLoading: action.payload };

    case actions.GET_ROL:
      return {
        ...state,
        roles: action.payload.roles,
        rolLength: action.payload.rolLength,
      };

    case actions.GET_ROL_BY_ID:
      return { ...state, rol: action.payload };

    case actions.FORM_FAIL:
      return { ...state, formError: action.payload };

    case actions.ROL_FAIL:
      return { ...state, rolError: action.payload };

    default:
      return state;
  }
}
