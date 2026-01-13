import * as actions from "./actionsType";

const initialData = {
  loading: false,
  loadingById: false,
  alertasLength: 0,
  alertas: [],
  alerta: {},
  alertaError: "",
};

export default function alertsReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_ALERTAS:      
      return { ...state, loading: action.payload };

    case actions.LOADING_ALERTA_BY_ID:
      return { ...state, loadingById: action.payload };

    case actions.GET_ALERTAS:
      return {
        ...state,
        alertas: action.payload.alertas,
        alertasLength: action.payload.alertasLength,
      };

    case actions.GET_ALERTA_BY_ID:
      return { ...state, alerta: action.payload };

    case actions.ALERTAS_FAIL:
      return { ...state, alertaError: action.payload };

    default:
      return state;
  }
}
