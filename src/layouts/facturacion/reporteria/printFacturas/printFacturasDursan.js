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

//pdf
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import logo from '../../../../assets/images/LogoDursan.png';
import { format } from 'date-fns';
import { numberToWordsWithDecimals } from "./detalle/helpers";

//icons
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

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
    backgroundColor: '#d31717',
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

import {
    getInfoEmpresa
} from "../../../../redux/mantenimientos/Empresa/actions";

import {
    getNumFactura,
} from "../../../../redux/facturacion/ventas/actions";

import { getRangoFactura } from "../../../../redux/mantenimientos/rango_factura/actions";

import { PERMISOS, TIPO_VENTA } from '../../../../services/constantes';
import moment from "moment";

const PrintFactDursan = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        ventas,
        ventaError,
        loading: loadingVenta
    } = useSelector((store) => store.ventas);

    const {
        numFactura,
        loadingNumFactura,
        numFacturaError,
    } = useSelector((store) => store.ventas);

    const {
        rangoFacturas,
        loading : loadingRangoF,
        rangoFacturaError,
    } = useSelector((store) => store.ventas);

    const {
        permissions
    } = useSelector((store) => store.auth);

    const {
        user
    } = useSelector((store) => store.auth);

    const {
        loading: loadingInfoEmpresa,
        empresas: infoEmpresa,
        empresaError
    } = useSelector((store) => store.empresa);

    const tienePermisoEspecifico = permissions.includes(PERMISOS.ACCEDER_ALERTAS_ESPECIFICO)
    const tieneLocal = user?.local_id || 0

    useEffect(() => {
        if(tienePermisoEspecifico){
            dispatch(getVenta({ tipo_venta: TIPO_VENTA.DURSAN , local: tieneLocal}));
        } else{
            dispatch(getVenta({ tipo_venta: TIPO_VENTA.DURSAN }));
        }
    }, [dispatch]);

    useEffect(() => {
        dispatch(getInfoEmpresa());
        dispatch(getRangoFactura());
        console.log("Info:",infoEmpresa);
    }, [dispatch]);

    const goToDetail = (id) => {
        navigate(`/historial/Venta/detalle/${id}`);
    }

    // Opciones para el selector
    const opcionesRango = [
        { value: 1, label: "Último mes" },
        { value: 2, label: "Últimos 2 meses" },
        { value: 3, label: "Últimos 3 meses" },
        { value: 12, label: "Último año" },
    ];

    const [rangoMeses, setRangoMeses] = useState(opcionesRango[0]);
    const [ventasFiltradas, setVentasFiltradas] = useState([]);
    const [totalFacturas, setTotalFacturas] = useState(0);
    const [totalVentas, setTotalVentas] = useState(0);

    const calcularFechas = (rango) => {
        const fechaFin = dayjs().endOf("month");
        const fechaInicio = dayjs().subtract(rango - 1, "month").startOf("month");
        return { fechaInicio, fechaFin };
    };

    useEffect(() => {
        const { fechaInicio, fechaFin } = calcularFechas(rangoMeses.value);
        console.log("Rango calculado:", { fechaInicio: fechaInicio.format(), fechaFin: fechaFin.format() });

        const ventasFiltradas = ventas?.filter((venta) => {
            const fechaVenta = dayjs(venta.fecha_venta);
            return fechaVenta.isBetween(fechaInicio, fechaFin, "day", "[]");
        });

        console.log("Ventas filtradas:", ventasFiltradas);

        const totalFacturas = ventasFiltradas?.length || 0;
        const totalVentas = ventasFiltradas?.reduce((sum, venta) => sum + parseFloat(venta.total), 0) || 0;

        setVentasFiltradas(ventasFiltradas);
        setTotalFacturas(totalFacturas);
        setTotalVentas(totalVentas);
    }, [rangoMeses, ventas]);


    // Formatear el total de ventas a Lempiras
    const formatoLempiras = (monto) =>
        new Intl.NumberFormat("es-HN", {
            style: "currency",
            currency: "HNL",
            minimumFractionDigits: 2,
        }).format(monto);

    const data = ventas?.detalle || []

    console.log("data:", data);
    const empresa = infoEmpresa?.[0] || {};
    const rangoF = rangoFacturas?.[0] || {};

    //pdf
    const generatePDF = () => {
        if (ventasFiltradas.length === 0) {
            console.warn("No hay ventas para generar PDF en el rango seleccionado.");
            return;
        }

        const doc = new jsPDF();

        ventasFiltradas.forEach((venta, index) => {

            if (index > 0) {
                doc.addPage();
            }

            //fecha formato
            const fechaOriginal = venta.fecha_venta;
            const fecha = format(new Date(fechaOriginal), 'dd-MM-yyyy');
            const hora = format(new Date(fechaOriginal), 'HH:mm:ss');

            //logo
            doc.addImage(logo, 'PNG', 7, -13, 50, 50);

            // Encabezado
            doc.setFontSize(9);
            doc.setTextColor("#000000");
            doc.text('RAZÓN SOCIAL DEL CLIENTE', 15, 24);
            doc.text(`R.T.N: ${empresa.rtn || "No disponible"}`, 15, 28); //(x,y)

            doc.setFontSize(8);
            doc.setTextColor("#000000");
            doc.setFont("helvetica", "normal");
            doc.text(`Direccion: ${empresa.direccion || "No disponible"}`, 15, 32);
            doc.text(`TEL: ${empresa.telefono || "No disponible"}`, 15, 35);
            doc.text(`Correo Electrónico: ${empresa.correo || "No disponible"}`, 15, 38);
            doc.text('C.A.I:', 15, 41);
            doc.text('RANGO AUTORIZADO DEL     AL ', 15, 44);
            doc.text('Fecha límite de Emisión:', 15, 48);

            doc.setTextColor("#ff0000");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(15);
            doc.text('COPIA FACTURA', 150, 12);
            doc.setFontSize(12);
            doc.text(`${venta.num_factura}`, 133, 19);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(15);
            doc.text('No.______________________', 120, 20);

            doc.setTextColor("#000000");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text('FECHA Y HORA:', 120, 38);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7);
            doc.text(`${fecha} ${hora}`, 150, 43);
            doc.text('_______________________________________________________', 120, 45);

            // Información del cliente
            doc.setFontSize(8);

            // diseño
            doc.setFillColor(0, 0, 0);
            doc.roundedRect(15, 52, 20, 10, 1, 1, "F");

            doc.setDrawColor(0, 0, 0);
            doc.roundedRect(15, 52, 180, 10, 1, 1, "D");

            doc.setFont("helvetica", "bold");
            doc.setTextColor(225, 225, 255)
            doc.text(`CLIENTE:`, 17, 58);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 0, 0)
            doc.text(`${venta.cliente.nombre_completo}`, 40, 58);

            // Tabla con los detalles de los productos
            const tableData = data.map((item) => [
                item.cantidad || 0,
                item.producto_asignado?.producto?.nombre || 'N/A',
                //precio del producto
                ((item.precio_venta / 1.15) || 0).toLocaleString('es-HN', {
                    style: 'currency',
                    currency: 'HNL',
                }),
                (('') || 0).toLocaleString('es-HN', {
                    style: 'currency',
                    currency: 'HNL',
                }),
                (((item.precio_venta / 1.15) * item.cantidad) || 0).toLocaleString('es-HN', {
                    style: 'currency',
                    currency: 'HNL',
                }),
            ]);

            // subtotal
            const subtotF = data.reduce((acc, item) => acc + ((item.precio_venta / 1.15) * item.cantidad || 0), 0);
            // Formatear el total final como moneda
            const subtotFFormatted = subtotF.toLocaleString('es-HN', {
                style: 'currency',
                currency: 'HNL',
            });

            // Tabla con los detalles de los productos
            autoTable(doc, {
                startY: 65,
                head: [['CANTIDAD', 'DESCRIPCION', 'PRECIO UNITARIO', 'DESCUENTOS', 'TOTAL']],
                body: tableData,
                foot: [['', '', 'SUBTOTAL', '', subtotFFormatted]],
                footStyles: {
                    halign: 'left',
                    fillColor: [230, 230, 230],
                    fontStyle: 'bold',
                    textColor: '#000000',
                },
            });

            let currentY = doc.lastAutoTable.finalY + 10; // 10 de margen

            const subTotDecimales = numberToWordsWithDecimals(subtotF);

            // Diseño: Valor en letras
            doc.setFillColor(0, 0, 0);
            doc.roundedRect(15, currentY, 35, 10, 1, 1, "F");
            doc.setDrawColor(0, 0, 0);
            doc.roundedRect(15, currentY, 180, 10, 1, 1, "D");
            doc.setFont("helvetica", "bold");
            doc.setTextColor(225, 225, 255);
            doc.text(`VALOR EN LETRAS:`, 18, currentY + 6);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 0, 0);
            doc.text(`${subTotDecimales}`, 55, currentY + 6);

            currentY += 20;

            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 0, 0);
            doc.text(`LA FACTURA ES BENEFICIO DE TODOS "EXIJALA"`, 75, currentY);

            const tableCalculo = [
                ['N° Correlativo de orden exenta', ''],
                ['N° Correlativo de constancia de registro exonerado', ''],
                ['N° identificativo del registro de la SAG', ''],
            ];
            autoTable(doc, {
                startY: currentY + 5,
                body: tableCalculo,
                styles: {
                    halign: 'left',
                    cellPadding: 2.5,
                    lineWidth: 0.1,
                    lineColor: [0, 0, 0],
                },
                columnStyles: {
                    0: { halign: 'left', cellWidth: 120 },
                    1: { halign: 'center', cellWidth: 60 },
                },
                tableWidth: '80',
            });

            currentY = doc.lastAutoTable.finalY + 10;

            const total = subtotF * 1.15;
            const totalFormateado = total.toLocaleString('es-HN', {
                style: 'currency',
                currency: 'HNL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            const impuestoDelQuince = total - subtotF;
            const impuestoFormateado = impuestoDelQuince.toLocaleString('es-HN', {
                style: 'currency',
                currency: 'HNL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });


            const tableTotales = [
                ['IMPORTE EXONERADO', ''],
                ['IMPORTE EXENTO', ''],
                ['IMPORTE AGRAVADO 15%', ''],
                ['IMPORTE AGRAVADO 18%', ''],
                ['ISV 15%', impuestoFormateado],
                ['ISV 18%', ''],
                ['TOTAL A PAGAR', totalFormateado],
            ];

            autoTable(doc, {
                startY: currentY,
                body: tableTotales,
                margin: { left: 75 },
                styles: {
                    halign: 'left',
                    cellPadding: 2.5,
                    lineWidth: 0.1,
                    lineColor: [0, 0, 0],
                    fontSize: 8,
                    fontStyle: 'bold',
                    textColor: '#000000',
                },
                columnStyles: {
                    0: { halign: 'left', cellWidth: 60 },
                    1: { halign: 'center', cellWidth: 60 },
                },
                tableWidth: '80',
            });

            // Ajustar el texto de garantía dinámicamente
            doc.setFillColor(0, 0, 0);
            doc.roundedRect(15, currentY, 55, 57, 1, 1, "F");

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(225, 225, 255);

            const garantiaLineas = [
                "Garantía por un año, únicamente en",
                "tiendas principales, la garantía solo",
                "cubre desperfectos de fábrica,",
                "no cubre golpes, humedad ni malas",
                "manipulaciones por el cliente,",
                "si daña la caja o pierde la factura",
                "automáticamente pierde su garantía."
            ];

            // Ajusta la posición inicial para el texto de garantía
            const startX = 18;
            const lineHeight = 5; // Espacio entre líneas

            // Verifica si el texto cabe en la página actual
            const pageHeight = doc.internal.pageSize.height;
            if (currentY + garantiaLineas.length * lineHeight > pageHeight - 10) {
                doc.addPage(); // Agrega una nueva página si es necesario
                currentY = 15; // Reinicia la posición Y en la nueva página
            }

            // Dibuja el texto línea por línea
            garantiaLineas.forEach((linea, index) => {
                const posY = (currentY + 10) + index * lineHeight;
                doc.text(linea, startX, posY);
            });

        });

        // Descargar el PDF
        doc.save('FacturasConsolidadas.pdf');
    }

    //tabla
    const columns = useMemo(() => [
        {
            header: 'N° Factura',
            accessorKey: 'num_factura',
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
            header: 'Fecha',
            accessorKey: 'fecha_venta',
            Cell: ({ cell }) => {
                return moment(cell.getValue()).format('DD-MM-YYYY HH:mm:ss')
            }
        },
        {
            header: 'Subtotal',
            accessorKey: 'subtotal',
            Cell: ({ row }) => {
                const total = Number(row.getValue("total"))
                const subtotal = (total / 1.15)
                return subtotal ? subtotal.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }) : '-';
            }
        },
        {
            header: 'ISV',
            accessorKey: 'isv',
            Cell: ({ row }) => {
                const total = Number(row.getValue("total"))
                const subtotal = (total / 1.15).toFixed(2)
                const isv = subtotal * 0.15
                return isv ? isv.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }) : '-';
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
        data: ventasFiltradas,
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
                            <BtnGenerar onClick={generatePDF} disabled={loadingVenta}>Imprimir Copias</BtnGenerar>
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
                                            fontSize: { sm: '1rem', md: '1.3rem' },
                                            fontWeight: 'bold',
                                            color: '#ff3131'
                                        }}>
                                            {totalFacturas}
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
                                            fontSize: { sm: '1rem', md: '1.3rem' },
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
                                    id="filtroRango"
                                    options={opcionesRango}
                                    value={rangoMeses}
                                    onChange={setRangoMeses}
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

export default PrintFactDursan;