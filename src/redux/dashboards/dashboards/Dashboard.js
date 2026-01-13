import * as actions from "./actionsType";

const initialData = {
  loadingCumpMetas: false,
  cumpMetas: [],
  cumpMetasError: "",

  loadingVentasMens: false,
  ventasMens: [],
  ventasMensError: "",

  loadingTopProds: false,
  topProds: [],
  topProdsError: "",

  loadingTopLocales: false,
  topLocales: [],
  topLocalesError: "",

  loadingKpis: false,
  kpis: [],
  kpisError: "",

};

export default function DashboardReducer(state = initialData, action) {
  switch (action.type) {
    case actions.LOADING_CUMPLIMIENTO_METAS:
      return { ...state, loadingCumpMetas: action.payload };

    case actions.GET_CUMPLIMIENTO_METAS:
      return {
        ...state,
        cumpMetas: action.payload
      };

    case actions.CUMPLIMIENTO_METAS_FAIL:
      return { ...state, cumpMetasError: action.payload };

    ///
    case actions.LOADING_VENTAS_MENSUALES:
      return { ...state, loadingVentasMens: action.payload };

    case actions.GET_VENTAS_MENSUALES:
      return {
        ...state,
        ventasMens: action.payload
      };

    case actions.VENTAS_MENSUALES_FAIL:
      return { ...state, ventasMensError: action.payload };


    ///
    case actions.LOADING_TOP_PRODUCTOS:
      return { ...state, loadingTopProds: action.payload };

    case actions.GET_TOP_PRODUCTOS:
      return {
        ...state,
        topProds: action.payload
      };

    case actions.TOP_PRODUCTOS_FAIL:
      return { ...state, topProdsError: action.payload };

    ///
    case actions.LOADING_TOP_LOCALES:
      return { ...state, loadingTopLocales: action.payload };

    case actions.GET_TOP_LOCALES:
      return {
        ...state,
        topLocales: action.payload
      };

    case actions.TOP_LOCALES_FAIL:
      return { ...state, topLocalesError: action.payload };

    ///
    case actions.LOADING_KPIS:
      return { ...state, loadingKpis: action.payload };

    case actions.GET_KPIS:
      return {
        ...state,
        kpis: action.payload
      };

    case actions.KPIS_FAIL:
      return { ...state, kpisError: action.payload };











    default:
      return state;
  }
}
