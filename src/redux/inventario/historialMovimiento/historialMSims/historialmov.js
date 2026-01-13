import * as actions from "./actionsType";

const initialData = {
  loading: false,
  historialMLength: 0,
  historialM: [],
  historial: {},
  historialMError: "",
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

    default:
      return state;
  }
}
