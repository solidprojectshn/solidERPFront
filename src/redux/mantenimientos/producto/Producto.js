import * as actions from "./actionsType";

const initialData = {
  loading: false,
  loadingById: false,
  saveLoading: false,
  productoLength: 0,
  productos: [],
  producto: {},
  productoError: "",
  formError: "",
};

export default function ProductoReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_PRODUCTO:      
      return { ...state, loading: action.payload };

    case actions.LOADING_PRODUCTO_BY_ID:
      return { ...state, loadingById: action.payload };

    case actions.SAVE_LOADING_PRODUCTO:
      return { ...state, saveLoading: action.payload };

    case actions.GET_PRODUCTO:
      console.log("Productos recibidos en el reducer:", action.payload.productos);
      return {
        ...state,
        productos: action.payload.productos,
        productoLength: action.payload.productoLength,
      };

    case actions.GET_PRODUCTO_BY_ID:
      return { ...state, producto: action.payload };

    case actions.FORM_FAIL:
      return { ...state, formError: action.payload };

    case actions.PRODUCTO_FAIL:
      return { ...state, productoError: action.payload };

    default:
      return state;
  }
}
