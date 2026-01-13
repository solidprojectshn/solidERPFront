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
import { MRT_Localization_ES } from 'material-react-table/locales/es';

import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";

//estilos nav
const BoxNav = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    // backgroundColor: '#526878',
    width: '100%',
    height: '20vh',
    padding: '1.5%'
}));

const Fondo = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    // backgroundColor: '#526878',
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
    justifyContent: 'center',
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

const BoxTotales = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '98%',
    height: 'auto', // mirar
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
    getTipoVenta, savePagoCuota
} from "../../../../redux/facturacion/ventas/actions"

import {
    getCliente
} from "../../../../redux/mantenimientos/clientes/actions"


import { TIPO_LOCAL, TIPO_PRODUCTO, TIPO_VENTA } from '../../../../services/constantes';
import moment from "moment";
import { numberToWords } from "Utilities/funs";

const CuotasKrediya = () => {
    const dispatch = useDispatch();
    const [dataDetalle, setDataDetalle] = useState([])
    const [listaProductos, setListaProductos] = useState([])
    const [listaUnidades, setListaUnidades] = useState([])
    const username = JSON.parse(localStorage.getItem('user-info'))?.username


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
        saveLoading,
        formError,
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

        num_credito: z.string({ required_error: "Este campo es requerido" }).trim().min(2, { message: "El campo debe contener un mínimo de 2 caracteres" }).max(50, { message: "El campo debe contener un máximo de 50 caracteres" }),



    });

    useEffect(() => {
        if (user) {
            dispatch(getLocal({
                nombre_tipo_local: TIPO_LOCAL.TIENDA
            }))
            dispatch(getMetodoPago())
            dispatch(getCliente())
            dispatch(getTipoVenta({ tipo_venta: TIPO_VENTA.CUOTA }))
        }

    }, [user])

    const tieneLocal = user?.local_id || false

    const { control, handleSubmit, watch, reset, resetField, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cliente: '',
            local: tieneLocal ? tieneLocal : '',
            num_credito: '',


        },
    });
   

    const onSubmit = async (data) => {
        let req = {
            local: data.local,
            total: sumaMontosMetodoPago,
            num_credito: data.num_credito,
            cliente: data.cliente,
            empleado: user.empleado_id,
            tipo_venta: tipoVenta[0].id_tipo_venta,
            creado_por: username,
            metodo_pago: datosPago
        }
        await dispatch(savePagoCuota(req))
       /*  resetField('cliente')
        setDataDetalle([])
        setSelectedMetodos([])
        setMontos({}) */


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


    const [selectedMetodos, setSelectedMetodos] = useState([]);
    const [montos, setMontos] = useState({});

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

    // Manejar cambio en el monto asociado al método de pago
    const handleMontoChange = (id, value) => {
        setMontos((prev) => ({
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

    const sumaMontosMetodoPago = datosPago.reduce((acc, obj) => {
        return acc + obj.monto
    }, 0)


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <DashboardLayout>
                <CssBaseline />
                <BoxNav>
                    <DashboardNavbar />
                </BoxNav>

                {loadingLocales || loadingMetodosPago || loadingClientes || loadingTipoVenta ? (
                    <div className="py-3 flex justify-center">
                        <CircularProgress />
                    </div>
                ) : (
                    <div >
                        {/* <Grid container className="p-4 text-white" sx={{ backgroundColor: "#526878" }}></Grid> */}
                        <Grid container className="p-4 text-black">
                            {formError && (
                                <Alert severity="error">{formError}</Alert>
                            )}                           
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
                        </Fondo>
                        <BoxDellFactura>
                            <BoxDetalle>
                                <Box sx={{ padding: '2%' }}>                                  
                                 
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
                                                    value={montos[metodo.id_metodo_pago] || ''}
                                                    onChange={(e) =>
                                                        handleMontoChange(metodo.id_metodo_pago, e.target.value)
                                                    }
                                                    inputProps={{
                                                        style: {
                                                            color: '#000000',
                                                            fontSize: 'small',
                                                            fontWeight: 'bold',
                                                            padding: '0',
                                                        },
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
                                        </Box>
                                    ))}

                                </Box>
                            </BoxDetalle>
                            <BoxDetalletot>
                                <BoxTotales>
                                    <CarsDetalleT>
                                        <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '1%' }}>
                                            Total
                                        </Typography>
                                        <TextField
                                            variant='outlined'
                                            placeholder=""
                                            disabled={true}
                                            value={sumaMontosMetodoPago.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
                                            inputProps={{
                                                style: {
                                                    color: '#000000',
                                                    fontSize: 'small',
                                                    fontWeight: 'bold',
                                                    padding: '0',
                                                }
                                            }}
                                            sx={{
                                                width: '100%',
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
                                    </CarsDetalleT>
                                    <CarsDetalleT>
                                        <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '1%' }}>
                                            Numero de Crédito
                                        </Typography>
                                        <Controller
                                            name="num_credito"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    type="text"
                                                    error={!!errors?.num_credito}
                                                    helperText={errors?.num_credito?.message}
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
                                    || datosPago.length <= 0
                                    || localError
                                    || metodoPagoError
                                    || tipoVentaError
                                }
                            >
                                {saveLoading && (
                                    <CircularProgress />
                                )}
                                Pagar Cuota
                            </BtnGenerar>

                        </BoxDellFactura>

                    </div>

                )
                }
            </DashboardLayout>
        </form>

    )
}

export default CuotasKrediya;