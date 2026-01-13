import * as actions from "./actionsType";

const initialData = {
  loading: false,
  detalleventaLength: 0,
  detalleventas: [],
  detalleventa: {},
  detalleventaError: "",
  formError: "",
};

export default function DetalleVentasReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_DETALLE_VENTA:
      return { ...state, loading: action.payload };

    case actions.GET_DETALLE_VENTA:
      return {
        ...state,
        detalleventas: action.payload.detalleventas,
        detalleventaLength: action.payload.detalleventaLength,
      };

    case actions.FORM_FAIL:
      return { ...state, formError: action.payload };

    case actions.DETALLE_VENTA_FAIL:
      return { ...state, detalleventaError: action.payload };
            
    default:
      return state;
  }
}
