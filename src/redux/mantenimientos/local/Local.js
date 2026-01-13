import * as actions from "./actionsType";

const initialData = {
  loading: false,
  loadingById: false,
  saveLoading: false,
  localLength: 0,
  locales: [],
  local: {},
  localError: "",
  formError: "",
};

export default function LocalReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_LOCAL:      
      return { ...state, loading: action.payload };

    case actions.LOADING_LOCAL_BY_ID:
      return { ...state, loadingById: action.payload };

    case actions.SAVE_LOADING_LOCAL:
      return { ...state, saveLoading: action.payload };

    case actions.GET_LOCAL:
      console.log("data redux locales", action.payload.locales)
      return {
        ...state,
        locales: action.payload.locales,
        localLength: action.payload.localLength,
      };

    case actions.GET_LOCAL_BY_ID:
      return { ...state, local: action.payload };

    case actions.FORM_FAIL:
      return { ...state, formError: action.payload };

    case actions.LOCAL_FAIL:
      return { ...state, localError: action.payload };

    default:
      return state;
  }
}
