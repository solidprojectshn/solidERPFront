import { React, useMemo, useState, useEffect } from "react";
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import styled from "@emotion/styled";
import { CssBaseline, Box, Typography, useTheme, CircularProgress, Button } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";
import { Suspense } from 'react';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';

import {
    getAlertas
} from "../../../redux/inventario/alertas/actions";

import { getAlertasMax } from "../../../redux/inventario/alertas_maximas/actions";

//filtro con select
import Select from 'react-select';
import dayjs from "dayjs";

//icons
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useDispatch, useSelector } from "react-redux";
import DownloadIcon from '@mui/icons-material/Download';
import { locales } from "moment";
import { PERMISOS } from "../../../services/constantes";

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

const FondoReport = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    width: '100%',
    height: 'auto',
    alignItems: 'baseline',
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

const CardFiltros = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
    height: 'auto',
    margin: '2%',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('lg')]: {
        width: '95%',
    },
    [theme.breakpoints.down('md')]: {
        width: '95%',
    },
    [theme.breakpoints.down('sm')]: {
        width: '95%',
    },
}));

const CardReport = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    width: '96%',
    margin: '2%',
    height: 'auto',
    alignItems: 'baseline',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
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
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    backgroundColor: '#ffffff',
    margin: '2.5% 0% 2.5% 0%',
    padding: '2%',
    boxShadow: theme.shadows[3]
}));

//funciones reporteria (pdf, excel)
// Función para exportar a PDF
const exportToPDF = (data) => {
    const doc = new jsPDF();
    doc.text('Reporte de Alertas', 14, 10);
    doc.autoTable({
        head: [['Producto', 'Tienda', 'Stock', 'Punto de Reorden', 'Stock Máximo']],
        body: data.map(item => [
            item.producto.nombre,
            item.local.nombre,
            item.stock,
            item.producto.punto_reorden,
            item.local.stock_maximo,
        ]),
    });
    doc.save('reporte_alertas.pdf');
};

// Función para exportar a Excel
const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(
        data.map(item => ({
            Producto: item.producto.nombre,
            Tienda: item.local.nombre,
            Stock: item.stock,
            'Punto de Reorden': item.producto.punto_reorden,
            'Stock Máximo': item.local.stock_maximo,
        }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
    XLSX.writeFile(workbook, 'reporte_alertas.xlsx');
};

const AppAlerta = () => {
    const dispatch = useDispatch();
    const [selectedLocal, setSelectedLocal] = useState(null);
    const [selectedAlertType, setSelectedAlertType] = useState(null);
    const [selectedRango, setSelectedRango] = useState(null);

    const {
        permissions
    } = useSelector((store) => store.auth);

    const {
        loading: loading,
        alertas: alertas,
        alertaError,
    } = useSelector((store) => store.alertas);

    const {
        loading: isLoading,
        alertas: alertasMaximas,
        alertaError: errorMensaje
    } = useSelector((store) => store.alertasMaximas);

    const {
        user
    } = useSelector((store) => store.auth);

    const tienePermisoEspecifico = permissions.includes(PERMISOS.ACCEDER_ALERTAS_ESPECIFICO)
    const tieneLocal = user?.local_id || 0


    useEffect(() => {
        if (tienePermisoEspecifico) {
            dispatch(getAlertas({
                tienda: tieneLocal
            }));
            dispatch(getAlertasMax({
                tienda: tieneLocal
            }));
        } else {
            dispatch(getAlertas())
            dispatch(getAlertasMax());

        }

        console.log("Datos de alertas:", alertas);

        console.log("Datos de alertas maximas:", alertasMaximas);
    }, [])

    const handleExport = (format) => {
        const data = [...alertasFiltradas, ...alertasMaxFiltradas];
        if (format === 'pdf') {
            exportToPDF(data);
        } else if (format === 'excel') {
            exportToExcel(data);
        }
    };

    // Opciones para los select
    const opcionesFiltros = useMemo(() => {
        if (!alertas) return { locales: []};

        // Opciones únicas de locales
        const localesUnicos = Array.from(new Set(alertas.map(item => item.local.nombre)));
        const localOptions = [
            { value: "general", label: "General" }, // Opción General
            ...localesUnicos.map(local => ({ value: local, label: local })),
        ];

        // Opciones filtrado mensual
        const opcionesRango = [
            { value: 1, label: "Último mes" },
            { value: 2, label: "Últimos 2 meses" },
            { value: 3, label: "Últimos 3 meses" },
        ];

        return { locales: localOptions, rangoMensual: opcionesRango };
    }, [alertas]);
    
    const calcularFechas = (rango) => {
        const fechaFin = dayjs().endOf("month");
        const fechaInicio = dayjs().subtract(rango - 1, "month").startOf("month");
        return { fechaInicio, fechaFin };
    };

    const rangoFechas = useMemo(() => {
        if (!selectedRango) return null;
        return calcularFechas(selectedRango.value);
    }, [selectedRango]);

    //filtrado de data con los select
    const alertasFiltradas = useMemo(() => {
        if (!alertas) return [];
    
        let data = selectedLocal?.value === "general"
            ? alertas
            : selectedLocal
                ? alertas.filter(item => item.local.nombre === selectedLocal.value)
                : alertas;
    
        if (rangoFechas) {
            data = data.filter(item => {
                const fechaAlerta = dayjs(item.fecha_creacion);
                return fechaAlerta.isBetween(rangoFechas.fechaInicio, rangoFechas.fechaFin, "day", "[]");
            });
        }
    
        return data;
    }, [alertas, selectedLocal, rangoFechas]);
    
    const alertasMaxFiltradas = useMemo(() => {
        if (!alertasMaximas) return [];
    
        let data = selectedLocal?.value === "general"
            ? alertasMaximas
            : selectedLocal
                ? alertasMaximas.filter(item => item.local.nombre === selectedLocal.value)
                : alertasMaximas;
    
        if (rangoFechas) {
            data = data.filter(item => {
                const fechaAlerta = dayjs(item.fecha_creacion);
                return fechaAlerta.isBetween(rangoFechas.fechaInicio, rangoFechas.fechaFin, "day", "[]");
            });
        }
    
        return data;
    }, [alertasMaximas, selectedLocal, rangoFechas]);

    const theme = useTheme();

    //tabla alertas bajas
    const columns = useMemo(() => [
        {
            header: 'Producto',
            accessorKey: 'producto.nombre',
        },
        {
            header: 'Tienda',
            accessorKey: 'local.nombre',
        },
        {
            header: 'Stock',
            accessorKey: 'stock',
        },
        {
            header: 'Punto De Reorden',
            accessorKey: 'producto.punto_reorden',
        },
        {
            header: 'Icono', //icono de alerta
            accessorKey: 'icono',
            Cell: ({ row }) => {
                const item = row.original;

                let iconColor = '#6b6f75';


                if (item.stock < Number(item.producto.punto_reorden) * 0.5){
                    iconColor = '#ff3131'; // Crítico (rojo)
                } else {
                    iconColor = '#ff914d'; // alertas general (naranja)
                }

                return <NotificationsActiveIcon fontSize="small" htmlColor={iconColor} />;
            }
        },
    ]);

    //tabla alertas bajas
    const columnsMax = useMemo(() => [
        {
            header: 'Producto',
            accessorKey: 'producto.nombre',
        },
        {
            header: 'Tienda',
            accessorKey: 'local.nombre',
        },
        {
            header: 'Stock',
            accessorKey: 'stock',
        },
        {
            header: 'Stock Maximo',
            accessorKey: 'local.stock_maximo',
        },
        {
            header: 'Icono', //icono de alerta
            accessorKey: 'icono',
            Cell: ({ row }) => {
                const item = row.original;

                let iconColor = '#6b6f75';


                if (item.stock >= Number(item.local.stock_maximo)){
                    iconColor = '#4caf50'; // exceso (verde)
                }

                return <NotificationsActiveIcon fontSize="small" htmlColor={iconColor} />;
            }
        },
    ]);

    //KPI de alertas
    const totAlertas = useMemo(() => alertasFiltradas.length, [alertasFiltradas]);
    const totAlertasMax = useMemo(() => alertasMaxFiltradas.length, [alertasMaxFiltradas]);
    
    const { totalCriticas, totalModeradas } = useMemo(() => {
        let criticas = 0;
        let moderadas = 0;
    
        alertasFiltradas.forEach(item => {
            if (item.stock < Number(item.producto.punto_reorden) * 0.5) {
                criticas++;
            } else {
                moderadas++;
            }
        });
    
        return { totalCriticas: criticas, totalModeradas: moderadas };
    }, [alertasFiltradas]);
    
    // Configuración de la tabla
    const table = useMaterialReactTable({
        columns,
        data: alertasFiltradas,
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
            rowsPerPageOptions: [1, 10, 20, 30],
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
        },

    });

    const tableAMaximas = useMaterialReactTable({
        columns:columnsMax,
        data: alertasMaxFiltradas,
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
            rowsPerPageOptions: [1, 10, 20, 30],
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
        },

    });

    const isLoadingData = loading || isLoading;
    
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                                    color: '#6c6a69',
                                    [theme.breakpoints.down('sm')]: {
                                        fontSize: 'small',
                                    },
                                }}
                            >
                                Total Alertas
                            </Typography>
                            {isLoadingData ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                <Typography
                                    sx={{
                                        fontSize: '5vh',
                                        fontWeight: 'bold',
                                        color: '#696969',
                                        [theme.breakpoints.down('sm')]: {
                                            fontSize: '3vh',
                                            fontWeight: 'bold'
                                        },
                                    }}
                                >
                                    {totAlertas + totAlertasMax}
                                </Typography>
                            )}
                        </ContenedorData>
                    </CardData>
                    <CardData>
                        <Logo><NotificationsActiveIcon fontSize="large" htmlColor="#ff3131" /></Logo>
                        <ContenedorData>
                            <Typography sx={{
                                fontSize: 'small',
                                color: '#6c6a69'
                            }}
                            >
                                Productos Criticos
                            </Typography>
                            {isLoadingData ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                <Typography
                                    sx={{
                                        fontSize: '5vh',
                                        fontWeight: 'bold',
                                        color: '#ff3131',
                                        [theme.breakpoints.down('sm')]: {
                                            fontSize: '3vh',
                                            fontWeight: 'bold'
                                        },
                                    }}
                                >
                                    {totalCriticas}
                                </Typography>
                            )}
                        </ContenedorData>
                    </CardData>
                    <CardData>
                        <Logo><NotificationsActiveIcon fontSize="large" htmlColor="#ff914d" /></Logo>
                        <ContenedorData>
                            <Typography sx={{
                                fontSize: 'small',
                                color: '#6c6a69',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: 'small',
                                },
                            }}
                            >
                                Productos Moderados
                            </Typography>
                                {isLoadingData ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    <Typography sx={{
                                        fontSize: '5vh',
                                        fontWeight: 'bold',
                                        color: '#ff914d',
                                        [theme.breakpoints.down('sm')]: {
                                            fontSize: '3vh',
                                            fontWeight: 'bold'
                                        },
                                    }}
                                    >
                                    {totalModeradas}
                                    </Typography>
                                )}
                        </ContenedorData>
                    </CardData>
                    <CardData>
                        <Logo><NotificationsActiveIcon fontSize="large" htmlColor="#4caf50" /></Logo>
                        <ContenedorData>
                            <Typography sx={{
                                fontSize: 'small',
                                color: '#6b6f75'
                            }}
                            >
                                Prod. Stock Maximo
                            </Typography>
                            {isLoadingData ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                <Typography sx={{
                                    fontSize: '5vh',
                                    fontWeight: 'bold',
                                    color: '#4caf50',
                                    [theme.breakpoints.down('sm')]: {
                                        fontSize: '3vh',
                                        fontWeight: 'bold'
                                    },
                                }}
                                >
                                    {totAlertasMax}
                                </Typography>
                            )}
                        </ContenedorData>
                    </CardData>
                </Fondo>
                <Fondo>
                    {!tienePermisoEspecifico && (
                        <CardFiltros>
                            <Box sx={{ width: { xs: 365, md: '100%' } }}>
                                <Select
                                    options={opcionesFiltros.locales}
                                    value={selectedLocal}
                                    onChange={setSelectedLocal}
                                    placeholder="Filtrado por tienda"
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
                        </CardFiltros>
                    )}
                    <CardFiltros>
                        <Box sx={{ width: { xs: 365, md: '100%' } }}>
                            <Select
                                options={opcionesFiltros.rangoMensual}
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
                    </CardFiltros>
                </Fondo>
                <BoxTabla>
                    <FondoReport>
                        <CardReport>
                            <Button
                                variant="contained"
                                startIcon={
                                    <DownloadIcon
                                        sx={{
                                            margin: '0% 3% 0% 0%',
                                            fontSize: "large"
                                        }}
                                    />
                                }
                                sx={{
                                    size: 'medium',
                                    backgroundColor: '#ffffff',
                                    color: '#6b6f75',
                                    width: '100%',
                                    height: '7vh',
                                    '&:hover': {
                                        backgroundColor: '#217346',
                                        color: '#FFFFFF',
                                    },
                                    '&:focus': {
                                        outline: 'none',
                                        backgroundColor: '#217346',
                                    },
                                    boxShadow: theme.shadows[3]
                                }}
                                onClick={() => handleExport('excel')}
                            >
                                Exportar Excel
                            </Button>
                        </CardReport>
                        <CardReport>
                            <Button
                                variant="contained"
                                startIcon={
                                    <DownloadIcon
                                        sx={{
                                            margin: '0% 3% 0% 0%',
                                            fontSize: "large"
                                        }}
                                    />
                                }
                                sx={{
                                    size: 'medium',
                                    backgroundColor: '#ffffff',
                                    color: '#6b6f75',
                                    width: '100%',
                                    height: '7vh',
                                    '&:hover': {
                                        backgroundColor: '#FF0000',
                                        color: '#FFFFFF',
                                    },
                                    '&:focus': {
                                        outline: 'none',
                                        backgroundColor: '#FF0000',
                                    },
                                    boxShadow: theme.shadows[3]
                                }}
                                onClick={() => handleExport('pdf')}
                            >
                                Exportar PDF
                            </Button>
                        </CardReport>
                    </FondoReport>
                    <Box sx={{ maxHeight: '500px', overflowY: 'auto', width: '100%' }}>
                        <Suspense fallback={<CircularProgress />}>
                            <MaterialReactTable table={table} />
                        </Suspense>
                    </Box>
                </BoxTabla>
                <BoxTabla sx={{ marginTop: '3%' }}>
                    <Box sx={{ maxHeight: '500px', overflowY: 'auto', width: '100%' }}>
                        <Suspense fallback={<CircularProgress />}>
                            <MaterialReactTable table={tableAMaximas} />
                        </Suspense>
                    </Box>
                </BoxTabla>
            </DashboardLayout>
        </LocalizationProvider>
    )
};

export default AppAlerta;