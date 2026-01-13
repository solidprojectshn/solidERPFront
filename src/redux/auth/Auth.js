import * as actions from "./actionsType";

const initialData = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  user: null,
  username: null,
  permissions: [],
  empleadoInfo: null,
  loading: false,
  error: null
};

export default function AuthReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,   // Activa el estado de carga
        error: null,     // Resetea cualquier error previo
      };
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        username: action.payload.username,
        user: action.payload.user,
        permissions: action.payload.permissions,
        empleadoInfo: action.payload.empleadoInfo,
        loading: false,  // Desactiva el estado de carga
        error: null,
      };
    case actions.LOGIN_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        user: null,
        username: null,
        permissions: [],
        empleadoInfo: null,
        loading: false,  // Desactiva el estado de carga
        error: action.payload.error,  // Almacena el mensaje de error
      };
    case actions.REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        accessToken: action.payload.accessToken,
      };
    case actions.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        user: null,
        username: null,
        permissions: [],
        empleadoInfo: null,
        loading: false,
        error: null,  // Resetea cualquier error previo

        // Opcionalmente, puede desactivar cualquier otra información relacionada con la sesión actual (como la lista de pedidos o el carrito) para garantizar un estado limpio.
      }
    default:
      return state;
  }
}
