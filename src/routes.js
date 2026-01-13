/**
=========================================================
* Argon Dashboard 2 MUI - v3.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-material-ui
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Soft UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.
  Once you add a new route on this file it will be visible automatically on
  the Sidenav.
  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Argon Dashboard 2 MUI layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import VirtualReality from "layouts/virtual-reality";
import RTL from "layouts/rtl";
import Profile from "layouts/profile";
import Perfil from "layouts/perfil/app"
import SignIn from "./layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

//ruta home - raíz
import Home from "layouts/home/app";

//rutas modulo/inventario
import Stock from "layouts/stock/app";
import SubmAsignar from "layouts/inventario/asignar/submenu";
import AsignarTiendas from "layouts/inventario/asignar/asignarTiendas/app";
import AsignarSupervisor from "layouts/inventario/asignar/asignarSupervisores/app";
import Alertas from "layouts/inventario/alertas/app";
import SubmenuExistencias from "layouts/inventario/verExistencias/app";
import ExistenciasG from "layouts/inventario/verExistencias/existenciasGeneral/app";
import AppBuscador from "layouts/inventario/verExistencias/buscadorSeries/app";
import ExistenciasBP from "layouts/inventario/verExistencias/existenciasBPrincipal/app";
import ExistenciasLocales from "layouts/inventario/verExistencias/existenciasLocales/app";
import ExistenciasSupervisores from "layouts/inventario/verExistencias/existenciasSupervisores/app";
import ExistenciasPuntosEstacionarios from "layouts/inventario/verExistencias/existenciasPuntosEstacionarios/app";
import ExistenciasEstacionarios from "layouts/inventario/verExistencias/app"; 
import SubmHistorialMov from "layouts/inventario/historialMovimientos/app";
import HistorialProductos from "layouts/inventario/historialMovimientos/appProductos";
import HistorialSims from "layouts/inventario/historialMovimientos/appSims";

//rutas modulo/facturación
import SubmenuVentas from "./layouts/facturacion/app";
import VentasDursan from "layouts/facturacion/subcategorias_menu/ventas_dursan/app";
import VentasKrediya from "layouts/facturacion/subcategorias_menu/ventas_Krediya/app";
import VentasIO from "layouts/facturacion/subcategorias_menu/ventas_OI/app";
import HistorialV from "layouts/facturacion/historial_venta/app";
import Arqueo from "layouts/facturacion/arqueo/app";
import HistorialVDursan from "layouts/facturacion/historial_venta/historialVDursan/app";
import HistorialVKrediya from "layouts/facturacion/historial_venta/historialVKrediya/app";
import HistorialVOI from "layouts/facturacion/historial_venta/historialVOi/app";
import HistorialVCuotas from "layouts/facturacion/historial_venta/historialVCuotas/app";
import DetallePage from "./layouts/facturacion/historial_venta/detalle/detallePage";
import DetallePageOI from "layouts/facturacion/historial_venta/detalle/detallePageOi";
import DetallePageKrediya from "./layouts/facturacion/historial_venta/detalle/detallePageKrediya";
import DetalleCuotaPage from "./layouts/facturacion/historial_venta/detalle/detalleCuotaPage"
import CuotasKrediya from "./layouts/facturacion/subcategorias_menu/cuotas_Krediya/app";
import HistorialArqueo from "./layouts/facturacion/historial_arqueo/app"
import DetalleArqueo from "./layouts/facturacion/historial_arqueo/detalle/app"


//rutas modulo/mantenimiento
import MantenimientoMenu from "layouts/mantenimiento/menu/menu";
import Menutipoprod from "layouts/mantenimiento/menu/subcategorias_menu/tipoProducto/App";
import Manttipolocal from "layouts/mantenimiento/menu/subcategorias_menu/tipoLocal/app";
import MantTipoVenta from "layouts/mantenimiento/menu/subcategorias_menu/tipoVenta/app";
import MantCliente from "layouts/mantenimiento/menu/subcategorias_menu/cliente/App"
import MantMetodoPago from "layouts/mantenimiento/menu/subcategorias_menu/metodoPago/App"
import MantRol from "layouts/mantenimiento/menu/subcategorias_menu/roles/App"
import MantPermisos from "layouts/mantenimiento/menu/subcategorias_menu/permisos/App"
import MantUsuarios from "layouts/mantenimiento/menu/subcategorias_menu/usuarios/App"
import MantEmpresa from "layouts/mantenimiento/menu/subcategorias_menu/empresa/App"
import MantDenominaciones from "layouts/mantenimiento/menu/subcategorias_menu/denominacion/App"
import MantEmpleados from "layouts/mantenimiento/menu/subcategorias_menu/empleado/App"
import MantProductos from "layouts/mantenimiento/menu/subcategorias_menu/producto/App"
import MantLocales from "layouts/mantenimiento/menu/subcategorias_menu/local/App"
import MantMeta from "layouts/mantenimiento/menu/subcategorias_menu/meta/app"
import MantPrueba from "layouts/mantenimiento/menu/subcategorias_menu/rangoFactura/app"
import ProductoDetalle from "layouts/inventario/historialMovimientos/Components/detalleHistorial";

//iconos material ui
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import AdfScannerOutlinedIcon from '@mui/icons-material/AdfScannerOutlined';
import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined';
import ComputerOutlinedIcon from '@mui/icons-material/ComputerOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import PrintIcon from '@mui/icons-material/Print';

import NotFoundPage from "./layouts/notFound/NotFoundPage";


// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import { AssignmentLateOutlined } from "@mui/icons-material";
import icon from "assets/theme/components/icon";
import { Component } from "react";
import { components } from "react-select";
import { PERMISOS } from "./services/constantes"

const routes = [
  {
    type: "route",
    isPrivate: true,
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: (<ComputerOutlinedIcon/>),
    component: <Dashboard />,
    permissions: [
      PERMISOS.ACCEDER_DASHBOARD_ESPECIFICO,
      PERMISOS.ACCEDER_DASHBOARD_GENERAL
    ]
  },
  {
    type: "collapse",
    name: "Inventario",
    key: "tables",
    route: "/tables",   
    permissions: [
      PERMISOS.ACCEDER_MODULO_INVENTARIO
    ],
    icon: (
      <Inventory2OutlinedIcon />
    ),
    component: <Tables />,
    collapse: [
      {
        type: "route",
        isPrivate: true,
        name: "Alertas",
        route: "/alertas",
        icon: (
          <NotificationsNoneOutlinedIcon />
        ),
        key: "ver-productos",
        component:<Alertas/>,
        permissions: [
          PERMISOS.ACCEDER_ALERTAS_ESPECIFICO,
          PERMISOS.ACCEDER_ALERTAS_GENERAL
        ]

      },
      {
        type: "route",
        isPrivate: true,
        name: "Ver Existencias",
        route: "/existencias",
        icon: (
          <RemoveRedEyeOutlinedIcon />
        ),
        key: "agregar-producto",
        component:<SubmenuExistencias />,
        permissions: [
          PERMISOS.ACCEDER_VER_EXISTENCIAS
        ]
      },
      {
        type: "route",
        isPrivate: true,
        name: "Agregar a Stock",
        route: "inventario/agregarstock",
        icon: (<AddCircleOutlineOutlinedIcon />),
        component: <Stock />,
        key: "categorias",
        permissions: [
          PERMISOS.ACCEDER_AGREGAR_A_STOCK
        ]
      },
      {
        type: "route",
        isPrivate: true,
        name: "Asignar",
        route: "inventario/asignar",
        icon:(<HowToRegOutlinedIcon />),
        component:<SubmAsignar/>,
        key: "reportes",
        permissions: [
          PERMISOS.ACCEDER_ASIGNAR
        ]
      },
      {
        type: "route",
        isPrivate: true,
        name: "Historial/Movimientos",
        route: "submenu/historial/movimientos",
        icon:(<RestoreOutlinedIcon />),
        component:<SubmHistorialMov />,
        key: "ajustes-inventario",
        permissions: [
          PERMISOS.ACCEDER_HISTORIAL_MOVIMIENTOS
        ]
      },
    ],
  },
  {
    type: "collapse",
    isPrivate: true,
    name: "Facturación",
    key: "billing",
    route: "/billing",
    permissions:[
      PERMISOS.ACCEDER_MODULO_FACTURACION
    ],
    icon: (<AdfScannerOutlinedIcon/>),
    component: <Billing />,
    collapse: [
      {
        type: "route",
        isPrivate: true,
        name: "Generar venta",
        route: "submenu/ventas",
        icon:(<PointOfSaleOutlinedIcon />),
        component:<SubmenuVentas/ >,
        key: "menu-ventas",
        permissions: [
          PERMISOS.ACCEDER_GENERAR_VENTA
        ]
      },
      {
        type: "route",
        isPrivate: true,
        name: "Historial venta",
        route: "Historial/ventas",
        component:<HistorialV />,
        icon:(<RestoreOutlinedIcon/>),
        key: "crear-factura",
        permissions: [
          PERMISOS.ACCEDER_HISTORIAL_VENTAS
        ]
      },
      {
        type: "route",
        isPrivate: true,
        name: "Arqueo",
        route: "facturacion/arqueo",
        icon:(<PaidOutlinedIcon />),
        component:<Arqueo/>,
        key: "reportes-facturacion",        
        permissions: [
          PERMISOS.ACCEDER_ARQUEO
        ]
      },
      {
        type: "route",
        isPrivate: true,
        name: "Historial Arqueo",
        route: "facturacion/arqueo/historial",
        icon:(<CalendarMonthIcon />),
        component:<HistorialArqueo/>,
        key: "reportes-facturacion",        
        permissions: [
          PERMISOS.ACCEDER_HISTORIAL_ARQUEO_ESPECIFICO,
          PERMISOS.ACCEDER_HISTORIAL_ARQUEO_GENERAL
        ]
      },
    ],
  },
  {
    type: "route",
    isPrivate: true,
    name: "Mantenimiento",
    key: "virtual-reality",
    route: "/mantenimiento",
    icon: (<BuildCircleOutlinedIcon/>),
    component: <MantenimientoMenu />,
    permissions: [
      PERMISOS.ACCEDER_MANTENIMIENTO
    ]
  },
  
  {
    type: "",
    isPrivate: true,
    name: "Mantenimiento",
    key: "virtual-reality",
    route: "/mantenimiento/tipoproducto",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-app" />,
    component: <Menutipoprod />,
    permissions: [
      PERMISOS.ACCEDER_MTN_TIPO_PRODUCTO
    ]
  },
  {
    type: "",
    isPrivate: false,
    name: "notFound",
    key: "virtual-reality",
    route: "/*",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-app" />,
    component: <NotFoundPage />,
    
  },
  {
    type: "",
    isPrivate: true,
    name: "Mantenimiento I",
    key: "virtual-reality",
    route: "/mantenimiento/tipolocal",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-app" />,
    component: <Manttipolocal />,
    permissions: [
      PERMISOS.ACCEDER_MTN_TIPO_LOCAL
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "Mantenimiento I",
    key: "virtual-reality",
    route: "/mantenimiento/tipoVenta",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-app" />,
    component: <MantTipoVenta />,
    permissions: [
      PERMISOS.ACCEDER_MTN_TIPO_LOCAL
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "Mantenimiento I",
    key: "virtual-reality",
    route: "/mantenimiento/local",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-app" />,
    component: <MantLocales />,
    permissions: [
      PERMISOS.ACCEDER_MTN_LOCAL
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "Mantenimiento I",
    key: "virtual-reality",
    route: "/mantenimiento/clientes",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-app" />,
    component: <MantCliente />,
    permissions: [
      PERMISOS.ACCEDER_MTN_CLIENTES
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "Mantenimiento I",
    key: "virtual-reality",
    route: "/inventario/detallehistorialprod/:id", //prueba historial
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-app" />,
    component: <ProductoDetalle />,
    permissions: [
      PERMISOS.ACCEDER_MTN_CLIENTES
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "Mantenimiento I",
    key: "virtual-reality",
    route: "/mantenimiento/metodopago",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-app" />,
    component: <MantMetodoPago />,
    permissions: [
      PERMISOS.ACCEDER_MTN_METODOS_PAGOS
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "Mantenimiento I",
    key: "virtual-reality",
    route: "/mantenimiento/roles",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-app" />,
    component: <MantRol />,
    permissions: [
      PERMISOS.ACCEDER_MTN_ROL
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "Mantenimiento I",
    key: "virtual-reality",
    route: "/mantenimiento/permisos/:idRol",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-app" />,
    component: <MantPermisos />,
    permissions: [
      PERMISOS.ACCEDER_MTN_ROL
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "Mantenimiento I",
    key: "virtual-reality",
    route: "/mantenimiento/usuarios",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-app" />,
    component: <MantUsuarios />,
    permissions: [
      PERMISOS.ACCEDER_MTN_USUARIO
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "Mantenimiento I",
    key: "virtual-reality",
    route: "/mantenimiento/empresa",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-app" />,
    component: <MantEmpresa />,
    permissions: [
      PERMISOS.ACCEDER_MTN_EMPRESA
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "Mantenimiento I",
    key: "virtual-reality",
    route: "/mantenimiento/denominaciones",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-app" />,
    component: <MantDenominaciones />,
    permissions: [
      PERMISOS.ACCEDER_MTN_DENOMINACION
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "Mantenimiento I",
    key: "virtual-reality",
    route: "/mantenimiento/empleados",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-app" />,
    component: <MantEmpleados />,
    permissions: [
      PERMISOS.ACCEDER_MTN_EMPLEADO
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "Mantenimiento I",
    key: "virtual-reality",
    route: "/mantenimiento/productos",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-app" />,
    component: <MantProductos />,
    permissions: [
      PERMISOS.ACCEDER_MTN_PRODUCTO
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "Mantenimiento I",
    key: "virtual-reality",
    route: "/mantenimiento/meta",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-app" />,
    component: <MantMeta />,
    permissions: [
      PERMISOS.ACCEDER_MTN_META
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "Mantenimiento I",
    key: "virtual-reality",
    route: "/mantenimiento/correlativos",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-app" />,
    component: <MantPrueba />,
    // permissions: [
    //   "VER_MNT_PRODUCTO"
    // ]
  },
  // {
  //   type: "",
  //   isPrivate: true,
  //   name: "Mantenimiento I",
  //   key: "virtual-reality",
  //   route: "/mantenimiento/prueba",
  //   icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-app" />,
  //   component: <MantPrueba />,
  //   permissions: [
  //     "VER_MNT_PRODUCTO"
  //   ]
  // },
  {
    type: "",
    isPrivate: true,
    name: "Venta Dursan",
    route: "/venta/contado",
    component:<VentasDursan/ >,
    key: "ventas-Dursan",   
    permissions: [
      PERMISOS.ACCEDER_VENTA_DURSAN
    ] 
  },
  {
    type: "",
    isPrivate: true,
    name: "venta Crediyac",
    route: "/venta/credito",
    component:<VentasKrediya/ >,
    key: "ventas-Crediyac",
    permissions: [
      PERMISOS.ACCEDER_VENTA_KREDIYA
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "venta oi",
    route: "/venta/OI",
    component:<VentasIO/ >,
    key: "ventas-OI",
    permissions: [
      PERMISOS.ACCEDER_VENTA_KREDIYA
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "Cuota Krediya",
    route: "/venta/cuota/Krediya",
    component:<CuotasKrediya/ >,
    key: "cuota-Krediya",
    permissions: [
      PERMISOS.ACCEDER_PAGO_CUOTA_KREDIYA
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "venta Crediyac",
    route: "/inventario/general",
    component:<ExistenciasG/ >,
    key: "ventas-Crediyac",
    permissions: [
      PERMISOS.ACCEDER_INVENTARIO_GENERAL
    ]
  },
    {
    type: "",
    isPrivate: true,
    name: "buscador-inventario",
    route: "/inventario/buscador",
    component:<AppBuscador/ >,
    key: "inventario-buscador",
    permissions: [
      PERMISOS.ACCEDER_INVENTARIO_GENERAL
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "inventario principal",
    route: "/inventario/bodega-principal",
    component:<ExistenciasBP/ >,
    key: "inventario-bprincipal",
    permissions: [
      PERMISOS.ACCEDER_INVENTARIO_BODEGA
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "inventario locales",
    route: "/inventario/locales",
    component:<ExistenciasLocales/ >,
    key: "inventario-locales",
    permissions: [
      PERMISOS.ACCEDER_INVENTARIO_POR_TIENDA_ESPECIFICO,
      PERMISOS.ACCEDER_INVENTARIO_POR_TIENDA_GENERAL
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "inventario supervisores",
    route: "/inventario/supervisores",
    component:<ExistenciasSupervisores/ >,
    key: "inventario-supervisores",
    permissions: [
      PERMISOS.ACCEDER_INVENTARIO_SUPERVISORES_ESPECIFICO,
      PERMISOS.ACCEDER_INVENTARIO_SUPERVISORES_GENERAL
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "inventario puntos estacionarios",
    route: "/inventario/puntos-estacionarios",
    component:<ExistenciasPuntosEstacionarios/ >,
    key: "inventario-puntos-estacionarios",
    permissions: [
      PERMISOS.ACCEDER_INVENTARIO_PUNTOS_ESTACIONARIOS,
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "inventario locales",
    route: "/inventario/Estacionarios",
    component:<ExistenciasEstacionarios/ >,
    key: "inventario-estacionarios",
    permissions: [
      PERMISOS.ACCEDER_INVENTARIO_POR_TIENDA_ESPECIFICO,
      PERMISOS.ACCEDER_INVENTARIO_POR_TIENDA_GENERAL
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "venta Crediyac",
    route: "/historial/Venta/Contado",
    component:<HistorialVDursan/ >,
    key: "ventas-Crediyac",
    permissions: [
      PERMISOS.ACCEDER_HISTORIAL_VENTAS_DURSAN_GENERAL,
      PERMISOS.ACCEDER_HISTORIAL_VENTAS_DURSAN_ESPECIFICO
     
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "venta Crediyac",
    route: "/historial/Venta/Credito",
    component:<HistorialVKrediya/ >,
    key: "ventas-Crediyac",
    permissions: [
      PERMISOS.ACCEDER_HISTORIAL_VENTAS_KREDIYA_GENERAL,
      PERMISOS.ACCEDER_HISTORIAL_VENTAS_KREDIYA_ESPECIFICO
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "venta Crediyac",
    route: "/historial/Venta/OI",
    component:<HistorialVOI/ >,
    key: "ventas-Crediyac",
    permissions: [
      PERMISOS.ACCEDER_HISTORIAL_VENTAS_KREDIYA_GENERAL,
      PERMISOS.ACCEDER_HISTORIAL_VENTAS_KREDIYA_ESPECIFICO
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "Historial Pago Cuotas",
    route: "/historial/Venta/Cuota",
    component:<HistorialVCuotas/ >,
    key: "ventas-Crediyac",
    permissions: [
      PERMISOS.ACCEDER_HISTORIAL_CUOTAS_KREDIYA_GENERAL,
      PERMISOS.ACCEDER_HISTORIAL_CUOTAS_KREDIYA_ESPECIFICO
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "detalle venta",
    route: "/historial/Venta/detalle/:idVenta",
    component:<DetallePage/ >,
    key: "ventas-detalle",
  },
  {
    type: "",
    isPrivate: true,
    name: "detalle venta",
    route: "/historial/Venta/detalleKrediya/:idVenta",
    component:<DetallePageKrediya/ >,
    key: "ventas-detalle",
  },
  {
    type: "",
    isPrivate: true,
    name: "detalle venta",
    route: "/historial/Venta/detalleOi/:idVenta",
    component:<DetallePageOI/ >,
    key: "ventas-detalle",
  },
  {
    type: "",
    isPrivate: true,
    name: "detalle venta",
    route: "/historial/Venta/Cuota/:idVenta",
    component:<DetalleCuotaPage/ >,
    key: "ventas-detalle",
  },
  {
    type: "",
    isPrivate: true,
    name: "detalle venta",
    route: "/historial/Arqueo/detalle/:idArqueo",
    component:<DetalleArqueo/ >,
    key: "ventas-detalle",
  },
  {
    type: "",
    isPrivate: true,
    name: "historial productos",
    route: "/historial/productos",
    component:<HistorialProductos/ >,
    key: "ventas-Crediyac",
    permissions: [
      PERMISOS.ACCEDER_HISTORIAL_ESPECIFICO,
      PERMISOS.ACCEDER_HISTORIAL_GENERAL
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "historial sims",
    route: "/historial/sims",
    component:<HistorialSims/ >,
    key: "ventas-Crediyac",
    permissions: [
      PERMISOS.ACCEDER_HISTORIAL_SIMS_ESPECIFICO,
      PERMISOS.ACCEDER_HISTORIAL_SIMS_GENERAL_SUPERVISOR
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "asignar tiendas",
    route: "/asignar/locales",
    component:<AsignarTiendas/ >,
    key: "ventas-Crediyac",
    permissions: [
      PERMISOS.ACCEDER_ASIGNAR_ENTRE_TIENDAS
    ]
  },
  {
    type: "",
    isPrivate: true,
    name: "asignar supervisores",
    route: "/asignar/supervisores",
    component:<AsignarSupervisor/ >,
    key: "ventas-Crediyac",
    permissions: [
      PERMISOS.ACCEDER_ASIGNAR_A_SUPERVISORES
    ]
  },
  
  {
    type: "",
    isPrivate: false,
    name: "home",
    route: "/", //ruta principal
    component:<SignIn/ >,
    key: "ventas-Crediyac",
  },
  { type: "title", title: "Acerca De Ti", key: "account-pages" },
  {
    type: "route",
    isPrivate: true,
    name: "Tu Perfil",
    key: "profile",
    route: "/profile",
    icon: <ArgonBox component="i" color="dark" fontSize="14px" className="ni ni-single-02" />,
    component: <Perfil />,
  },
  
];

export default routes;
