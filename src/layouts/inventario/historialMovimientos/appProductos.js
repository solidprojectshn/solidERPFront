import { React, useMemo, useState, Suspense, useEffect } from "react";
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import styled from "@emotion/styled";
import { CssBaseline, Box, Typography, useTheme, CircularProgress, IconButton} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";
import moment from "moment";
import UnidadesColumn from "./Components/UnidadesColumn";
import VisibilityIcon from '@mui/icons-material/Visibility';

//import - montaje api
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {
    getHistorialM
} from "../../../redux/inventario/historialMovimiento/historialMProductos/actions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//icons
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

//filtros
import { PERMISOS, TIPO_PRODUCTO } from "../../../services/constantes";
import dayjs from "dayjs";
import Select from 'react-select';

//estilos nav
const BoxNav = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '20vh',
    padding: '1.5%'
}));

const Fondo = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 'auto',
    padding: '2% 0% 2% 0%',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
    },
}));

const CardData = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    background: '#ffffff',
    border: '1px solid #ffffff',
    borderRadius: '10px',
    width: '50%',
    height: '15vh',
    margin: '1%',
    boxShadow: theme.shadows[3],
    [theme.breakpoints.down('lg')]: {
        width: '95%',
        height: '10vh',
    },
    [theme.breakpoints.down('md')]: {
        width: '95%',
        height: 'auto',
    },
    [theme.breakpoints.down('sm')]: {
        width: '95%',
        height: 'auto',
    },
}));

const Logo = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: '30%',
    margin: '1%'
}));

const ContenedorData = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: '67%',
    margin: '1%'
}));

const Contenedor = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', //vertical
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: '100%',
    height: 'auto',
    margin: '2.5% 0% 2.5% 0%',
    boxShadow: theme.shadows[3],
}));

const BoxTabla = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', //vertical
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: '100%',
    height: 'auto',
    padding: '2%',
}));


const AppHistorialP = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const theme = useTheme();

    const [selectedRango, setSelectedRango] = useState(null);
    const [localSeleccionado, setLocalSeleccionado] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10, //customize the default page size
    });

    const {
        loading,
        historialM,
        historialMError,
        historialMLength
    } = useSelector((store) => store.historialM)

    const {
        user
    } = useSelector((store) => store.auth);

    const {
        permissions
    } = useSelector((store) => store.auth);

    const tienePermisoEspecifico = permissions.includes(PERMISOS.ACCEDER_ALERTAS_ESPECIFICO)
    const tieneLocal = user?.local_id || 0

    useEffect(() => {
        if (tienePermisoEspecifico) {
            dispatch(getHistorialM({
                local: tieneLocal, offset: pagination.pageIndex * pagination.pageSize, limit: pagination.pageSize
            }))
        } else {
            dispatch(getHistorialM({ offset:pagination.pageIndex * pagination.pageSize , limit: pagination.pageSize}));
        }
        console.log("Datos del Historial:", historialM);
    }, [pagination.pageIndex, pagination.pageSize])

    const goToDetail = (id) => {
        navigate(`/inventario/detallehistorialprod/${id}`);
    }

    //filtrado por producto
    const HistorialFiltrado = useMemo(() => {
        return historialM.filter(item => item.producto.tipo_producto.nombre !== TIPO_PRODUCTO.SIM_DISTRIBUCION && item.producto.tipo_producto.nombre !== TIPO_PRODUCTO.SIM_PORTABILIDAD);
    }, [historialM]);

    // Opciones de rango de fechas
    const opcionesRango = [
        { value: 1, label: "Último mes" },
        { value: 2, label: "Últimos 2 meses" },
        { value: 3, label: "Últimos 3 meses" },
        { value: 12, label: "Último año" },
    ];

    const opcionesLocales = useMemo(() => {
        if (!HistorialFiltrado) return [];
        return Array.from(
            new Set(HistorialFiltrado.map((item) => item.destino_local.nombre))
        ).map((local) => ({ value: local, label: local }));
    }, [HistorialFiltrado]);

    // Función para calcular las fechas basadas en el rango seleccionado
    const calcularFechas = (rango) => {
        const fechaFin = dayjs().endOf("month");
        const fechaInicio = dayjs().subtract(rango - 1, "month").startOf("month");
        return { fechaInicio, fechaFin };
    };

    const rangoFechas = useMemo(() => {
        if (!selectedRango) return null;
        return calcularFechas(selectedRango.value);
    }, [selectedRango]);

    // Filtrar datos
    const DatosFiltrados = useMemo(() => {
        if (!HistorialFiltrado) return [];

        let data = HistorialFiltrado;

        // Filtrar por local
        if (localSeleccionado) {
            data =
                localSeleccionado.value === "general"
                    ? data // Mostrar todos si se selecciona "general"
                    : data.filter((item) => item.destino_local.nombre === localSeleccionado.value);
        }

        // Filtrar por rango de fechas
        if (rangoFechas) {
            data = data.filter((item) => {
                const fechaMovimiento = dayjs(item.fecha_movimiento);
                return fechaMovimiento.isBetween(rangoFechas.fechaInicio, rangoFechas.fechaFin, "day", "[]");
            });
        }

        return data;
    }, [HistorialFiltrado, localSeleccionado, rangoFechas]);

    //KPI's
    const cantidadMovimientos = DatosFiltrados ? DatosFiltrados?.length : 0;

    // Filtrar los movimientos y contar
    const movimientosBodegaPrincipal = DatosFiltrados.
        filter(item => item.origen_local === null && item.destino_local.nombre === "Oficina Principal");

    const movimientosPrincipal = movimientosBodegaPrincipal?.length;

    const movimientosPrincTiendas = DatosFiltrados
        ? DatosFiltrados.reduce((total, item) => {
            return item.origen_local?.nombre === "Oficina Principal" &&
                item.destino_local?.nombre !== "Oficina Principal"
                ? total + 1 // Contamos el movimiento
                : total;
        }, 0)
        : 0;

    const movimientosEntreTiendas = DatosFiltrados
        ? DatosFiltrados.reduce((total, item) => {
            return item.origen_local?.nombre !== "Oficina Principal" &&
                item.destino_local?.nombre !== "Oficina Principal"
                ? total + 1 // Contamos el movimiento
                : total;
        }, 0)
        : 0;

    //tabla
    const columns = useMemo(() => [
        {
            header: 'Local de Origen',
            accessorKey: 'origen_local.nombre',
            muiTableHeadCellProps: {
                sx: {
                    width: 'auto',
                    height: '7vh',
                },
            },
            muiTableBodyCellProps: {
                sx: {
                    width: 'auto',
                    height: '7vh',
                },
            },
        },
        {
            header: 'Local de Destino',
            accessorKey: 'destino_local.nombre',
            muiTableHeadCellProps: {
                sx: {
                    width: 'auto',
                    height: '7vh',
                },
            },
            muiTableBodyCellProps: {
                sx: {
                    width: 'auto',
                    height: '7vh',
                },
            },
            Cell: ({ cell }) => {
                let destino = cell.getValue()
                return (
                    <>
                        {destino ? destino : "Vendido"}
                    </>
                )
            },
        },
        {
            header: 'Producto',
            accessorKey: 'producto.nombre',
            muiTableHeadCellProps: {
                sx: {
                    width: 'auto',
                    height: '7vh',
                },
            },
            muiTableBodyCellProps: {
                sx: {
                    width: 'auto',
                    height: '7vh',
                },
            },
        },
        {
            header: 'Cantidad',
            accessorKey: 'cantidad',
            muiTableHeadCellProps: {
                sx: {
                    width: 'auto',
                    height: '7vh',
                },
            },
            muiTableBodyCellProps: {
                sx: {
                    width: 'auto',
                    height: '7vh',
                },
            },
        },
        {
            header: 'Fecha',
            accessorKey: 'fecha_movimiento',
            muiTableHeadCellProps: {
                sx: {
                    width: 'auto',
                    height: '7vh',
                },
            },
            muiTableBodyCellProps: {
                sx: {
                    width: 'auto',
                    height: '7vh',
                },
            },
            Cell: ({ cell }) => {
                let dateMov = new Date(cell.getValue()).toLocaleDateString()
                return (
                    <div>
                        {moment(cell.getValue()).format("DD-MM-YYYY HH:mm:ss")}
                    </div>
                )
            },
        },
        {
            header: 'Usuario',
            accessorKey: 'creado_por',

        },
        {
            header: 'Acciones',
            id: 'acciones',
            Cell: ({ row }) => (
                <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                    <IconButton color="secondary" onClick={() => goToDetail(row.original.id_historial_movimiento)}>
                        <VisibilityIcon />
                    </IconButton>
                </Box>
            ),
        }
    ]);

    

    const table = useMaterialReactTable({
        columns,
        data: DatosFiltrados,
        manualPagination: true, // Habilita la paginación manual
        initialState: { pagination: { pageSize: 10, pageIndex: 0 } , density: "compact"},
        rowCount: historialMLength || 0, // Asegúrate de que el backend devuelva el total de registros
        onPaginationChange: setPagination, //hoist pagination state to your state when it changes internall

        paginationDisplayMode: "pages",
        enableColumnResizing: true,
        enableGrouping: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        positionToolbarAlertBanner: 'bottom',
        localization: MRT_Localization_ES,
        muiTableHeadProps: {
            sx: {
                padding: "0"
            }
        },
        muiTableContainerProps: {
            className: "mrt-container table-style",
        },
        muiBottomToolbarProps: {
            className: "table-bottom"
        },
        muiToolbarAlertBannerChipProps: { color: "primary" },
        muiSearchTextFieldProps: {
            size: "small",
            variant: "outlined",
        },
        muiPaginationProps: {
            color: "primary",
            rowsPerPageOptions: [10, 20, 30],
            shape: "rounded",
            variant: "outlined",
            className: "pagination-selector"
        },
        muiTableBodyRowProps: {
            className: "filasTablaDark"
        },
        muiTopToolbarProps: {
            sx: {
                backgroundColor: "transparent"
            }
        },
        muiColumnActionsButtonProps: {
            className: "table-column-buttons"
        },
        muiTableFooterProps: {
            className: "table-footer-line"
        },
        state: {
            isLoading: loading,
            showProgressBars: loading,
            pagination 
        },
    });


    return (
        <DashboardLayout>
            <CssBaseline />
            <BoxNav>
                <DashboardNavbar />
            </BoxNav>
            <Fondo>
                <CardData>
                    <Logo><NotificationsActiveIcon fontSize="large" htmlColor="#6c6a69" /></Logo>
                    <ContenedorData>
                        <Typography
                            sx={{
                                fontSize: 'small',
                                color: '#696969',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: 'small',
                                },
                            }}
                        >
                            Cantidad de movimientos
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: 'medium',
                                fontWeight: 'bold',
                                color: '#696969',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: '2vh',
                                    fontWeight: 'bold'
                                },
                            }}
                        >
                            {cantidadMovimientos}
                        </Typography>
                    </ContenedorData>
                </CardData>
                <CardData>
                    <Logo><NotificationsActiveIcon fontSize="large" htmlColor="#6c6a69" /></Logo>
                    <ContenedorData>
                        <Typography
                            sx={{
                                fontSize: 'small',
                                color: '#696969',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: 'small',
                                },
                            }}
                        >
                            Entradas - B.Principal
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: 'medium',
                                fontWeight: 'bold',
                                color: '#696969',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: '2vh',
                                    fontWeight: 'bold'
                                },
                            }}
                        >
                            {movimientosPrincipal}
                        </Typography>
                    </ContenedorData>
                </CardData>
                <CardData>
                    <Logo><NotificationsActiveIcon fontSize="large" htmlColor="#6c6a69" /></Logo>
                    <ContenedorData>
                        <Typography
                            sx={{
                                fontSize: 'small',
                                color: '#696969',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: 'small',
                                },
                            }}
                        >
                            Salidas - B.Principal
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: 'medium',
                                fontWeight: 'bold',
                                color: '#696969',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: '2vh',
                                    fontWeight: 'bold'
                                },
                            }}
                        >
                            {movimientosPrincTiendas}
                        </Typography>
                    </ContenedorData>
                </CardData>
                <CardData>
                    <Logo><NotificationsActiveIcon fontSize="large" htmlColor="#6c6a69" /></Logo>
                    <ContenedorData>
                        <Typography
                            sx={{
                                fontSize: 'small',
                                color: '#696969',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: 'small',
                                },
                            }}
                        >
                            Movimientos/Tiendas
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: 'medium',
                                fontWeight: 'bold',
                                color: '#696969',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: '2vh',
                                    fontWeight: 'bold'
                                },
                            }}
                        >
                            {movimientosEntreTiendas}
                        </Typography>
                    </ContenedorData>
                </CardData>
            </Fondo>
            <Fondo>
                {!tienePermisoEspecifico &&
                    (<Box sx={{ width: { xs: 340, md: '48%' }, margin: '1%' }}>
                        <Select
                            options={opcionesLocales}
                            value={localSeleccionado}
                            onChange={setLocalSeleccionado}
                            placeholder="Filtrar por local"
                            isClearable
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    fontSize: 'medium',
                                }),
                                menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                }),
                            }}
                            menuPortalTarget={document.body}
                        />
                    </Box>)}
                <Box sx={{ width: { xs: 340, md: '48%' }, margin: '1%' }}>
                    <Select
                        options={opcionesRango}
                        value={selectedRango}
                        onChange={setSelectedRango}
                        placeholder="Filtrar por fecha"
                        isClearable
                        styles={{
                            control: (base) => ({
                                ...base,
                                fontSize: 'medium',
                            }),
                            menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
                            }),
                        }}
                        menuPortalTarget={document.body}
                    />
                </Box>
            </Fondo>
            <Contenedor>
                <Typography variant="h6" sx={{
                    color: '#6c6a69',
                    margin: '2% 0% 0.5% 0%'
                }}>
                    Movimientos De Productos
                </Typography>
                <BoxTabla>
                    <Box sx={{ maxHeight: '500px', overflowY: 'auto', width: '100%' }}>
                        <Suspense fallback={<CircularProgress />}>
                            <MaterialReactTable table={table} />
                        </Suspense>
                    </Box>
                </BoxTabla>
            </Contenedor>
        </DashboardLayout>
    )
}

export default AppHistorialP;