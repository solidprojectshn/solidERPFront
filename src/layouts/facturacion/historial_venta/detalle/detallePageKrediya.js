import { React, useState, useMemo, useEffect, Suspense } from "react";
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import DashboardLayout from "../../../../examples/LayoutContainers/DashboardLayoutFb";
import styled from "@emotion/styled";
import { CssBaseline, Box, Button, TextField, Typography, RadioGroup, FormControlLabel, Radio, CircularProgress, Alert, formControlClasses } from "@mui/material";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { useParams } from "react-router-dom";
import { MRT_Localization_ES } from 'material-react-table/locales/es';

//pdf
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import logo from './../../../../assets/images/LogoSolid.png';
import { format } from 'date-fns'

import { numberToWords, numberToWordsWithDecimals } from './helpers';


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
    alignItems: 'baseline',
    justifyContent: 'space-around',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        height: 'auto',
    },
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        height: 'auto',
    },
    [theme.breakpoints.down('lg')]: {
        height: 'auto',
    },
    [theme.breakpoints.down('xl')]: {
        height: 'auto',
    }
}));

const CarsData = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    background: '#ffffff',
    border: '1px solid #ffffff',
    borderRadius: '10px',
    width: '30%',
    height: 'auto',
    margin: '1%',
    boxShadow: theme.shadows[3],
    [theme.breakpoints.down('sm')]: {
        height: 'auto',
        width: '95%',
        margin: '2%',
    },
    [theme.breakpoints.down('md')]: {
        height: 'auto',
        width: '95%',
        margin: '2%',
    },
    [theme.breakpoints.down('lg')]: {
        height: 'auto',
        width: '20%',
        margin: '2%',
    },
    [theme.breakpoints.down('xl')]: {
        height: 'auto',
        width: '95%',
        margin: '2%',
    }
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
    marginTop: '2%',
    boxShadow: theme.shadows[3],
}));

//estilos - detalle factura
const BoxDellFactura = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    width: '100%',
    height: 'auto', // Ajuste para que no se quede fijo en 42vh
    margin: '2% 0% 1% 0%',
    backgroundColor: '#ffffff',
    boxShadow: theme.shadows[3],
    [theme.breakpoints.down('sm')]: { // Ajustes para pantallas pequeñas
        flexDirection: 'column', // Cambiar a columna en pantallas pequeñas
        padding: '2%',
    },
}));

const BoxDetalle = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    width: '50%',
    height: 'auto', // Ajuste automático de la altura
    margin: '0.5%',
    backgroundColor: '#ffffff',
    [theme.breakpoints.down('sm')]: {
        width: '100%', // Ocupa el 100% en pantallas pequeñas
        margin: '1%',
    },
}));

const BoxDetalletot = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    width: '30%',
    height: 'auto',
    margin: '0.5%',
    backgroundColor: '#ffffff',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        margin: '1%',
    },
}));

const BoxMetodoP = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '98%',
    height: '48%',
    margin: '0.5%',
    backgroundColor: '#ffffff',
    //boxShadow: theme.shadows[3],
    border: '1px solid #cdcdcd',
    [theme.breakpoints.down('sm')]: {
        padding: '2%',
        margin: '1%',
    },
}));

const BoxCantPago = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '98%',
    height: '50%',
    margin: '0.5%',
    backgroundColor: '#ffffff',
    //boxShadow: theme.shadows[3],
    border: '1px solid #cdcdcd',
    [theme.breakpoints.down('sm')]: {
        padding: '2%',
        margin: '1%',
        flexDirection: 'column', // Ajuste para pantallas pequeñas, usando columna
    },
}));

const CarsDataPago = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    background: '#ffffff',
    border: '1px solid #ffffff',
    width: '98%', // Ajuste al 100% para que no se desborde
    height: '90%',
    margin: '1%',
    [theme.breakpoints.down('sm')]: {
        width: '100%', // En pantallas pequeñas, ocupará todo el ancho
    },
}));

const CardBtn = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    width: '30%',
    height: 'auto', // Ajuste automático de la altura
    margin: '0.5%',
    backgroundColor: '#ffffff',
    [theme.breakpoints.down('sm')]: {
        width: '100%', // Ocupa el 100% en pantallas pequeñas
        margin: '1%',
    },
}));

const BoxTotales = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '98%',
    height: '98%', // Deja que la altura se ajuste automáticamente
    margin: '1%',
    border: '1px solid #cdcdcd',
    //boxShadow: theme.shadows[3],
    backgroundColor: '#ffffff',
    [theme.breakpoints.down('sm')]: {
        padding: '2%',
        margin: '1%',
    },
}));

const CarsDetalleT = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    border: '1px solid #ffffff',
    width: '98%',
    height: 'auto', // Ajusta la altura automáticamente
    margin: '1%',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column', // Ajusta a columna en pantallas pequeñas
        margin: '1%',
    },
}));

const BtnGenerar = styled(Button)(({ theme }) => ({
    width: '98%',
    margin: '1%',
    height: '98%',
    backgroundColor: '#d31717',
    color: '#ffffff',
    boxShadow: theme.shadows[3],
    borderRadius: '5px',
    '&:hover': {
        backgroundColor: '#333333',
        color: '#ffffff',
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%', // En pantallas pequeñas, ocupa todo el ancho
        margin: '2% 0',
    },
}));

import {
    getVentaById
} from "../../../../redux/facturacion/ventas/actions";

import {
    getInfoEmpresa
} from "../../../../redux/mantenimientos/Empresa/actions";

import { useDispatch, useSelector } from "react-redux";
import { item } from "examples/Sidenav/styles/sidenavItem";

const DetallePageKrediya = () => {
    const { idVenta } = useParams()
    const dispatch = useDispatch()

    const {
        venta,
        ventaByIdError,
        loadingById
    } = useSelector((store) => store.ventas);

    const {
        loading: loadingInfoEmpresa,
        empresas: infoEmpresa,
        empresaError
    } = useSelector((store) => store.empresa);

    useEffect(() => {
        dispatch(getVentaById(idVenta));
    }, [idVenta]);

    useEffect(() => {
        dispatch(getInfoEmpresa());
        console.log("Info:", infoEmpresa);
    }, [dispatch]);

    const data = venta?.detalle || []

    console.log("data:", data);
    console.log("datos venta:", venta);
    const empresa = infoEmpresa?.[0] || {};
    console.log("info extraida", empresa);

    //pdf
    const generatePDF = () => {
        const doc = new jsPDF();

        //fecha formato
        const fechaOriginal = venta.fecha_venta;
        const fecha = format(new Date(fechaOriginal), 'dd-MM-yyyy');
        const hora = format(new Date(fechaOriginal), 'HH:mm:ss');

        //logo
        doc.addImage(logo, 'PNG', 7, -13, 50, 50);

        // Encabezado
        doc.setFontSize(9);
        doc.text('FACTURA DE PRUEBA', 15, 24);
        doc.text(`R.T.N: ${empresa.rtn}`, 15, 28); //(x,y)

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(`DIRECCIÓN:${empresa.direccion}`, 15, 32);
        doc.text(`TEL: ${empresa.telefono}`, 15, 35);
        doc.text(`Correo Electronico:${empresa.correo}`, 15, 38);
        doc.text(`C.A.I: ${venta.rango_factura.cai}`, 15, 41);
        doc.text(`RANGO AUTORIZADO DEL ${venta.rango_inicio} AL ${venta.rango_final} `, 15, 44);
        doc.text(`Fecha límite de Emisión: ${venta.rango_factura.fecha_vencimiento} `, 15, 48);

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

        //rtn
        doc.setFillColor(0, 0, 0);
        doc.roundedRect(130, 52, 20, 10, 1, 1, "F");

        doc.setFont("helvetica", "bold");
        doc.setTextColor(225, 225, 255)
        doc.text(`RTN:`, 137, 58);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0)
        doc.text(`${venta.rtn || ""}`, 157, 58);

                // ---------------- DNI ----------------
        doc.setFillColor(0, 0, 0);
        doc.roundedRect(15, 64, 20, 10, 1, 1, "F");  // sube Y a 64
        doc.setDrawColor(0, 0, 0);
        doc.roundedRect(15, 64, 180, 10, 1, 1, "D");

        doc.setFont("helvetica", "bold");
        doc.setTextColor(225, 225, 255)
        doc.text(`DNI:`, 17, 70);  // texto también más abajo
        doc.setTextColor(0, 0, 0)
        doc.text(`${venta.cliente.dni || ""}`, 40, 70);

        // ---------------- TELEFONO ----------------
        doc.setFillColor(0, 0, 0);
        doc.roundedRect(130, 64, 20, 10, 1, 1, "F"); // sube Y a 64

        doc.setFont("helvetica", "bold");
        doc.setTextColor(225, 225, 255)
        doc.text(`Teléfono:`, 133, 70);  // texto más abajo
        doc.setTextColor(0, 0, 0)
        doc.text(`${venta.cliente.telefono || ""}`, 157, 70);

        // Tabla con los detalles de los productos
        const tableData = data.map((item) => [
            item.cantidad || 0,
            item.producto_asignado?.producto?.nombre || 'N/A',
            //precio del producto
            ((item.producto_asignado?.producto?.precio_venta) || 0).toLocaleString('es-HN', {
                style: 'currency',
                currency: 'HNL',
            }),
            item.unidad?.numero_serie || 'N/A',
            ('' || 0).toLocaleString('es-HN', {
                style: 'currency',
                currency: 'HNL',
            }),
            (((venta?.prima) * item.cantidad) || 0).toLocaleString('es-HN', {
                style: 'currency',
                currency: 'HNL',
            }),
        ]);
        
        // subtotal
        const subtotF = data.reduce((acc, item) => acc + ((venta?.prima) * item.cantidad || 0), 0);
        // Formatear el total final como moneda
        const subtotFFormatted = subtotF.toLocaleString('es-HN', {
            style: 'currency',
            currency: 'HNL',
        });

        const importeDelQuince = (subtotF / 1.15);
        const importeDelQuinceFormateado = importeDelQuince.toLocaleString('es-HN', {
            style: 'currency',
            currency: 'HNL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        const impuestoDelQuince = (importeDelQuince * 0.15);
        const impuestoFormateado = impuestoDelQuince.toLocaleString('es-HN', {
            style: 'currency',
            currency: 'HNL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        // const impuestoDelQuince = (subtotF * 0.15);
        // const impuestoFormateado = impuestoDelQuince.toLocaleString('es-HN', {
        //     style: 'currency',
        //     currency: 'HNL',
        //     minimumFractionDigits: 2,
        //     maximumFractionDigits: 2
        // });

        // const total = (subtotF+impuestoDelQuince);
        // const totalFormateado = total.toLocaleString('es-HN', {
        //     style: 'currency',
        //     currency: 'HNL',
        //     minimumFractionDigits: 2,
        //     maximumFractionDigits: 2
        // });

        const total = (importeDelQuince+impuestoDelQuince);
        const totalFormateado = total.toLocaleString('es-HN', {
            style: 'currency',
            currency: 'HNL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        const porPagar = Number(venta?.total || 0) - Number(venta?.prima || 0);
        const porPagarFormateado = porPagar.toLocaleString('es-HN', {
        style: 'currency',
        currency: 'HNL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
        });

        const TotalProductoFormatted = Number(venta?.total || 0).toLocaleString('es-HN', {
            style: 'currency',
            currency: 'HNL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        // Tabla con los detalles de los productos
        autoTable(doc, {
            startY: 80,
            head: [['CANTIDAD', 'DESCRIPCION', 'PRECIO UNITARIO','SERIE', 'DESCUENTOS Y REBAJAS OTORGADOS', 'TOTAL']],
            body: tableData,
            foot: [['', '', '','TOTAL', '', subtotFFormatted]],
            styles: {
                fontSize: 7, // Tamaño general del texto
            },
            headStyles: {
                fontSize: 7,
                fillColor: [220, 220, 220],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
            },
            footStyles: {
                halign: 'left',
                fillColor: [230, 230, 230],
                fontStyle: 'bold',
                textColor: '#000000',
            },
        });

        let currentY = doc.lastAutoTable.finalY + 10; // 10 de margen

        const totalRedondeado = total.toFixed(2);
        const totalWord = numberToWordsWithDecimals(totalRedondeado);

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
        doc.text(`${totalWord}`, 55, currentY + 6);

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

        currentY = doc.lastAutoTable.finalY + 10; // Ajusta la posición Y para la nota
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100); // Color gris para diferenciar la nota
        // doc.text("Nota: Los totales de esta factura refleja el pago de primas por telefonos Krediya", 15, currentY);
        
        currentY = doc.lastAutoTable.finalY + 15;

        const tableTotales = [
            ['IMPORTE EXONERADO', ''],
            ['IMPORTE EXENTO', ''],
            // ['IMPORTE AGRAVADO 15%',''],
            ['IMPORTE GRAVADO 15%',importeDelQuinceFormateado],
            ['IMPORTE GRAVADO 18%', ''],
            ['ISV 15%', impuestoFormateado],
            ['ISV 18%', ''],
            ['TOTAL COMPRA', TotalProductoFormatted],
            ['TOTAL PRIMA', totalFormateado],
            ['PENDIENTE DE PAGAR', porPagarFormateado],
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

        // Descargar el PDF
        doc.save(`Factura_Venta_${venta?.id || 'N/A'}.pdf`);
    };

    //tabla
    const columns = useMemo(() => [
        {
            header: 'Producto',
            accessorKey: 'producto_asignado.producto.nombre',
        },
        {
            header: 'Unidad',
            accessorKey: 'unidad.numero_serie',
        },
        {
            header: 'Cantidad',
            accessorKey: 'cantidad',
        },
        {
            header: 'Precio de Venta',
            accessorKey: 'precio_venta',
            Cell: ({ cell }) => {
                const price = Number(cell.getValue());
                return price ? price.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }) : '-';
            },
        },
        {
            header: 'Subtotal',
            accessorKey: 'subtotal',
            Cell: ({ row }) => {
                const cantidad = row.getValue('cantidad');
                const precio = row.getValue('precio_venta');
                const subtotal = cantidad * precio;
                return subtotal ? subtotal.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }) : '-';
            },
        },

    ], [data]);

    const table = useMaterialReactTable({
        columns,
        data: data,
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


    });
    return (
        <DashboardLayout>
            <CssBaseline />
            <BoxNav>
                <DashboardNavbar />
            </BoxNav>
            {loadingById ? (
                <div className="py-3 flex justify-center">
                    <CircularProgress />
                </div>
            ) : (
                <div>
                    <Fondo>
                        {
                            ventaByIdError && (
                                <Alert severity="error">{ventaByIdError}</Alert>
                            )
                        }
                        <CarsData>
                            <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }} >
                                Local
                            </Typography>
                            <TextField
                                disabled
                                variant='outlined'
                                value={venta?.local?.nombre || ""}
                                inputProps={{
                                    style: {
                                        color: '#000000',
                                        fontSize: 'small',
                                        fontWeight: 'bold',
                                        padding: '0',
                                    }
                                }}
                                sx={{
                                    width: '95%',
                                    margin: '0% 2% 2% 2%',
                                    height: '6.6vh',
                                    '& .MuiOutlinedInput-root': {
                                        height: '100%',
                                        '& input': {
                                            height: '100%',
                                            padding: '0 14px',
                                        }
                                    }
                                }}
                            />
                        </CarsData>
                        <CarsData>
                            <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }}>
                                Número De Factura
                            </Typography>
                            <TextField
                                disabled
                                variant='outlined'
                                value={venta?.num_factura || ""}
                                placeholder="Correlativo"
                                inputProps={{
                                    style: {
                                        color: '#000000',
                                        fontSize: 'small',
                                        fontWeight: 'bold',
                                        padding: '0',
                                    }
                                }}
                                sx={{
                                    width: '95%',
                                    margin: '0% 2% 2% 2%',
                                    height: '6.6vh',
                                    '& .MuiOutlinedInput-root': {
                                        height: '100%',
                                        '& input': {
                                            height: '100%',
                                            padding: '0 14px',
                                        }
                                    }
                                }}
                            />
                        </CarsData>
                        <CarsData>
                            <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }}>
                                Cliente
                            </Typography>
                            <TextField
                                disabled
                                variant='outlined'
                                value={venta?.cliente?.nombre_completo || ""}

                                inputProps={{
                                    style: {
                                        color: '#000000',
                                        fontSize: 'small',
                                        fontWeight: 'bold',
                                        padding: '0',
                                    }
                                }}
                                sx={{
                                    width: '95%',
                                    margin: '0% 2% 2% 2%',
                                    height: '6.6vh',
                                    '& .MuiOutlinedInput-root': {
                                        height: '100%',
                                        '& input': {
                                            height: '100%',
                                            padding: '0 14px',
                                        }
                                    }
                                }}
                            />
                        </CarsData>
                    </Fondo>

                    <BoxTabla>
                        <Box sx={{ maxHeight: '500px', overflowY: 'auto', width: '100%' }}>
                            <Suspense fallback={<CircularProgress />}>
                                <MaterialReactTable table={table} />
                            </Suspense>
                        </Box>
                    </BoxTabla>
                    <BoxDellFactura>
                        <BoxDetalle>
                            <BoxMetodoP>
                                <CarsDataPago>
                                    <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }}>
                                        Colaborador
                                    </Typography>
                                    <TextField
                                        variant='outlined'
                                        disabled={true}
                                        value={venta?.empleado?.nombre_completo || ""}
                                        inputProps={{
                                            style: {
                                                color: '#000000',
                                                fontSize: 'small',
                                                fontWeight: 'bold',
                                                padding: '0',
                                                whiteSpace: "normal", // Permite el ajuste de líneas
                                                overflow: "visible", // Evita cortar texto
                                                textOverflow: "ellipsis", // Agrega "..." si el texto es demasiado largo (opcional)
                                            }
                                        }}
                                        sx={{
                                            width: '95%',
                                            margin: '0% 2% 2% 2%',
                                            height: '6.6vh',
                                            '& .MuiOutlinedInput-root': {
                                                height: '100%',
                                                '& input': {
                                                    height: '100%',
                                                    padding: '0 14px',
                                                }
                                            }
                                        }}
                                    />
                                </CarsDataPago>

                            </BoxMetodoP>
                            <BoxCantPago>
                                <h5 className="font-bold p-2 my-2 bg-yellow-50">Pago Artículos</h5>
                                {(venta?.metodos_pagos && venta?.metodos_pagos.length > 0 ? venta.metodos_pagos : []).map(
                                    (item, index) => {
                                        return (
                                            <CarsDataPago key={index}>
                                                <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }}>
                                                    {item.metodo_pago.nombre}
                                                </Typography>
                                                <TextField
                                                    variant='outlined'
                                                    disabled={true}
                                                    value={Number(item.monto).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
                                                    inputProps={{
                                                        style: {
                                                            color: '#000000',
                                                            fontSize: 'small',
                                                            fontWeight: 'bold',
                                                            padding: '0',
                                                        }
                                                    }}
                                                    sx={{
                                                        width: '95%',
                                                        margin: '0% 2% 2% 2%',
                                                        height: '6.6vh',
                                                        '& .MuiOutlinedInput-root': {
                                                            height: '100%',
                                                            '& input': {
                                                                height: '100%',
                                                                padding: '0 14px',
                                                            }
                                                        }
                                                    }}
                                                />
                                            </CarsDataPago>
                                        )
                                    }
                                )}
                            </BoxCantPago>
                            {(venta?.recarga_metodos_pagos && venta?.recarga_metodos_pagos.length > 0) && (
                                <BoxCantPago>
                                    <h5 className="font-bold p-2 my-2 bg-yellow-50">Pago Recarga</h5>
                                    {(venta?.recarga_metodos_pagos && venta?.recarga_metodos_pagos.length > 0 ? venta.recarga_metodos_pagos : []).map(
                                        (item, index) => {
                                            return (
                                                <CarsDataPago key={index}>
                                                    <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }}>
                                                        {item.metodo_pago.nombre}
                                                    </Typography>
                                                    <TextField
                                                        variant='outlined'
                                                        disabled={true}
                                                        value={Number(item.monto).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
                                                        inputProps={{
                                                            style: {
                                                                color: '#000000',
                                                                fontSize: 'small',
                                                                fontWeight: 'bold',
                                                                padding: '0',
                                                            }
                                                        }}
                                                        sx={{
                                                            width: '95%',
                                                            margin: '0% 2% 2% 2%',
                                                            height: '6.6vh',
                                                            '& .MuiOutlinedInput-root': {
                                                                height: '100%',
                                                                '& input': {
                                                                    height: '100%',
                                                                    padding: '0 14px',
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </CarsDataPago>
                                            )
                                        }
                                    )}
                                </BoxCantPago>
                            )}


                        </BoxDetalle>
                        <BoxDetalletot>
                            <BoxTotales>
                                <CarsDetalleT>
                                    <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }}>
                                        Subtotal
                                    </Typography>
                                    <TextField
                                        variant='outlined'
                                        value={((venta?.prima > 0 ? Number(venta?.prima) : Number(venta?.total)) / 1.15).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }) || "-"}
                                        inputProps={{
                                            style: {
                                                color: '#000000',
                                                fontSize: 'small',
                                                fontWeight: 'bold',
                                                padding: '0',
                                            }
                                        }}
                                        sx={{
                                            width: '95%',
                                            margin: '0% 2% 2% 2%',
                                            height: '6.6vh',
                                            '& .MuiOutlinedInput-root': {
                                                height: '100%',
                                                '& input': {
                                                    height: '100%',
                                                    padding: '0 14px',
                                                }
                                            }
                                        }}
                                    />
                                </CarsDetalleT>
                                <CarsDetalleT>
                                    <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }}>
                                        ISV
                                    </Typography>
                                    <TextField
                                        variant='outlined'
                                        value={(((venta?.prima > 0 ? Number(venta?.prima) : Number(venta?.total)) / 1.15) * 0.15).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }) || "-"}
                                        inputProps={{
                                            style: {
                                                color: '#000000',
                                                fontSize: 'small',
                                                fontWeight: 'bold',
                                                padding: '0',
                                            }
                                        }}
                                        sx={{
                                            width: '95%',
                                            margin: '0% 2% 2% 2%',
                                            height: '6.6vh',
                                            '& .MuiOutlinedInput-root': {
                                                height: '100%',
                                                '& input': {
                                                    height: '100%',
                                                    padding: '0 14px',
                                                }
                                            }
                                        }}
                                    />
                                </CarsDetalleT>
                                {venta?.prima > 0 && (
                                    <CarsDetalleT>
                                        <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }}>
                                            Prima:
                                        </Typography>
                                        <TextField
                                            variant='outlined'
                                            value={Number(venta?.prima).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }) || "-"}
                                            inputProps={{
                                                style: {
                                                    color: '#000000',
                                                    fontSize: 'small',
                                                    fontWeight: 'bold',
                                                    padding: '0',
                                                }
                                            }}
                                            sx={{
                                                width: '95%',
                                                margin: '0% 2% 2% 2%',
                                                height: '6.6vh',
                                                '& .MuiOutlinedInput-root': {
                                                    height: '100%',
                                                    '& input': {
                                                        height: '100%',
                                                        padding: '0 14px',
                                                    }
                                                }
                                            }}
                                        />
                                    </CarsDetalleT>
                                )}
                                <CarsDetalleT>
                                    <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }}>
                                        {venta?.prima > 0 ? "Total Venta" : "Total"}
                                    </Typography>
                                    <TextField
                                        variant='outlined'
                                        value={Number(venta?.total).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }) || "-"}
                                        inputProps={{
                                            style: {
                                                color: '#000000',
                                                fontSize: 'small',
                                                fontWeight: 'bold',
                                                padding: '0',
                                            }
                                        }}
                                        sx={{
                                            width: '95%',
                                            margin: '0% 2% 2% 2%',
                                            height: '6.6vh',
                                            '& .MuiOutlinedInput-root': {
                                                height: '100%',
                                                '& input': {
                                                    height: '100%',
                                                    padding: '0 14px',
                                                }
                                            }
                                        }}
                                    />
                                </CarsDetalleT>
                                {venta?.prima > 0 && (
                                    <CarsDetalleT>
                                        <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }}>
                                            Pendiente por pagar
                                        </Typography>
                                        <TextField
                                            variant='outlined'
                                            value={(Number(venta?.total) - Number(venta?.prima)).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }) || "-"}
                                            inputProps={{
                                                style: {
                                                    color: '#000000',
                                                    fontSize: 'small',
                                                    fontWeight: 'bold',
                                                    padding: '0',
                                                }
                                            }}
                                            sx={{
                                                width: '95%',
                                                margin: '0% 2% 2% 2%',
                                                height: '6.6vh',
                                                '& .MuiOutlinedInput-root': {
                                                    height: '100%',
                                                    '& input': {
                                                        height: '100%',
                                                        padding: '0 14px',
                                                    }
                                                }
                                            }}
                                        />
                                    </CarsDetalleT>
                                )
                                }
                            </BoxTotales>
                        </BoxDetalletot>
                        <CardBtn>
                            <BtnGenerar onClick={generatePDF} disabled={loadingById}>Imprimir Copia</BtnGenerar>
                        </CardBtn>
                    </BoxDellFactura>
                </div>
            )}
        </DashboardLayout>
    )
}

export default DetallePageKrediya;