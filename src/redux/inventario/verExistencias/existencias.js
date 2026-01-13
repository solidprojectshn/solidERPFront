import * as actions from "./actionsType";

const initialData = {
  loading: false,
  existenciasLength: 0,
  mayorStock: null,
  menorStock: null,
  existencias: [],
  existencia: {},
  existenciaError: "",
};

export default function existenciaReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_EXISTENCIAS:      
      return { ...state, loading: action.payload };

    case actions.GET_EXISTENCIAS:
      return {
        ...state,
        existencias: action.payload.existencias,
        existenciasLength: action.payload.existenciasLength,
        mayorStock: action.payload.mayorStock,
        menorStock: action.payload.menorStock, 
      };
    case actions.EXISTENCIAS_FAIL:
      return { ...state, existenciaError: action.payload };

    default:
      return state;
  }
}
