import * as actions from "./actionsType";

const initialData = {
  loading: false,
  historialMLength: 0,
  historialM: [],
  historialMError: "",
  loadingById: false,
  historialMById: {},
  historialMByIdError: "",

};

export default function historialMReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_HISTORIAL_MOVIMIENTO:
      return { ...state, loading: action.payload };

    case actions.GET_HISTORIAL_MOVIMIENTO:
      return {
        ...state,
        historialM: action.payload.historialM,
        historialMLength: action.payload.historialMLength,
      };
    case actions.HISTORIAL_MOVIMIENTO_FAIL:
      return { ...state, historialMError: action.payload };


    case actions.LOADING_HISTORIAL_MOVIMIENTO_BY_ID:
      return { ...state, loadingById: action.payload };

    case actions.GET_HISTORIAL_MOVIMIENTO_BY_ID:
      return {
        ...state,
        historialMById: action.payload,
      
      };
    case actions.HISTORIAL_MOVIMIENTO_BY_ID_FAIL:
      return { ...state, historialMByIdError: action.payload };

    default:
      return state;
  }
}
