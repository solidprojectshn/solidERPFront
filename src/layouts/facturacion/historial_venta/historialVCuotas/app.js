import { React, useEffect, useMemo, useState } from "react";
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import styled from "@emotion/styled";
import { CssBaseline, Box, Typography, CircularProgress, Alert, IconButton, Button } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";
import VisibilityIcon from '@mui/icons-material/Visibility';
import dayjs from "dayjs";
import Select from 'react-select';

//tabla
import { Suspense } from 'react';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';

//excel
import * as XLSX from 'xlsx';
import logo from '../../../../assets/images/LogoDursan.png';
import { format } from 'date-fns';
import { numberToWordsWithDecimals } from "../detalle/helpers";

//icons
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

//estilos nav
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
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
    },
}));

const SUno = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    height: '30vh',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
        width: '98%',
        height: 'auto',
        justifyContent: 'center',
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
}));
const SDos = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    alignItems: 'baseline',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('md')]: {
        width: '98%',
        marginBottom: '2%',
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginBottom: '2%',
    },
}));

const SDRowUno = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '98%',
    height: 'auto',
    margin: '1%',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'center',
    },
}));

const SDRowDos = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '97%',
    height: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        width: '98%',
    },
}));

const CardData = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    background: '#ffffff',
    border: '1px solid #ffffff',
    borderRadius: '10px',
    width: '48%',
    height: '15vh',
    margin: '1%',
    boxShadow: theme.shadows[3],
    [theme.breakpoints.down('sm')]: {
        height: 'auto',
        width: '98%',
        margin: '2%',
    },
    [theme.breakpoints.down('md')]: {
        height: 'auto',
        width: '98%',
        margin: '2%',
    },
    [theme.breakpoints.down('lg')]: {
        height: 'auto',
        width: '20%',
        margin: '2%',
    },
    [theme.breakpoints.down('xl')]: {
        height: 'auto',
        width: '98%',
        margin: '2%',
    }
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
    margin: '1% 0% 0% 0%',
    padding: '1%',
    boxShadow: theme.shadows[3],
}));

const BtnGenerar = styled(Button)(({ theme }) => ({
    width: '99%',
    margin: '1%',
    height: '99%',
    backgroundColor: '#217346',
    color: '#ffffff',
    boxShadow: theme.shadows[3],
    borderRadius: '5px',
    '&:hover': {
        backgroundColor: '#333333',
        color: '#ffffff',
    },
    [theme.breakpoints.down('sm')]: {
        width: '96%',
        height: '7vh',
    }
}));

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    getVenta,
    getVentaById
} from "../../../../redux/facturacion/ventas/actions";

import { PERMISOS, TIPO_VENTA } from '../../../../services/constantes';
import moment from "moment";

//función excel
const generateExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(
        data.map(item => ({
            'ID Venta': item.id_venta,
            'Cliente': item.cliente.nombre_completo,
            'Empleado': item.empleado.nombre_completo,
            'Tipo Venta': item.tipo_venta.nombre,
            'Local': item.local.nombre,
            'Fecha Venta': new Date(item.fecha_venta).toLocaleDateString(),
            'Prima (HNL)': parseFloat(item.prima).toFixed(2),
            'Total Venta (HNL)': parseFloat(item.total).toFixed(2),
            'Número Crédito': item.num_credito,
        }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte Cuotas');
    XLSX.writeFile(workbook, 'reporte_ventas.xlsx');
};

const HistorialVCuotas = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    //obtencion del mes actual 
    const startMonth = moment();
    const months = Array.from({ length: 6 }, (_, i) => ({
        value: startMonth.clone().subtract(i, "months").format("YYYY-MM"),
        label: startMonth.clone().subtract(i, "months").format("MM-YYYY")
    }));

    //status react
    const [selectedMes, setSelectedMes] = useState(months[0]?.value)

    const {
        ventas,
        ventaError,
        loading: loadingVenta
    } = useSelector((store) => store.ventas);

    const {
        permissions
    } = useSelector((store) => store.auth);

    const {
        user
    } = useSelector((store) => store.auth);

    const tienePermisoEspecifico = permissions.includes(PERMISOS.ACCEDER_HISTORIAL_CUOTAS_KREDIYA_ESPECIFICO)
    const tieneLocal = user?.local_id || 0

    useEffect(() => {
        if (tienePermisoEspecifico) {
            dispatch(getVenta({mes: selectedMes,tipo_venta: TIPO_VENTA.CUOTA, local: tieneLocal }));
        } else {
            dispatch(getVenta({mes: selectedMes,tipo_venta: TIPO_VENTA.CUOTA }));
        }
    }, [dispatch, selectedMes]);

    const goToDetail = (id) => {
        navigate(`/historial/Venta/Cuota/${id}`);
    }

    //KPI's
    const totalAltas = ventas.length;
    const totalVentas = ventas.reduce((acc, venta) => acc + parseFloat(venta.total), 0);

    // Formatear el total de ventas a Lempiras
    const formatoLempiras = (monto) =>
        new Intl.NumberFormat("es-HN", {
            style: "currency",
            currency: "HNL",
            minimumFractionDigits: 2,
        }).format(monto);

    const data = ventas?.detalle || []

    console.log("data:", data);

    //tabla
    const columns = useMemo(() => [
        {
            header: 'ID',
            accessorKey: 'id_venta',
        },
        {
            header: 'Cliente',
            accessorKey: 'cliente.nombre_completo',
        },
        {
            header: 'Local',
            accessorKey: 'local.nombre',
        },
        {
            header: 'Empleado',
            accessorKey: 'empleado.nombre_completo',
        },
        {
            header: 'Tipo Venta',
            accessorKey: 'tipo_venta.nombre',
        },
        {
            header: 'Número de Crédito',
            accessorKey: 'num_credito',
        },
        {
            header: 'Fecha',
            accessorKey: 'fecha_venta',
            Cell: ({ cell }) => {
                return moment(cell.getValue()).format('DD-MM-YYYY HH:mm:ss')
            }
        },

        {
            header: 'Total',
            accessorKey: 'total',
            Cell: ({ cell }) => {
                return Number(cell.getValue()).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })

            }
        },
        {
            header: 'Acciones',
            id: 'acciones',
            Cell: ({ row }) => (
                <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                    <IconButton color="secondary" onClick={() => goToDetail(row.original.id_venta)}>
                        <VisibilityIcon />
                    </IconButton>
                </Box>
            ),
        }
    ]);

    // Configuración de la tabla
    const table = useMaterialReactTable({
        columns,
        data: ventas,
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
            sx: {
                maxHeight: `calc(50px + 10 * 48px + 50px)`,
            }
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
            isLoading: "",
            showProgressBars: "",
        },
    });

    return (
        <DashboardLayout>
            <CssBaseline />
            <BoxNav>
                <DashboardNavbar />
            </BoxNav>
            {loadingVenta ? (
                <div className="py-3 flex justify-center">
                    <CircularProgress />
                </div>
            ) : (
                <div>
                    <Fondo>
                        <SUno>
                            <BtnGenerar onClick={() => generateExcel(ventas)} disabled={loadingVenta}>Imprimir Excel</BtnGenerar>
                        </SUno>
                        <SDos>
                            <SDRowUno>
                                <CardData>
                                    <Logo><NotificationsActiveIcon fontSize="large" htmlColor="#ff3131" /></Logo>
                                    <ContenedorData>
                                        {ventaError && (
                                            <Alert severity="error">
                                                {ventaError}
                                            </Alert>
                                        )}
                                        <Typography sx={{
                                            fontSize: 'small',
                                            color: '#6c6a69'
                                        }}>
                                            Total Ventas
                                        </Typography>
                                        <Typography sx={{
                                            fontSize: "medium",
                                            fontWeight: 'bold',
                                            color: '#ff3131'
                                        }}>
                                            {totalAltas}
                                        </Typography>
                                    </ContenedorData>
                                </CardData>
                                <CardData>
                                    <Logo><NotificationsActiveIcon fontSize="large" htmlColor="#ff3131" /></Logo>
                                    <ContenedorData>
                                        <Typography sx={{
                                            fontSize: 'small',
                                            color: '#6c6a69'
                                        }}>
                                            Cantidad Vendida
                                        </Typography>
                                        <Typography sx={{
                                            fontSize:"medium",
                                            fontWeight: 'bold',
                                            color: '#ff3131'
                                        }}>
                                            {formatoLempiras(totalVentas)}
                                        </Typography>
                                    </ContenedorData>
                                </CardData>
                            </SDRowUno>
                            <SDRowDos>
                                <Select
                                    options={months}
                                    value={months.find(m => m.value === selectedMes)}
                                    placeholder="Selecciona un mes"
                                    onChange={(option) => setSelectedMes(option.value)}
                                    
                                    menuPortalTarget={document.body}
                                    styles={{
                                        container: (provided) => ({
                                            ...provided,
                                            marginTop: "1%",
                                            width: '100%'
                                        }),
                                        menuPortal: (base) => ({
                                            ...base,
                                            zIndex: 9999,
                                        }),
                                    }}
                                />
                            </SDRowDos>
                        </SDos>
                    </Fondo>
                    <Contenedor>
                        <Typography variant="h6" sx={{
                            color: '#6c6a69',
                            margin: '0% 0% 0.5% 0.5%'
                        }}>
                            Historial De Ventas
                        </Typography>
                        <Box sx={{ maxHeight: '500px', overflowY: 'auto', width: '100%' }}>
                            {ventaError && (
                                <Alert severity="error">
                                    {ventaError}
                                </Alert>
                            )}
                            <Suspense fallback={<CircularProgress />}>
                                <MaterialReactTable table={table} />
                            </Suspense>
                        </Box>
                    </Contenedor>
                </div>
            )}

        </DashboardLayout>
    )
}

export default HistorialVCuotas;