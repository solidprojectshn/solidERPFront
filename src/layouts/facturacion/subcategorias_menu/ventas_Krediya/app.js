import { React, useMemo, useState, useEffect } from "react";
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { zodResolver } from "@hookform/resolvers/zod"// ESTO
import { z } from 'zod';// ESTO
import Select from 'react-select'
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

import { useForm, Controller, useFieldArray, set } from 'react-hook-form';// ESTO
import { useSelector, useDispatch } from "react-redux";// ESTO
import styled from "@emotion/styled";
import { CssBaseline, Box, Button, Grid, Typography, TextField, RadioGroup, FormControlLabel, Radio, IconButton, Checkbox, CircularProgress, Alert } from "@mui/material";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import ModalAddProducto from "./modalAddProducto";
import { MRT_Localization_ES } from 'material-react-table/locales/es';

import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";
import PrintComponent from "components/PrintComponent";

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

const CarsData = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    background: '#ffffff',
    border: '1px solid #ffffff',
    borderRadius: '10px',
    width: '50%',
    height: 'auto',
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

const BtnAdd = styled(Button)(({ theme }) => ({
    width: '20%',
    height: '7vh',
    margin: '2% 0% 2% 0%',
    backgroundColor: '#6a6a6a',
    color: '#ffffff',
    alignContent: 'center',
    boxShadow: theme.shadows[3],
    borderRadius: '5px',
    '&:hover': {
        backgroundColor: '#6a6a6a',
        color: '#ffffff'
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
}));

const BoxTabla = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    margin: '1% 0% 1% 0%',
    boxShadow: theme.shadows[3],
    [theme.breakpoints.down('md')]: {
        width: '99%',
        margin: '3% auto',
        height: 'auto',
    },
}));

//estilos - detalle factura
const BoxDellFactura = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    width: '100%',
    height: 'auto', // Ajuste para que no se quede fijo en 42vh
    margin: '1% 0% 1% 0%',
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
    border: '1px solid #cdcdcd',
    [theme.breakpoints.down('sm')]: {
        width: '98%', // Ocupa el 100% en pantallas pequeñas
        margin: '1%',
    },
}));

const BoxDetalletot = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
    height: 'auto',
    margin: '0.5%',
    backgroundColor: '#ffffff',
    [theme.breakpoints.down('sm')]: {
        width: '99%',
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
    boxShadow: theme.shadows[3],
    [theme.breakpoints.down('sm')]: { // Ajusta para pantallas pequeñas
        padding: '2%', // Aumenta el padding
        margin: '1%',
    },
}));

const BoxCantPago = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '98%',
    height: '50%',
    margin: '0.5%',
    backgroundColor: '#ffffff',
    boxShadow: theme.shadows[3],
    [theme.breakpoints.down('sm')]: { // Ajusta para pantallas pequeñas
        padding: '2%', // Aumenta el padding
        margin: '1%',
    },
}));

const CarsDataPago = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    background: '#ffffff',
    border: '1px solid #ffffff',
    width: '50%',
    height: '90%',
    margin: '1%'
}));

const BoxTotales = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '98%',
    height: 'auto', // mirar
    border: '1px solid #cdcdcd',
    //boxShadow: theme.shadows[3],
    backgroundColor: '#ffffff',
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
    height: 'auto',
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
    getLocal
} from "../../../../redux/mantenimientos/local/actions"

import {
    getProductoAsignado,
    getUnidades
} from "../../../../redux/inventario/agregarStock/actions"

import {
    getMetodoPago
} from "../../../../redux/mantenimientos/metodopago/actions"

import {
    getInfoEmpresa
} from "../../../../redux/mantenimientos/Empresa/actions"

import {
    saveVenta, getNumFactura, getTipoVenta
} from "../../../../redux/facturacion/ventas/actions"

import {
    getCliente
} from "../../../../redux/mantenimientos/clientes/actions"

import PrinterSelectionModal from "components/PrinterSelectionModal";
import qz from 'qz-tray';
import qzServices from "../../../../redux/facturacion/qzTray/qzTray.services";

import { COSTO_RECARGA, TIPO_LOCAL, TIPO_PRODUCTO, TIPO_VENTA } from '../../../../services/constantes';
import moment from "moment";
import { numberToWordsWithDecimals } from "../../historial_venta/detalle/helpers";

const VentasKrediya = () => {
    const dispatch = useDispatch();
    const [datosEmpresa, setDatosEmpresa] = useState(null)
    const [dataDetalle, setDataDetalle] = useState([])
    const [listaProductos, setListaProductos] = useState([])
    const [listaUnidades, setListaUnidades] = useState([])
    const username = JSON.parse(localStorage.getItem('user-info'))?.username
    const [isConnected, setIsConnected] = useState(false);
    const [printers, setPrinters] = useState([]);
    const [selectedPrinter, setSelectedPrinter] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [numeroKits, setNumeroKits] = useState(0)
    const [montoEsperadoRecarga, setMontoEsperadoRecarga] = useState(0)

    //definicion de las variables del reducer

    const {
        loading: loadingLocales,
        locales,
        localError
    } = useSelector((store) => store.local);
    const {
        loading: loadingMetodosPago,
        metodosPago,
        metodoPagoError
    } = useSelector((store) => store.metodoPago);

    const {
        loading: loadingClientes,
        clientes,
        clienteError
    } = useSelector((store) => store.cliente);

    const {
        numFactura,
        loadingNumFactura,
        numFacturaError,
        saveLoading,
        loading: loadingVenta,
        tipoVenta,
        loadingTipoVenta,
        tipoVentaError
    } = useSelector((store) => store.ventas);

    const localesOptions = locales ? locales.map((item) => ({ value: item.id_local, label: item.nombre })) : []

    const clientesOptions = clientes ? clientes.map((item) => ({ value: item.id_cliente, label: item.nombre_completo })) : []

    const totalTelefono = dataDetalle.reduce((acc, producto) => {
        return acc + (parseFloat(producto.precio_venta) * producto.cantidad);
    }, 0);

    const {
        user
    } = useSelector((store) => store.auth);

    const {
        loading: loadingInfoEmpresa,
        empresas: infoEmpresa,
        empresaError
    } = useSelector((store) => store.empresa);

    useEffect(() => {
        const connectToQZTray = async () => {
            try {
                // Configurar la promesa del certificado
                qz.security.setCertificatePromise((resolve, reject) => {
                    qzServices.getCertRoute()
                        .then((res) => {
                            console.log("Certificado recibido:", res.data);
                            resolve(res.data); // Resuelves explícitamente con el contenido
                        })
                        .catch((err) => {
                            console.error("Error obteniendo certificado:", err);
                            reject(err); // Rechazas explícitamente en caso de error
                        });
                });

                // Configurar la promesa de la firma
                qz.security.setSignatureAlgorithm("SHA512");
                qz.security.setSignaturePromise((toSign) => (resolve, reject) => {
                qzServices
                    .signData(toSign)
                    .then((res) => {
                    console.log("Firma recibida:", res.data); // Verifica aquí que es base64 plano
                    resolve(res.data);
                    })
                    .catch(reject);
                });
                
                if (!qz.websocket.isActive()) {
                    await qz.websocket.connect();
                    setIsConnected(true);

                    // Obtén la lista de impresoras disponibles
                    const availablePrinters = await qz.printers.find();
                    setPrinters(Array.isArray(availablePrinters) ? availablePrinters : [availablePrinters]);

                    // Verifica si hay impresora guardada en localStorage
                    const storedPrinter = localStorage.getItem('selectedPrinter');

                    if (storedPrinter && availablePrinters.includes(storedPrinter)) {
                        setSelectedPrinter(storedPrinter);
                    } else {
                        setShowModal(true); // Muestra el modal si no hay impresora válida
                    }
                }
            } catch (error) {
                console.error('Error de conexión con QZ Tray:', error);
            }
        };


        connectToQZTray();

        return () => {
            if (qz.websocket.isActive()) {
                qz.websocket.disconnect().then(() => {
                    setIsConnected(false);
                });
            }
        };
    }, []);

    const handlePrinterSelection = (printer) => {
        setSelectedPrinter(printer);
        localStorage.setItem('selectedPrinter', printer);
        setShowModal(false);
    };

    const printReceipt = (datosFactura) => {
        if (!selectedPrinter) {
            console.error('No hay impresora seleccionada.');
            return;
        }

        const config = qz.configs.create(selectedPrinter);
        const fecha = moment(datosFactura.fecha_venta).format("DD-MM-YYYY");
        const hora = new Date(datosFactura.fecha_venta).toLocaleTimeString();
        const clienteFactura = datosFactura.cliente
            ? `Cliente: ${datosFactura.cliente.nombre_completo}
            \nR.T.N Cliente: ${datosFactura.rtn || "N/A"}
            \nDNI Cliente: ${datosFactura.cliente.dni || "N/A"}
            \nTel. Cliente: ${datosFactura.cliente.telefono || "N/A"}\n`
            : "Cliente: Consumidor Final\nR.T.N Cliente: N/A\n";

        const MAX_DESCRIPTION_LENGTH = 15; // Longitud máxima de la descripción en una línea

        const detalleFactura = datosFactura.detalle.map((item) => {
            const numeroSerie = item.unidad?.numero_serie ? `\n(No.: ${item.unidad.numero_serie})` : '';
            const cantidad = item.cantidad.toString().padEnd(4, ' ');
            const precio = `${("L. " + item.precio_venta.toString()).padStart(7, '-')}`;

            // Obtener la descripción del producto
            const descripcion = `${item.producto_asignado.producto.nombre}`;

            // Dividir la descripción si es demasiado larga
            const descripcionDividida = [];
            for (let i = 0; i < descripcion.length; i += MAX_DESCRIPTION_LENGTH) {
                descripcionDividida.push(descripcion.slice(i, i + MAX_DESCRIPTION_LENGTH));
            }

            // Unir la descripción dividida con el formato deseado
            const descripcionFormateada = descripcionDividida.join(`\n${' '.repeat(4)}`); // Indentación para la segunda línea

            return `${cantidad}  ${descripcionFormateada.toString().padEnd(4, ' ')}          ${precio} ${numeroSerie}`;
        }).join('\n');

        const totalEnLetras = numberToWordsWithDecimals(datosFactura.prima)

        const data = [
            '\x1B\x40', // Inicializa la impresora,
            '\x1B\x74\x10', // Configura el código de página 1252 (Windows-1252)
            '\x1B\x61\x01', // Centra el texto
            '=========================================\n',
            `      DURSAN - KREDIYA       \n`,
            '=========================================\n',
            '\x1B\x61\x00', // Alinea a la izquierda
            `R.T.N: ${datosEmpresa[0].rtn}\n`, // Cambiar si es dinámico
            `Dirección: ${datosEmpresa[0].direccion}\n`,
            `Teléfono: (504) ${datosEmpresa[0].telefono}\n`,
            `Correo: ${datosEmpresa[0].correo} \n`,
            '\x1B\x61\x01', // Centra el texto
            '         E:EXENTO G:GRAVADO         \n',
            '\x1B\x61\x00', // Alinea a la izquierda
            '------------------------------------------\n',
            `Factura No.: ${datosFactura.num_factura}\n`,
            `CAI:\n`,
            `${datosFactura.rango_factura.cai}\n`,
            `Fecha límite de emisión: ${datosFactura.rango_factura.fecha_vencimiento}\n`,
            `Rango autorizado:\n`,
            `${datosFactura.rango_inicio}\n`,
            `${datosFactura.rango_final}\n`,
            '------------------------------------------\n',
            clienteFactura,
            `Vendedor: ${datosFactura.empleado.nombre_completo}\n`,
            `Fecha: ${fecha}\n`,
            `Hora: ${hora}\n`,
            '-----------------------------------\n',
            'Cant  Descripción           Valor\n',
            '-----------------------------------\n',
            `${detalleFactura}\n`,
            '-----------------------------------\n',
            '\x1B\x45\x01', // Activa negrita
            ` Subtotal(Prima) L.:    ${(parseFloat(datosFactura.prima) / 1.15).toFixed(2)}\n`,
            `             ISV L.:    ${((parseFloat(datosFactura.prima) / 1.15) * 0.15).toFixed(2)}\n`, // Cambiar si es dinámico
            ` **Total (Prima) L.:    ${datosFactura.prima}\n`,
            '\x1B\x45\x00', // Desactiva negrita
            '-----------------------------------\n',
            `Total en Letras: ${totalEnLetras}\n`,
            '===================================\n',
            ` **Total de la compra:      ${datosFactura.total}\n`,
            ` **Total de la prima:      ${datosFactura.prima}\n`,
            ` **Pendiente de pagar:      ${datosFactura.total - datosFactura.prima}\n`,

            '\x1B\x61\x01', // Centra el texto
            '    ¡Gracias por su compra!       \n',
            '===================================\n',
            '\x1B\x61\x01', // Centra el mensaje de garantía
            'Original Cliente\n',
            'Copia: Obligado Tributario Emisor\n\n\n',
            'Garantía por un año, únicamente\n',
            'en tiendas principales, la garantía\n',
            'solo cubre desperfectos de fábrica,\n',
            'no cubre golpes, humedad ni malas\n',
            'manipulaciones por el cliente.\n',
            'Si daña la caja o pierde la factura,\n',
            'automáticamente pierde su garantía.\n',
            '\x1B\x64\x05', // Alimenta 5 líneas
            '\x1D\x56\x41', // Corte parcial de papel
            '\x1B\x64\x05', // Alimenta más líneas
        ];


        qz.print(config, data)
            .then(() => {
                console.log('Impresión completada');
            })
            .catch((error) => {
                console.error('Error al imprimir:', error);
                toast.error("Error al imprimir");
            });
        return 1
    };

    // Definimos el esquema de validación del formulario

    const formSchema = z.object({
        local: z.number({
            required_error: "Este campo es requerido",
            invalid_type_error: "Debe seleccionar una opción"
        }).positive().int(),
        cliente: z.number({
            required_error: "Este campo es requerido",
            invalid_type_error: "Debe seleccionar una opción"
        }).positive().int(),
        prima: z
            .string({
                required_error: "Este campo es requerido",
                invalid_type_error: "La prima debe ser un número"
            })
            .transform(value => (value === "" ? undefined : Number(value))) // Transformar cadena a número o undefined
            .refine(value => value !== undefined && value < totalTelefono, {
                message: `La prima debe ser menor a ${totalTelefono.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}`,
            }),
        rtn: z
            .string()
            .trim()
            .optional()
            .refine((val) => !val || (val.length >= 14 && val.length <= 16), {
                message: "El RTN debe tener entre 14 y 16 caracteres",
            })
    });

    useEffect(() => {
        if (user) {
            dispatch(getLocal({
                nombre_tipo_local: TIPO_LOCAL.TIENDA
            }))
            dispatch(getInfoEmpresa())
            dispatch(getMetodoPago())
            dispatch(getCliente())
            dispatch(getTipoVenta({ tipo_venta: TIPO_VENTA.KREDIYA }))
        }

    }, [user])

    useEffect(() => {
        if (infoEmpresa) {
            setDatosEmpresa(infoEmpresa)
        }
    }, [infoEmpresa])

    const tieneLocal = user?.local_id || false

    const { control, handleSubmit, watch, reset, resetField, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cliente: '',
            local: tieneLocal ? tieneLocal : '',
            rtn : '',
            prima: 0

        },
    });
    //funciones modal
    const [openDialog, setOpenDialog] = useState(false);

    const selectedLocal = watch('local');

    useEffect(() => {
        if (selectedLocal) {
            dispatch(getNumFactura(selectedLocal))
            dispatch(getProductoAsignado({
                local: selectedLocal,
                tipo_producto: [TIPO_PRODUCTO.CELULAR]
            }))
        }
    }, [selectedLocal])

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    //tabla dialogo
    const handleAgregarProducto = (productos) => {
        let listaProductos = [...dataDetalle, ...productos]; // Agrega todos los productos al estado existente
        setDataDetalle(listaProductos);
    };

    const onSubmit = async (data) => {
        let req = {
            local: data.local,
            total: totalTelefono,
            cliente: data.cliente,
            rtn: data.rtn ? data.rtn : null,
            empleado: user.empleado_id,
            tipo_venta: tipoVenta[0].id_tipo_venta,
            prima: data.prima,
            creado_por: username,
            productos: dataDetalle,
            metodo_pago: datosPago
        }
        if (numeroKits > 0) {
            req.metodo_recarga = datosPagoRecarga
        }
        const datosFactura = await dispatch(saveVenta(req))
        console.log("datosFactura", datosFactura)
        await printReceipt(datosFactura, infoEmpresa)
        resetField('cliente')
        resetField('rtn')
        resetField('prima')
        dispatch(getNumFactura(selectedLocal))
        dispatch(getProductoAsignado({
            local: selectedLocal
        }))
        setDataDetalle([])
        setSelectedMetodos([])
        setMontos({})
        setNumeroKits(0)
        setMontoEsperadoRecarga(0)
        setMontosRecarga({})
        setSelectedRecargaMetodos([])


    }
    //radio button
    const [value, setValue] = useState('option1');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    //tabla
    const columns = useMemo(() => [
        {
            header: 'Producto',
            accessorKey: 'producto_nombre',
            muiTableHeadCellProps: {
                sx: {
                    width: '3vw',
                    height: '7vh',
                },
            },
            muiTableBodyCellProps: {
                sx: {
                    width: '3vw',
                    height: '7vh',
                },
            },
        },
        {
            header: 'Unidad',
            accessorKey: 'numero_serie',
            muiTableHeadCellProps: {
                sx: {
                    width: '3vw',
                    height: '7vh',
                },
            },
            muiTableBodyCellProps: {
                sx: {
                    width: '3vw',
                    height: '7vh',
                },
            },
        },
        {
            header: 'Cantidad',
            accessorKey: 'cantidad',
            muiTableHeadCellProps: {
                sx: {
                    width: '3vw',
                    height: '7vh',
                },
            },
            muiTableBodyCellProps: {
                sx: {
                    width: '3vw',
                    height: '7vh',
                },
            },
        },
        {
            header: 'Precio de Venta',
            accessorKey: 'precio_venta',
            muiTableHeadCellProps: {
                sx: {
                    width: '3vw',
                    height: '7vh',
                },
            },
            muiTableBodyCellProps: {
                sx: {
                    width: '3vw',
                    height: '7vh',
                },
            },
            // Formatear el precio a formato monetario
            Cell: ({ cell }) => {
                const price = cell.getValue();
                return price ? price.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }) : '-';
            },
        },
        {
            header: 'Subtotal',
            accessorKey: 'subtotal',
            muiTableHeadCellProps: {
                sx: {
                    width: '3vw',
                    height: '7vh',
                },
            },
            muiTableBodyCellProps: {
                sx: {
                    width: '3vw',
                    height: '7vh',
                },
            },
            // Calcular el subtotal multiplicando el precio de venta por la cantidad
            Cell: ({ row }) => {
                const cantidad = row.getValue('cantidad');
                const precio = row.getValue('precio_venta');
                const subtotal = cantidad * precio;
                return subtotal ? subtotal.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }) : '-';
            },
        },
        {
            header: 'Acciones',
            id: 'acciones',
            Cell: ({ row }) => (
                <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                    <IconButton color="secondary" onClick={() => handleDelete(row.original.producto_asignado, row.original.unidad, row.original.cantidad)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        }
    ], [dataDetalle]);

    const table = useMaterialReactTable({
        columns,
        data: dataDetalle,
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

    // Función para eliminar un producto por su ID o número de serie
    const handleDelete = (producto_asignado_id, unidad_id, cantidad) => {
        // Filtra el arreglo de productos según los criterios proporcionados
        const updatedProductos = dataDetalle.filter(producto => {
            if (unidad_id !== null) {
                // Si unidad_id tiene un valor, filtra por producto_asignado_id y unidad_id
                return !(producto.producto_asignado === producto_asignado_id && producto.unidad === unidad_id);
            }
            // Si unidad_id no tiene un valor, solo filtra por producto_asignado_id
            return producto.producto_asignado !== producto_asignado_id;
        });

        // Actualiza el estado con el arreglo filtrado
        setDataDetalle(updatedProductos);

        if (unidad_id) {
            let _listaUnidades = [...listaUnidades]
            _listaUnidades = _listaUnidades.filter(unidad => unidad !== unidad_id)
            setListaUnidades(_listaUnidades)
        }
        let _listaProductos = [...listaProductos]
        const updatedListaProductos = _listaProductos.map(item => {
            if (item.id_producto_asignado === producto_asignado_id) {
                return {
                    ...item,
                    stock: unidad_id ? item.stock + 1 : item.stock + cantidad // Reducir stock si es mayor a 0
                };
            }
            return item; // Devolver los demás elementos sin cambios
        });
        setListaProductos(updatedListaProductos);

    };

    // Calcular el total de todos los productos


    const primaMonto = watch("prima")

    // Calcular el subtotal (Total / 1.15)
    const subtotal = primaMonto ? primaMonto / 1.15 : 0;

    // Calcular el ISV (15% del subtotal)
    const isv = subtotal * 0.15;

    const [selectedMetodos, setSelectedMetodos] = useState([]);
    const [selectedRecargaMetodos, setSelectedRecargaMetodos] = useState([]);

    const [montos, setMontos] = useState({});
    const [montosRecarga, setMontosRecarga] = useState({})

    useEffect(() => {
        const numero = dataDetalle.reduce((acc, obj) => {
            if (obj.tipo_producto == TIPO_PRODUCTO.CELULAR) {
                return acc + 1;
            }
            return acc;
        }, 0);
        let monto = numero * COSTO_RECARGA
        setNumeroKits(numero);
        setMontoEsperadoRecarga(monto);
    }, [dataDetalle]);

    // Manejar selección/deselección de métodos de pago
    const handleCheckboxChange = (id) => {
        setSelectedMetodos((prev) =>
            prev.includes(id)
                ? prev.filter((value) => value !== id) // Eliminar si ya está seleccionado
                : [...prev, id] // Agregar si no está seleccionado
        );

        // Si se deselecciona, eliminar el monto asociado
        if (selectedMetodos.includes(id)) {
            setMontos((prev) => {
                const newMontos = { ...prev };
                delete newMontos[id];
                return newMontos;
            });
        }
    };

    // Manejar selección/deselección de métodos de pago de recarga
    const handleCheckboxRecargaChange = (id) => {
        setSelectedRecargaMetodos((prev) =>
            prev.includes(id)
                ? prev.filter((value) => value !== id) // Eliminar si ya está seleccionado
                : [...prev, id] // Agregar si no está seleccionado
        );

        // Si se deselecciona, eliminar el monto asociado
        if (selectedRecargaMetodos.includes(id)) {
            setMontosRecarga((prev) => {
                const newMontos = { ...prev };
                delete newMontos[id];
                return newMontos;
            });
        }
    };

    // Manejar cambio en el monto asociado al método de pago
    const handleMontoChange = (id, value) => {
        setMontos((prev) => ({
            ...prev,
            [id]: value === '' ? '' : parseFloat(value),
        }));
    };

    // Manejar cambio en el monto asociado al método de pago de la recarga
    const handleMontoRecargaChange = (id, value) => {
        setMontosRecarga((prev) => ({
            ...prev,
            [id]: parseFloat(value) || '', // Convertir a número o dejar vacío
        }));
    };

    // Crear el arreglo de métodos de pago con montos
    const datosPago = selectedMetodos
        .filter((id) => montos[id]) // Solo incluir los métodos con monto ingresado
        .map((id) => ({
            metodo_pago: id,
            monto: montos[id],
        }));

    // Crear el arreglo de métodos de pago con montos
    const datosPagoRecarga = selectedRecargaMetodos
        .filter((id) => montosRecarga[id]) // Solo incluir los métodos con monto ingresado
        .map((id) => ({
            metodo_pago: id,
            monto: montosRecarga[id],
        }));

    const sumaMontosMetodoPago = datosPago.reduce((acc, obj) => {
        return acc + obj.monto
    }, 0)

    const sumaMontosRecargaMetodoPago = datosPagoRecarga.reduce((acc, obj) => {
        return acc + obj.monto
    }, 0)

    const sumaMontosMetodoPagoTotal = sumaMontosMetodoPago + sumaMontosRecargaMetodoPago

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <DashboardLayout>
                <CssBaseline />
                <BoxNav>
                    <DashboardNavbar />
                </BoxNav>
                {
                    console.log(infoEmpresa, "aqui")
                }
                {loadingLocales || loadingMetodosPago || loadingClientes || loadingNumFactura || loadingTipoVenta || loadingInfoEmpresa ? (
                    <div className="py-3 flex justify-center">
                        <CircularProgress />
                    </div>
                ) : (
                    <div >
                        <Grid container className="p-4 text-black">
                            <Grid item xs={12}>
                                {isConnected ? (
                                    <div>

                                        <p>Conectado a QZ Tray.</p>
                                        {selectedPrinter ? (
                                            <div>
                                                <p>Impresora seleccionada: {selectedPrinter}</p>

                                            </div>
                                        ) : (
                                            <p>Selecciona una impresora para continuar.</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-100">
                                        <p>Esperando conexión con QZ Tray...</p>
                                    </div>

                                )}
                            </Grid>
                        </Grid>
                        <Fondo>
                            <CarsData>
                                <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }} >
                                    Local
                                </Typography>
                                <Controller
                                    name="local"
                                    control={control}
                                    render={({ field }) => (
                                        <Controller
                                            name="local"
                                            control={control}
                                            render={({ field }) => (
                                                <>
                                                    <Select
                                                        {...field} // Pasa las propiedades de field al componente Select
                                                        options={localesOptions}
                                                        isLoading={loadingLocales}
                                                        isDisabled={tieneLocal ? true : false}
                                                        placeholder="Seleccione un local"

                                                        value={field.value ? localesOptions.find(option => option.value === field.value) : ''} // Encuentra el valor seleccionado
                                                        onChange={(selectedOption) => field.onChange(selectedOption.value)} // Actualiza el valor seleccionado
                                                        aria-errormessage={errors.local?.message}
                                                        aria-invalid={!!errors.local} // Añade aria-invalid si hay error
                                                        className={errors.local ? 'is-invalid' : ''} // Añade una clase de error si hay error
                                                        // Renderiza el menú de opciones en el body
                                                        menuPortalTarget={document.body}

                                                        // Asegura que el menú se posicione correctamente sobre otros elementos
                                                        styles={{
                                                            container: (provided) => ({
                                                                ...provided,
                                                                margin: "1%",
                                                                width: '98%'
                                                            }),
                                                            menuPortal: (base) => ({
                                                                ...base,
                                                                zIndex: 9999,
                                                            }),
                                                        }} />
                                                    {errors.local && (
                                                        <span className="error-message" style={{ color: 'red', fontSize: '0.875rem' }}>
                                                            {errors.local.message}
                                                        </span>
                                                    )}
                                                </>

                                            )}
                                        />
                                    )}
                                />
                            </CarsData>
                            <CarsData>
                                <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }}>
                                    Número De Factura
                                </Typography>
                                <TextField
                                    disabled
                                    value={numFactura?.num_factura || "Sin No. disponible"}
                                    variant='outlined'
                                    placeholder="Correlativo"
                                    inputProps={{
                                        style: {
                                            color: '#000000',
                                            fontSize: "18px",
                                            fontWeight: 'bold',
                                            padding: '0',
                                        }
                                    }}
                                    sx={{
                                        width: '95%',
                                        borderRadius: '5px',
                                        margin: '0% 2% 2% 2%',
                                        height: 'auto',
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
                                <Controller
                                    name="cliente"
                                    control={control}
                                    render={({ field }) => (
                                        <Controller
                                            name="cliente"
                                            control={control}
                                            render={({ field }) => (
                                                <>
                                                    <Select
                                                        {...field} // Pasa las propiedades de field al componente Select
                                                        options={clientesOptions}
                                                        isLoading={loadingClientes}
                                                        placeholder="Seleccione un cliente"
                                                        value={field.value ? clientesOptions.find(option => option.value === field.value) : ''} // Encuentra el valor seleccionado
                                                        onChange={(selectedOption) => field.onChange(selectedOption.value)} // Actualiza el valor seleccionado
                                                        aria-errormessage={errors.cliente?.message}
                                                        aria-invalid={!!errors.cliente} // Añade aria-invalid si hay error
                                                        className={errors.cliente ? 'is-invalid' : ''} // Añade una clase de error si hay error
                                                        // Renderiza el menú de opciones en el body
                                                        menuPortalTarget={document.body}

                                                        // Asegura que el menú se posicione correctamente sobre otros elementos
                                                        styles={{
                                                            container: (provided) => ({
                                                                ...provided,
                                                                margin: "1%",
                                                                width: '98%'
                                                            }),
                                                            menuPortal: (base) => ({
                                                                ...base,
                                                                zIndex: 9999,
                                                            }),
                                                        }} />
                                                    {errors.cliente && (
                                                        <span className="error-message" style={{ color: 'red', fontSize: '0.875rem' }}>
                                                            {errors.cliente.message}
                                                        </span>
                                                    )}
                                                </>

                                            )}
                                        />
                                    )}
                                />
                            </CarsData>
                            <CarsData>
                                <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }}>
                                    ¿ Factura con RTN ?
                                </Typography>
                                <Controller
                                    name="rtn"
                                    control={control}
                                    render={({field}) => (
                                        <TextField
                                            {...field}
                                            variant='outlined'
                                            placeholder="RTN Cliente"
                                            inputProps={{
                                                style: {
                                                    color: '#000000',
                                                    fontSize: "18px",
                                                    fontWeight: 'bold',
                                                    padding: '0',
                                                }
                                            }}
                                            sx={{
                                                width: '95%',
                                                borderRadius: '5px',
                                                margin: '0% 2% 2% 2%',
                                                height: 'auto',
                                                '& .MuiOutlinedInput-root': {
                                                    height: '100%',
                                                    '& input': {
                                                        height: '100%',
                                                        padding: '0 14px',
                                                    }
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </CarsData>
                        </Fondo>
                        <BtnAdd onClick={handleOpenDialog}> Agregar</BtnAdd>
                        <BoxTabla>
                            <Box sx={{ maxHeight: '500px', overflowY: 'auto', width: '100%' }}>
                                <MaterialReactTable table={table} />
                            </Box>
                        </BoxTabla>
                        <BoxDellFactura>
                            <BoxDetalle>
                                {(Number(sumaMontosMetodoPagoTotal) < Number(primaMonto)) && (
                                    <Alert className="my-2" severity="error"> Faltan {Number(primaMonto - sumaMontosMetodoPagoTotal).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })} para llegar al monto total. </Alert>
                                )}
                                {(Number(sumaMontosMetodoPagoTotal) > Number(primaMonto)) && (
                                    <Alert severity="error"> Sobran {Number(sumaMontosMetodoPagoTotal - primaMonto).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })} del monto total. </Alert>
                                )}
                                <Box sx={{ padding: '2%' }}>
                                    <h5 className="font-bold p-2 my-2 bg-yellow-50">Pago Artículos</h5>
                                    {(Number(sumaMontosMetodoPago) < Number(primaMonto - montoEsperadoRecarga)) && (
                                        <Alert className="my-2" severity="error"> Faltan {Number((primaMonto - montoEsperadoRecarga) - sumaMontosMetodoPagoTotal).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })} para llegar al monto de los artículos. </Alert>
                                    )}
                                    {(Number(sumaMontosMetodoPago) > Number(primaMonto - montoEsperadoRecarga)) && (
                                        <Alert severity="error"> Sobran {Number(sumaMontosMetodoPago - (primaMonto - montoEsperadoRecarga)).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })} del monto de los artículos. </Alert>
                                    )}
                                    {metodosPago && metodosPago.length > 0 && metodosPago.map((metodo) => (
                                        <Box key={metodo.id_metodo_pago} sx={{ margin: '1rem' }}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selectedMetodos.includes(metodo.id_metodo_pago)}
                                                        onChange={() => handleCheckboxChange(metodo.id_metodo_pago)}
                                                    />
                                                }
                                                label={metodo.nombre}
                                                sx={{
                                                    '& .MuiTypography-root': {
                                                        color: '#a0a0a0',
                                                        fontSize: 'small',
                                                        fontWeight: 'bold',
                                                    },
                                                }}
                                            />
                                            {selectedMetodos.includes(metodo.id_metodo_pago) && (
                                                <TextField
                                                    variant="outlined"
                                                    placeholder="Cantidad"
                                                    type="number"
                                                    value={montos[metodo.id_metodo_pago] ?? ''}
                                                    onChange={(e) =>
                                                        handleMontoChange(metodo.id_metodo_pago, e.target.value)
                                                    }
                                                    inputProps={{
                                                        min: 0,
                                                        style: {
                                                            color: '#000000',
                                                            fontSize: 'small',
                                                            fontWeight: 'bold',
                                                            padding: '0',
                                                        },
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
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                                <hr />
                                {numeroKits > 0 && (
                                    <Box sx={{ padding: '2%' }}>
                                        <h5 className="font-bold p-2 my-2 bg-yellow-50">Pago Recarga</h5>
                                        {(Number(sumaMontosRecargaMetodoPago) < Number(montoEsperadoRecarga)) && (
                                            <Alert className="my-2" severity="error"> Faltan {Number(montoEsperadoRecarga - sumaMontosRecargaMetodoPago).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })} para llegar al monto de la recarga. </Alert>
                                        )}
                                        {(Number(sumaMontosRecargaMetodoPago) > Number(montoEsperadoRecarga)) && (
                                            <Alert className="my-2" severity="error"> Sobran {Number(sumaMontosRecargaMetodoPago - montoEsperadoRecarga).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })} del monto de la recarga. </Alert>
                                        )}
                                        {console.log(sumaMontosRecargaMetodoPago, montoEsperadoRecarga, "recarga", datosPagoRecarga, selectedRecargaMetodos, montosRecarga)}
                                        {metodosPago && metodosPago.length > 0 && metodosPago.map((metodo) => (
                                            <Box key={metodo.id_metodo_pago} sx={{ margin: '1rem' }}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={selectedRecargaMetodos.includes(metodo.id_metodo_pago)}
                                                            onChange={() => handleCheckboxRecargaChange(metodo.id_metodo_pago)}
                                                        />
                                                    }
                                                    label={metodo.nombre}
                                                    sx={{
                                                        '& .MuiTypography-root': {
                                                            color: '#a0a0a0',
                                                            fontSize: 'small',
                                                            fontWeight: 'bold',
                                                        },
                                                    }}
                                                />
                                                {selectedRecargaMetodos.includes(metodo.id_metodo_pago) && (
                                                    <TextField
                                                        variant="outlined"
                                                        placeholder="Cantidad"
                                                        type="number"
                                                        value={montosRecarga[metodo.id_metodo_pago] || ''}
                                                        onChange={(e) =>
                                                            handleMontoRecargaChange(metodo.id_metodo_pago, e.target.value)
                                                        }
                                                        inputProps={{
                                                            min: 0, // Establece el valor mínimo en 0
                                                            style: {
                                                                color: '#000000',
                                                                fontSize: 'small',
                                                                fontWeight: 'bold',
                                                                padding: '0',
                                                            },
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
                                                )}
                                            </Box>
                                        ))}

                                    </Box>
                                )}
                            </BoxDetalle>
                            <BoxDetalletot>
                                <BoxTotales>
                                    <CarsDetalleT>
                                        <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '1%' }}>
                                            Total del Teléfono
                                        </Typography>
                                        <TextField
                                            variant='outlined'
                                            value={totalTelefono.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
                                            placeholder=""
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
                                        <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '1%' }}>
                                            Subtotal
                                        </Typography>
                                        <TextField
                                            variant='outlined'
                                            placeholder=""
                                            value={subtotal.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
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
                                        <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '1%' }}>
                                            ISV
                                        </Typography>
                                        <TextField
                                            variant='outlined'
                                            value={isv.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
                                            placeholder=""
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
                                        <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '1%' }}>
                                            Prima
                                        </Typography>
                                        <Controller
                                            name="prima"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    type="number"
                                                    error={!!errors?.prima}
                                                    helperText={errors?.prima?.message}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    variant="outlined"
                                                    fullWidth
                                                    inputProps={{
                                                        min: 0,
                                                    }}
                                                    sx={{
                                                        width: '100%',
                                                        margin: '-1% 0% 2% 0%',
                                                        borderRadius: '5px',
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': {
                                                                borderColor: '#6a6a6a',
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: '#000',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#000',
                                                            },
                                                        },
                                                        '& .MuiInputBase-input': {
                                                            color: '#6a6a6a',
                                                            fontWeight: 'bold',
                                                            fontSize: 'small',
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    </CarsDetalleT>
                                </BoxTotales>
                            </BoxDetalletot>
                            <BtnGenerar
                                type="submit"
                                disabled={saveLoading
                                    || loadingVenta
                                    || dataDetalle.length <= 0
                                    || datosPago.length <= 0
                                    || empresaError
                                    || localError
                                    || metodoPagoError
                                    || numFacturaError
                                    || tipoVentaError
                                    || Number(sumaMontosMetodoPagoTotal) !== Number(primaMonto)
                                    || numeroKits > 0 && (Number(montoEsperadoRecarga) !== Number(sumaMontosRecargaMetodoPago))
                                }
                            >
                                {saveLoading && (
                                    <CircularProgress />
                                )}
                                Generar Factura
                            </BtnGenerar>
                            <ModalAddProducto
                                open={openDialog}
                                onClose={handleCloseDialog}
                                handleAgregar={handleAgregarProducto}
                                listaProductos={listaProductos}
                                setListaProductos={setListaProductos}
                                listaUnidades={listaUnidades}
                                setListaUnidades={setListaUnidades}
                            />
                        </BoxDellFactura>
                        <PrinterSelectionModal
                            open={showModal}
                            printers={printers}
                            onSelectPrinter={handlePrinterSelection}
                            onClose={() => setShowModal(false)}
                        />
                    </div>

                )
                }




            </DashboardLayout>
        </form>

    )
}

export default VentasKrediya;