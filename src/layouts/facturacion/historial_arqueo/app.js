import { React, useMemo, useState, useEffect } from "react";
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import styled from "@emotion/styled";
import { CssBaseline, Box, Typography, useTheme, CircularProgress, Button, IconButton } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
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
    getArqueo
} from "../../../redux/facturacion/arqueo/actions";
import moment from "moment";
import { useNavigate } from "react-router-dom";

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
    padding: '2%',
    boxShadow: theme.shadows[3]
}));

// Función para exportar a PDF
const exportToPDF = (data) => {
    const doc = new jsPDF();

    // Título del reporte
    doc.setFontSize(16);
    doc.text("Reporte de Arqueos", 14, 10);

    // Tabla de datos
    doc.autoTable({
        head: [['Local', 'Fecha de Arqueo', 'Total Arqueado', 'Fondo Fijo', 'Diferencia', 'Saldo Final', 'Creado Por']],
        body: data.map(item => [
            item.local.nombre,
            new Date(item.fecha_arqueo).toLocaleString(), // Formato legible de fecha
            `$${item.total_efectivo_arqueado}`,
            `$${item.fondo_fijo}`,
            `$${item.diferencia}`,
            `$${item.saldo_final}`,
            item.creado_por,
        ]),
        startY: 20, // Margen desde la parte superior
    });

    // Guardar el PDF
    doc.save("reporte_arqueos.pdf");
};

// Función para exportar a Excel
const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(
        data.map(item => ({
            Local: item.local.nombre,
            'Fecha de Arqueo': new Date(item.fecha_arqueo).toLocaleString(), // Fecha legible
            'Total Arqueado': `$${item.total_efectivo_arqueado}`,
            'Fondo Fijo': `$${item.fondo_fijo}`,
            Diferencia: `$${item.diferencia}`,
            'Saldo Final': `$${item.saldo_final}`,
            'Creado Por': item.creado_por,
        }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Historial Arqueos');
    XLSX.writeFile(workbook, 'reporte_arqueos.xlsx');
};

const HistorialArqueo = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedLocal, setSelectedLocal] = useState(null);
    const [selectedAlertType, setSelectedAlertType] = useState(null);
    const [selectedRango, setSelectedRango] = useState(null);

    const {
        loading,
        loadingById,
        arqueoError,
        arqueos

    } = useSelector((store) => store.arqueos);



    const {
        user,
        permissions
    } = useSelector((store) => store.auth);

    const tienePermisoEspecifico = permissions.includes(PERMISOS.ACCEDER_HISTORIAL_ARQUEO_ESPECIFICO)
    const tieneLocal = user?.local_id || 0

    useEffect(() => {
        if(tienePermisoEspecifico){
            dispatch(getArqueo({
                local: tieneLocal
    
            }));
        } else{
            dispatch(getArqueo());
        }
       
    }, []);

    const goToDetail = (id) => {
        navigate(`/historial/Arqueo/detalle/${id}`);
    }

    // Opciones para el Select
    const opcionesFiltros = useMemo(() => {
        if (!arqueos) return { locales: [] };

        // Opciones únicas de locales
        const localesUnicos = Array.from(new Set(arqueos.map(item => item.local.nombre)));
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
    }, [arqueos]);

    const calcularFechas = (rango) => {
        const fechaFin = dayjs().endOf("month");
        const fechaInicio = dayjs().subtract(rango - 1, "month").startOf("month");
        return { fechaInicio, fechaFin };
    };

    const rangoFechas = useMemo(() => {
        if (!selectedRango) return null;
        return calcularFechas(selectedRango.value);
    }, [selectedRango]);

    const filteredData = useMemo(() => {
        if (!arqueos) return [];

        // Filtrado por local
        let data = selectedLocal?.value === "general"
            ? arqueos // Mostrar todas las alertas si "general" está seleccionado
            : selectedLocal
                ? arqueos.filter(item => item.local.nombre === selectedLocal.value)
                : arqueos;

        // Filtrado por rango de fechas
        if (rangoFechas) {
            data = data.filter(item => {
                const fechaAlerta = dayjs(item.fecha_creacion);
                return fechaAlerta.isBetween(rangoFechas.fechaInicio, rangoFechas.fechaFin, "day", "[]");

            });
        }

        return data;
    }, [arqueos, selectedLocal, rangoFechas]);

    const productosAlerta = useMemo(() => {
        if (!arqueos) return 0;

        // Filtrar por local
        let data = selectedLocal?.value === "general"
            ? arqueos // Mostrar todas las alertas si "general" está seleccionado
            : selectedLocal
                ? arqueos.filter(item => item.local.nombre === selectedLocal.value)
                : arqueos;

        // Filtrar por rango de fechas
        if (rangoFechas) {
            data = data.filter(item => {
                const fechaAlerta = dayjs(item.fecha_creacion);
                return fechaAlerta.isBetween(rangoFechas.fechaInicio, rangoFechas.fechaFin, "day", "[]"); // Inclusivo en ambos extremos
            });
        }

        // Contar la cantidad de productos que cumplen con los filtros
        return data.length;
    }, [arqueos, selectedLocal, rangoFechas]);

    //KPI's        
    const kpis = useMemo(() => {
        if (!filteredData || filteredData.length === 0) {
            return {
                promedioEfectivoArqueado: 'HNL 0.00',
                arqueosConDiferencia: 0,
            };
        }

        // Promedio de Total Efectivo Arqueado
        const promedioEfectivoArqueadoRaw =
            filteredData.reduce((sum, item) => sum + Number(item.total_efectivo_arqueado), 0) /
            filteredData.length;

        const promedioEfectivoArqueado = new Intl.NumberFormat('es-HN', {
            style: 'currency',
            currency: 'HNL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(promedioEfectivoArqueadoRaw);

        // Total de arqueos con diferencia
        const arqueosConDiferencia = filteredData.filter(item => Number(item.diferencia) !== 0).length;

        return {
            promedioEfectivoArqueado,
            arqueosConDiferencia,
        };

    }, [filteredData]);

    const handleExport = (format) => {
        const data = filteredData; // Datos filtrados actuales
        if (format === 'pdf') {
            exportToPDF(data);
        } else if (format === 'excel') {
            exportToExcel(data);
        }
    };

    const theme = useTheme();

    //tabla
    const columns = useMemo(() => [
        {
            header: 'Fecha',
            accessorKey: 'fecha_arqueo',
            Cell: ({ cell }) => {
                return moment(cell.getValue()).format('DD-MM-YYYY HH:mm:ss')
            }
        },
        {
            header: 'Local',
            accessorKey: 'local.nombre',
        },
        {
            header: 'Total Efectivo Arqueado',
            accessorKey: 'total_efectivo_arqueado',
            Cell: ({ cell }) => {
                return cell.getValue() ? Number(cell.getValue()).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }) : '-';
            }
        },
        {
            header: 'Fondo Fijo',
            accessorKey: 'fondo_fijo',
            Cell: ({ cell }) => {
                return cell.getValue() ? Number(cell.getValue()).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }) : '-';
            }
        },
        {
            header: 'Diferencia',
            accessorKey: 'diferencia',
            Cell: ({ cell }) => {
                return cell.getValue() ? Number(cell.getValue()).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }) : '-';
            }
        },
        {
            header: 'Saldo Inicial',
            accessorKey: 'saldo_inicial_recarga',
            Cell: ({ cell }) => {
                return cell.getValue() ? Number(cell.getValue()).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }) : '-';
            }
        },
        {
            header: 'Saldo Enviado',
            accessorKey: 'saldo_enviado',
            Cell: ({ cell }) => {
                return cell.getValue() ? Number(cell.getValue()).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }) : '-';
            }
        },
        {
            header: 'Recargas Guerrilla',
            accessorKey: 'recargas_guerrilla',
            Cell: ({ cell }) => {
                return cell.getValue() ? Number(cell.getValue()).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }) : '-';
            }
        },
        {
            header: 'Saldo Final',
            accessorKey: 'saldo_final',
            Cell: ({ cell }) => {
                return cell.getValue() ? Number(cell.getValue()).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }) : '-';
            }
        },

        {
            header: 'Acciones',
            id: 'acciones',
            Cell: ({ row }) => (
                <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                    <IconButton color="secondary" onClick={() => goToDetail(row.original.id_arqueo)}>
                        <VisibilityIcon />
                    </IconButton>
                </Box>
            ),
        }
    ]);

    // Configuración de la tabla
    const table = useMaterialReactTable({
        columns,
        data: filteredData,
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

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                            <Typography sx={{
                                fontSize: 'small',
                                color: '#6c6a69',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: 'small',
                                },
                            }}
                            >
                                Total Arqueos
                            </Typography>
                            <Typography sx={{
                                fontSize: '5vh',
                                fontWeight: 'bold',
                                color: '#696969',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: '1rem',
                                    fontWeight: 'bold'
                                },
                            }}
                            >
                                {productosAlerta}
                            </Typography>
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
                                Arqueos con Diferencia
                            </Typography>
                            <Typography sx={{
                                fontSize: '5vh',
                                fontWeight: 'bold',
                                color: '#ff3131',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold'
                                },
                            }}
                            >
                                {kpis.arqueosConDiferencia}
                            </Typography>
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
                                Promedio Arqueado
                            </Typography>
                            <Typography sx={{
                                fontSize: '5vh',
                                fontWeight: 'bold',
                                color: '#4caf50',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold'
                                },
                            }}
                            >
                                {kpis.promedioEfectivoArqueado}
                            </Typography>
                        </ContenedorData>
                    </CardData>
                </Fondo>
                <Fondo>
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
            </DashboardLayout>
        </LocalizationProvider>
    )
};

export default HistorialArqueo;