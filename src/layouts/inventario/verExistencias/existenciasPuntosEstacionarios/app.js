import { React, useMemo, useState, Suspense, useEffect } from "react";
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import styled from "@emotion/styled";
import { 
    CssBaseline,
    Box,
    Typography,
    useTheme,
    CircularProgress,
    IconButton,
    Tooltip
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";

//import - montaje api
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { getExistencias } from "../../../../redux/inventario/verExistencias/actions";
import { getLocal } from "../../../../redux/mantenimientos/local/actions";
import { PERMISOS, TIPO_LOCAL } from "../../../../services/constantes";
import { useDispatch, useSelector } from "react-redux";

//icons
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { item } from "examples/Sidenav/styles/sidenavItem";
import VisibilityIcon from '@mui/icons-material/Visibility';

//filtrado
import Select from 'react-select';
import SeriesModal from "./componentes/modalAcordeon";

//estilos nav
const BoxNav = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
//    backgroundColor: '#43b399',
    width: '100%',
    height: '20vh',
    padding: '1.5%'
}));

const Fondo = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
//    backgroundColor: '#43b399',
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
        existenciaError,
        existenciasLength,
        mayorStock,
        menorStock
    } = useSelector((store) => store.existencias);

    const { 
        locales, 
        loading: loadingLocales
    } = useSelector((store) => store.local);

    const {
        user
    } = useSelector((store) => store.auth);

    useEffect(() => {
        dispatch(getLocal()); // trae todos los locales sin filtrar
    }, [dispatch]);
      
    const { permissions } = useSelector((store) => store.auth);

    const tienePermisoEspecifico = permissions.includes(PERMISOS.ACCEDER_ALERTAS_ESPECIFICO)
    const tieneLocal = user?.local_id || 0

    // Estados
    const [localSeleccionado, setLocalSeleccionado] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    console.log("locales cargados:",locales)

    const opcionesLocales = useMemo(() => {
        if (!locales) return [];
      
        return locales
          .filter((local) => local.tipo_local.nombre === "Punto Estacionario")
          .map((local) => ({
            value: local.id_local,
            label: local.nombre,
          }));
      }, [locales]);
      
    const totalProductos = existenciasLength;

    useEffect(() => {
        const offset = pagination.pageIndex * pagination.pageSize;
        const limit = pagination.pageSize;

        const filtros = {
            tipo_local: TIPO_LOCAL.PUNTO_ESTACIONARIO,
            offset,
            limit
        };

        if (tienePermisoEspecifico) {
            filtros.local = tieneLocal;
        } else if (localSeleccionado?.value) {
            filtros.local = localSeleccionado.value;
        }

        dispatch(getExistencias(filtros));
    }, [
        dispatch,
        pagination.pageIndex,
        pagination.pageSize,
        tienePermisoEspecifico,
        tieneLocal,
        localSeleccionado
    ]);

    //recargar modal
    const recargarExistencias = () => {
        const offset = pagination.pageIndex * pagination.pageSize;
        const limit = pagination.pageSize;
      
        const filtros = {
          tipo_local: TIPO_LOCAL.PUNTO_ESTACIONARIO,
          offset,
          limit
        };
      
        if (tienePermisoEspecifico) {
          filtros.local = tieneLocal;
        } else if (localSeleccionado?.value) {
          filtros.local = localSeleccionado.value;
        }
      
        dispatch(getExistencias(filtros));
    };
          
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
        {
            header: 'Series',
            accessorKey: 'unidades',
            Cell: ({ row }) => {
                const unidades = row.original.unidades;
                const [openModal, setOpenModal] = useState(false);
            
                const handleModalOpen = () => setOpenModal(true);
                const handleModalClose = () => setOpenModal(false);
            
                if (!unidades || unidades.length === 0) return null;
            
                return (
                <>
                    <Tooltip title="Ver series">
                    <IconButton onClick={handleModalOpen}>
                        <VisibilityIcon />
                    </IconButton>
                    </Tooltip>
                    <SeriesModal 
                        open={openModal} 
                        handleClose={handleModalClose}
                        unidades={unidades}
                        onUnidadEliminada={recargarExistencias}
                        tienePermisoEspecifico={tienePermisoEspecifico}
                    />
                </>
                );
            },
        }
    ]);

    // Configuración de la tabla
    const table = useMaterialReactTable({
        columns,
        data: existencias || [],
        manualPagination: true,
        rowCount: totalProductos,
        onPaginationChange: setPagination,
        initialState: {
            pagination: {
                pageSize: pagination.pageSize,
                pageIndex: pagination.pageIndex
            },
            density: "compact"
        },
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
                {/* <DashboardNavbar absolute={false} light={true} isMini={false} /> */}
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
                                fontSize: 'large',
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
                                        fontSize: 'large',
                                        fontWeight: 'bold',
                                        color: '#ff3131',
                                        [theme.breakpoints.down('sm')]: {
                                            fontSize: '2vh',
                                            fontWeight: 'bold'
                                        },
                                    }}
                                >
                                    {menorStock ? menorStock.nombre : 'Sin datos'}
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
                                        fontSize: 'large',
                                        fontWeight: 'bold',
                                        color: '#4caf50',
                                        [theme.breakpoints.down('sm')]: {
                                            fontSize: '2vh',
                                            fontWeight: 'bold'
                                        },
                                    }}
                                >
                                    {mayorStock ? mayorStock.nombre : 'Sin datos'}
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