import * as actions from "./actionsType";

const initialData = {
  loading: false,
  loadingById: false,
  saveLoading: false,
  productTypeLength: 0,
  productTypes: [],
  productType: {},
  productTypeError: "",
  formError: "",
};

export default function ProductTypeReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_PRODUCT_TYPE:      
      return { ...state, loading: action.payload };

    case actions.LOADING_PRODUCT_TYPE_BY_ID:
      return { ...state, loadingById: action.payload };

    case actions.SAVE_LOADING_PRODUCT_TYPE:
      return { ...state, saveLoading: action.payload };

    case actions.GET_PRODUCT_TYPE:
      return {
        ...state,
        productTypes: action.payload.productTypes,
        productTypeLength: action.payload.productTypeLength,
      };

    case actions.GET_PRODUCT_TYPE_BY_ID:
      return { ...state, productType: action.payload };

    case actions.FORM_FAIL:
      return { ...state, formError: action.payload };

    case actions.PRODUCT_TYPE_FAIL:
      return { ...state, productTypeError: action.payload };

    default:
      return state;
  }
}
