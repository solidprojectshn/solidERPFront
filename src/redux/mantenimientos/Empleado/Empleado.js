import * as actions from "./actionsType";

const initialData = {
  loading: false,
  loadingById: false,
  saveLoading: false,
  empleadoLength: 0,
  empleados: [],
  empleado: {},
  empleadoError: "",
  formError: "",
};

export default function EmpleadoReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_EMPLEADO:      
      return { ...state, loading: action.payload };

    case actions.LOADING_EMPLEADO_BY_ID:
      return { ...state, loadingById: action.payload };

    case actions.SAVE_LOADING_EMPLEADO:
      return { ...state, saveLoading: action.payload };

    case actions.GET_EMPLEADO:
      return {
        ...state,
        empleados: action.payload.empleados,
        empleadoLength: action.payload.empleadoLength,
      };

    case actions.GET_EMPLEADO_BY_ID:
      return { ...state, empleado: action.payload };

    case actions.FORM_FAIL:
      return { ...state, formError: action.payload };

    case actions.EMPLEADO_FAIL:
      return { ...state, empleadoError: action.payload };

    default:
      return state;
  }
}
