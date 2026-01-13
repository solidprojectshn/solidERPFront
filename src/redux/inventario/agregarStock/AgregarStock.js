import * as actions from "./actionsType";

const initialData = {
  loading: false,
  loadingById: false,
  saveLoading: false,
  addStockLength: 0,
  addStocks: [],
  addStock: {},
  addStockError: "",
  formError: "",
  unidades: [],
  loadingUnidades: false,
};

export default function AddStockReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_ADD_STOCK:      
      return { ...state, loading: action.payload };

    case actions.LOADING_ADD_STOCK_BY_ID:
      return { ...state, loadingById: action.payload };

    case actions.SAVE_LOADING_ADD_STOCK:
      return { ...state, saveLoading: action.payload };

    case actions.GET_ADD_STOCK:
      return {
        ...state,
        addStocks: action.payload.addStocks,
        addStockLength: action.payload.addStockLength,
      };

    case actions.GET_ADD_STOCK_BY_ID:
      return { ...state, addStock: action.payload };

    case actions.FORM_FAIL:
      return { ...state, formError: action.payload };

    case actions.ADD_STOCK_FAIL:
      return { ...state, addStockError: action.payload };

    case actions.GET_UNIDADES:
      return { ...state, unidades: action.payload.unidades};
    case actions.LOADING_UNIDADES:
      return {...state, loadingUnidades: action.payload};

    default:
      return state;
  }
}
