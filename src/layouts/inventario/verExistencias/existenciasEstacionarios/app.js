import { React, useMemo, useState, Suspense, useEffect } from "react";
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import styled from "@emotion/styled";
import { CssBaseline, Box, Typography, useTheme, CircularProgress } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";

//import - montaje api
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { getExistencias } from "../../../../redux/inventario/verExistencias/actions";
import { PERMISOS, TIPO_LOCAL } from "../../../../services/constantes";
import { useDispatch, useSelector } from "react-redux";

//icons
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { item } from "examples/Sidenav/styles/sidenavItem";

//filtrado
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

const BoxTabla = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', //vertical
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: '100%',
    height: 'auto',
    margin: '2.5% 0% 2.5% 0%',
    padding: '2%',
    boxShadow: theme.shadows[3],
}));

const AppEGeneral = () => {

    const theme = useTheme();
    const dispatch = useDispatch();

    const {
        loading,
        existencias,
        existenciaError
    } = useSelector((store) => store.existencias);

    const {
        user
    } = useSelector((store) => store.auth);

    const { permissions } = useSelector((store) => store.auth);

    const tienePermisoEspecifico = permissions.includes(PERMISOS.ACCEDER_ALERTAS_ESPECIFICO)
    const tieneLocal = user?.local_id || 0

    // Estados para mayor y menor
    const [mayorStock, setMayorStock] = useState(null);
    const [menorStock, setMenorStock] = useState(null);
    const [localSeleccionado, setLocalSeleccionado] = useState("");

    const opcionesLocales = useMemo(() => {
        if (!existencias) return [];
        return Array.from(
            new Set(existencias.map((producto) => producto.local.nombre))
        ).map((local) => ({ value: local, label: local }));
    }, [existencias]);

    // Filtrar productos según el local seleccionado
    const productosFiltrados = useMemo(() => {
        if (!existencias) return [];
        if (!localSeleccionado) return existencias;
        return existencias.filter(
            (producto) => producto.local.nombre === localSeleccionado.value
        );
    }, [localSeleccionado, existencias]);

    const totalProductos = productosFiltrados ? productosFiltrados.length : 0;

    // Calcular mayor y menor stock
    useEffect(() => {
        if (!existencias || existencias.length === 0) return;

        let mayor = null;
        let menor = null;

        existencias.forEach(({ local, stock }) => {
            if (!local?.id_local || stock <= 0) return;

            // Determinar mayor stock
            if (!mayor || stock > mayor.stock) {
                mayor = { nombre: local.nombre, stock };
            }

            // Determinar menor stock
            if (!menor || stock < menor.stock) {
                menor = { nombre: local.nombre, stock };
            }
        });

        setMayorStock(mayor);
        setMenorStock(menor);
    }, [existencias]);

    useEffect(() => {
        if (tienePermisoEspecifico) {
            dispatch(getExistencias({ tipo_local: TIPO_LOCAL.TIENDA, local: tieneLocal }));
        }
        else {
            dispatch(getExistencias({ tipo_local: TIPO_LOCAL.PUNTO_ESTACIONARIO }));
        }

    }, [dispatch]);

    //tabla
    const columns = useMemo(() => [
        {
            header: 'Producto',
            accessorKey: 'producto.nombre',
        },
        {
            header: 'Local',
            accessorKey: 'local.nombre',
        },
        {
            header: 'Descripcion',
            accessorKey: 'producto.descripcion',
        },
        {
            header: 'Precio Unitario',
            accessorKey: 'producto.precio_unitario',
        },
        {
            header: 'Precio de venta',
            accessorKey: 'producto.precio_venta',
        },
        {
            header: 'Stock',
            accessorKey: 'stock',
        },
    ]);

    // Configuración de la tabla
    const table = useMaterialReactTable({
        columns,
        data: productosFiltrados,
        initialState: { density: "compact" },
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
        }
    });

    return (
        <DashboardLayout>
            <CssBaseline />
            <BoxNav>
                <DashboardNavbar />
            </BoxNav>
            <Fondo>
                <CardData>
                    <Logo><NotificationsActiveIcon fontSize="large" htmlColor="#696969" /></Logo>
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
                            Total de productos
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '4vh',
                                fontWeight: 'bold',
                                color: '#696969',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: '2vh',
                                    fontWeight: 'bold'
                                },
                            }}
                        >
                            {totalProductos}
                        </Typography>
                    </ContenedorData>
                </CardData>
                {!tienePermisoEspecifico && (
                    <>
                        <CardData>
                            <Logo><NotificationsActiveIcon fontSize="large" htmlColor="#ff3131" /></Logo>
                            <ContenedorData>
                                <Typography
                                    sx={{
                                        fontSize: 'small',
                                        color: '#6c6a69',
                                        [theme.breakpoints.down('sm')]: {
                                            fontSize: 'small',
                                        },
                                    }}
                                >
                                    Local con menor stock
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '4vh',
                                        fontWeight: 'bold',
                                        color: '#ff3131',
                                        [theme.breakpoints.down('sm')]: {
                                            fontSize: '2vh',
                                            fontWeight: 'bold'
                                        },
                                    }}
                                >
                                    {menorStock?.nombre}
                                </Typography>
                            </ContenedorData>
                        </CardData>
                        <CardData>
                            <Logo><NotificationsActiveIcon fontSize="large" htmlColor="#4caf50" /></Logo>
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
                                    Local con mayor stock
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '4vh',
                                        fontWeight: 'bold',
                                        color: '#4caf50',
                                        [theme.breakpoints.down('sm')]: {
                                            fontSize: '2vh',
                                            fontWeight: 'bold'
                                        },
                                    }}
                                >
                                    {mayorStock?.nombre}
                                </Typography>
                            </ContenedorData>
                        </CardData>
                    </>
                )}

            </Fondo>
            {!tienePermisoEspecifico && (
                <Fondo>
                    <Box sx={{ width: '96%' }}>
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
                    </Box>
                </Fondo>
            )}

            <BoxTabla>
                <Box sx={{ maxHeight: '500px', overflowY: 'auto', width: '100%' }}>
                    <Suspense fallback={<CircularProgress />}>
                        <MaterialReactTable table={table} />
                    </Suspense>
                </Box>
            </BoxTabla>
        </DashboardLayout>
    )
};

export default AppEGeneral;