import * as actions from "./actionsType";

const initialData = {
  loading: false,
  loadingById: false,
  alertasLength: 0,
  alertas: [],
  alerta: {},
  alertaError: "",
};

export default function alertasMaxReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_ALERTAS_MAXIMAS:      
      return { ...state, loading: action.payload };

    case actions.LOADING_ALERTA_MAXIMA_BY_ID:
      return { ...state, loadingById: action.payload };

    case actions.GET_ALERTAS_MAXIMAS:
      return {
        ...state,
        alertas: action.payload.alertas,
        alertasLength: action.payload.alertasLength,
      };

    case actions.GET_ALERTA_MAXIMA_BY_ID:
      return { ...state, alerta: action.payload };

    case actions.ALERTAS_MAXIMAS_FAIL:
      return { ...state, alertaError: action.payload };

    default:
      return state;
  }
}
