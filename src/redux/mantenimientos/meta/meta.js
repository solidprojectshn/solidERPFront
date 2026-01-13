import * as actions from "./actionsType";

const initialData = {
  loading: false,
  loadingById: false,
  saveLoading: false,
  metaLength: 0,
  metas: [],
  meta: {},
  metaError: "",
  formError: "",
};

export default function MetaReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_META:      
      return { ...state, loading: action.payload };

    //case actions.LOADING_PRODUCT_TYPE_BY_ID:
      //return { ...state, loadingById: action.payload };

    case actions.SAVE_LOADING_META:
      return { ...state, saveLoading: action.payload };

    case actions.GET_META:
      return {
        ...state,
        metas: action.payload.metas,
        metaLength: action.payload.metaLength,
      };

    //case actions.GET_PRODUCT_TYPE_BY_ID:
      //return { ...state, productType: action.payload };

    case actions.FORM_FAIL:
      return { ...state, formError: action.payload };

    case actions.META_FAIL:
      return { ...state, metaError: action.payload };

    default:
      return state;
  }
}
