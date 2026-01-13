import { createStore, combineReducers, compose, applyMiddleware } from "redux";

import ClienteReducer from "./mantenimientos/clientes/Cliente";
import ProductTypeReducer from "./mantenimientos/tipoProducto/ProductTypes";
import TipoLocalReducer from "./mantenimientos/tipoLocal/TipoLocal";
import MetodoPagoReducer from "./mantenimientos/metodopago/MetodoPago";
import DenominacionReducer from "./mantenimientos/denominacion/Denominacion";
import RolReducer from "./mantenimientos/roles/Roles";
import PermisosReducer from "./mantenimientos/permisos/Permisos";
import EmpleadosReducer from "./mantenimientos/Empleado/Empleado";
import EmpresaReducer from "./mantenimientos/Empresa/Empresa";
import AuthReducer from "./auth/Auth"
import { thunk } from "redux-thunk";
import ProductoReducer from "./mantenimientos/producto/Producto";
import LocalReducer from "./mantenimientos/local/Local";
import UsuarioReducer from "./mantenimientos/usuario/Usuario"
import AddStockReducer from "./inventario/agregarStock/AgregarStock";
import AlertsReducer from "./inventario/alertas/alertas";
import alertasMaxReducer from "./inventario/alertas_maximas/alertasMaximas";
import historialMReducer from "./inventario/historialMovimiento/historialMProductos/historialmov";
import existenciaReducer from "./inventario/verExistencias/existencias";
import BuscadorSerieReducer from "./inventario/buscadorSerie/buscadorSerie";
import VentasReducer from "./facturacion/ventas/ventas";
import ArqueosReducer from "./facturacion/arqueo/arqueos";
import DashboardReducer from "./dashboards/dashboards/Dashboard";
import RecargaSummaryReducer from "./facturacion/recargaSummary/recargasSummary";
import TipoVentaReducer from "./mantenimientos/tipoVenta/tipoVenta"; 

//redux mantenimiento
import MetaReducer from "./mantenimientos/meta/meta";
import rangoFacturaReducer from "./mantenimientos/rango_factura/rangoFactura";

//redux qz-tray
//import QZReducer from "./facturacion/qzTray/qzTray"; --- antes

const rootReducer = combineReducers({
  empresa: EmpresaReducer,
  empleado: EmpleadosReducer,
  rol: RolReducer,
  denominacion: DenominacionReducer,
  metodoPago: MetodoPagoReducer,
  cliente: ClienteReducer,
  productType: ProductTypeReducer,
  tipoLocal: TipoLocalReducer,
  permisos: PermisosReducer,
  producto: ProductoReducer,
  local: LocalReducer,
  usuario: UsuarioReducer,
  auth: AuthReducer,
  addStock: AddStockReducer,
  alertas: AlertsReducer,
  alertasMaximas: alertasMaxReducer,
  historialM: historialMReducer,
  existencias: existenciaReducer,
  metas: MetaReducer,
  ventas: VentasReducer,
  arqueos: ArqueosReducer,
  rangoFactura: rangoFacturaReducer,
  dashboard: DashboardReducer,
  recargaSummary: RecargaSummaryReducer,
  //qzTray : QZReducer, --- antes
  tipoVenta : TipoVentaReducer,
  buscadorSeries : BuscadorSerieReducer,
});

const composeEnhancers =
  process.env.NODE_ENV === "development"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;

// export default function generateStore() {
//   const store = createStore(
//     rootReducer,
//     composeEnhancers(applyMiddleware(thunk))
//   );
//   return store;
// }

