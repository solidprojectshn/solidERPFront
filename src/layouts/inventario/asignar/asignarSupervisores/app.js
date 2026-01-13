import React, { useState, useMemo, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"// ESTO
import { z } from 'zod';// ESTO
import { useForm, Controller, useFieldArray, set } from 'react-hook-form';// ESTO
import { useSelector, useDispatch } from "react-redux";// ESTO
import { Box, CssBaseline, Container, Typography, TextField, Button, Checkbox, useTheme, CircularProgress, Alert } from '@mui/material';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar'; // Importa el DashboardNavbar
import styled from '@emotion/styled';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayoutFb';
import Select from 'react-select'
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';


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
    padding:'2% 0% 2% 0%',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
    },
}));

const CardData = styled(Box)(({ theme }) => ({
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

const BoxContenido = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    backgroundColor: '#ffffff',
    padding: '1%',
    [theme.breakpoints.down('sm')]: { // Ajusta para pantallas pequeñas
        padding: '2%', // Aumenta el padding
        margin: '1%',
    },
}));

const BoxProducto = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '95%',
    height: 'auto',
    margin: 'auto 1% auto auto',
    background:'#ffffff',
    [theme.breakpoints.down('md')]: {
        width: '100%',
    },
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        padding: '2%',
        margin: '1%',
    },
}));

const BoxTituloP = styled(Box)(({ theme }) => ({
    width: '98%',
    height: '30%',
    margin: '1%',
    background:'#fffff'
}));

const BoxDataP = styled(Box)(({ theme }) => ({
    width: '98%',
    height: '70%',
    margin: '1%',
    background:'#ffffff',
    [theme.breakpoints.down('md')]: {
        width: '99%',
        margin: '1% 3% 0% 0%',
    },
}));

const BoxTabla = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', //vertical
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: '100%',
    height: 'auto',
    margin:'0.5% 0% 0% 0%',
    padding:'1%',
    boxShadow: theme.shadows[3],
    borderRadius: '4px',
}));

const BtnGuardar = styled(Button)(({ theme }) => ({
    width: '100%',
    margin: '2% 0% 0% 0%',
    height: '8vh',
    backgroundColor: '#000000',
    color: '#ffffff',
    borderRadius: '5px',
    '&:hover': {
        backgroundColor: '#333333',
        color: '#ffffff',
    },
    [theme.breakpoints.down('md')]: {
        width: '99%'
    },
}));

import {
    editAddStock,
    getProductoAsignado,
    getUnidades
} from "../../../../redux/inventario/agregarStock/actions"

//se importa funcion de la llave foranea 


import {
    getLocal
} from "../../../../redux/mantenimientos/local/actions"

import {
    getEmpleado
} from "../../../../redux/mantenimientos/Empleado/actions"
import { BODEGA_PRINCIPAL, SIM, ROLES, TIPO_PRODUCTO, TIPO_LOCAL } from '../../../../services/constantes';


function App() {

    const theme = useTheme();
    const [productoUnico, setProductoUnico] = useState(false); // Control para unidades únicas
    const [selectedProductoAsignado, setSelectedProductoAsignado] = useState(null); // Control para guardar el producto asignado
    const [errorSeries, setErrorSeries] = useState(false);
    const [errorCantidad, setErrorCantidad] = useState(false)
    const [bodegaPrincipal, setBodegaPrincipal] = useState(null)

    const {
        username
    } = useSelector((store) => store.auth);
    
    const user = username

    //tabla
    const [selectedRows, setSelectedRows] = useState([]);

    // Definimos el esquema de validación del formulario

    const formSchema = z
        .object({
            id_producto: z.number({ required_error: "Este campo es requerido", invalid_type_error: "Debe seleccionar una opción" }).positive().int(),
            id_destino: z.number({ required_error: "Este campo es requerido", invalid_type_error: "Debe seleccionar una opción" }).positive().int(),
        })      


    const dispatch = useDispatch();
    //definicion de las variables del reducer

    const {
        loading: loadingLocales,
        locales,
        localError
    } = useSelector((store) => store.local);

    const {
        loading: loadingEmpleados,
        empleados,
        empleadoError
    } = useSelector((store) => store.empleado);

    const empleadosOptions = empleados ? empleados.map((item) => ({ value: item.id_empleado, label: item.nombre_completo })) : []
    
    useEffect(() => {
        if (locales && !loadingLocales) {
            let bodegaPrincipalId = locales.find((item) => item.correlativo_venta === BODEGA_PRINCIPAL)
            setBodegaPrincipal(bodegaPrincipalId)
        }

    }, [locales])
    
    const {
        addStocks,
        loading: loadingStock,
        saveLoading: loadingSaveStock,
        formError,
        loadingUnidades,
        unidades
    } = useSelector((store) => store.addStock);

    useEffect(() => {
        dispatch(getEmpleado({
            rol: ROLES.SUPERVISOR
        }))
        dispatch(getProductoAsignado({
            tipo_local: TIPO_LOCAL.BODEGA_PRINCIPAL,
            tipo_producto: [TIPO_PRODUCTO.SIM_DISTRIBUCION, TIPO_PRODUCTO.SIM_PORTABILIDAD]
        }))
        dispatch(getLocal())
    }, [])

    const { control, handleSubmit, watch, reset, setValue, resetField, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id_producto: '',
            id_destino: ''
        },
    });

    const selectedProductoId = watch('id_producto');   

    const productosOptions = addStocks ? addStocks.map((item) => ({ value: item.id_producto_asignado, label: `${item.producto.nombre} - ${item.stock} disponibles` })) : []

    useEffect(() => {
        if (selectedProductoId) {
            console.log("si pasa")
            const selectedProducto = addStocks.find(
                (prod) => prod.id_producto_asignado === parseInt(selectedProductoId)
            );
            console.log(selectedProducto)
            setSelectedProductoAsignado(selectedProducto)
            if (selectedProducto && selectedProducto.producto.tipo_producto.unidades_unicas) {
                console.log("pasa 2")
                setProductoUnico(true);
                dispatch(getUnidades({
                    producto_asignado: selectedProducto.id_producto_asignado
                }))
                
            } else {
                setProductoUnico(false);
            }
            setSelectedRows([])
        } else {
            setProductoUnico(false);
        }
    }, [selectedProductoId, addStocks, resetField]);


    const handleSelect = (id_unidad) => {
        setSelectedRows((prev) =>
            prev.includes(id_unidad)
                ? prev.filter((rowId) => rowId !== id_unidad) // Si ya está, lo elimina
                : [...prev, id_unidad] // Si no está, lo agrega
        );
    };

    function validarCantidad(input) {
        console.log(input)
        if (input === "") {
            return false;
        }
        const numero = parseInt(input, 10);
        if(!isNaN(numero) && Number.isInteger(numero)){
            return numero <= selectedProductoAsignado.stock
        }
        return false
    }


    const onSubmit = (data) => {
        setErrorCantidad(false)
        console.log("data 2", data)
  
        if (productoUnico && selectedRows.length <= 0) {
            setErrorSeries(true)
            return
        }
        
        let req = {
            id_producto: selectedProductoAsignado.producto.id_producto,
            id_destino: data.id_destino,
            id_origen: bodegaPrincipal.id_local,
            creado_por: user
        }
        req.stock = productoUnico ? selectedRows.length : data.stock

        console.log("la data", req, selectedRows)
        dispatch(editAddStock(req, selectedRows, "empleado"));  
        setProductoUnico(false)
        setErrorSeries(false)
        setErrorCantidad(false)
        setSelectedProductoAsignado(null)
        setSelectedRows([])
        reset()

    };

    const columns = useMemo(() => [
        {
            header: 'Número de serie',
            accessorKey: 'numero_serie',
        },
        {
            header: 'Seleccionar',
            id: 'seleccion',
            Cell: ({ row }) => (
                <Checkbox
                    checked={selectedRows.includes(row.original.id_unidad)}
                    onChange={() => handleSelect(row.original.id_unidad)}
                />
            ),
        },
    ]);

    const table = useMaterialReactTable({
        columns,
        data: unidades,
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
            isLoading: loadingUnidades,
            showProgressBars: loadingUnidades,
        },

    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <DashboardLayout>
                <CssBaseline />
                <BoxNav>
                    <DashboardNavbar />
                </BoxNav>
                <Fondo>
                    {console.log(selectedProductoId, "asdasd")}
                   
                    <CardData>
                        <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }} >
                            Supervisor
                        </Typography>
                        <Controller
                            name="id_destino"
                            control={control}
                            render={({ field }) => (
                                <Controller
                                    name="id_destino"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Select
                                                {...field} // Pasa las propiedades de field al componente Select
                                                options={empleadosOptions}
                                                isLoading={loadingLocales}
                                                placeholder="Seleccione un supervisor"
                                                value={field.value ? empleadosOptions.find(option => option.value === field.value) : ''} // Encuentra el valor seleccionado
                                                onChange={(selectedOption) => field.onChange(selectedOption.value)} // Actualiza el valor seleccionado
                                                aria-errormessage={errors.id_destino?.message}
                                                aria-invalid={!!errors.id_destino} // Añade aria-invalid si hay error
                                                className={errors.id_destino ? 'is-invalid' : ''} // Añade una clase de error si hay error
                                                // Renderiza el menú de opciones en el body
                                                menuPortalTarget={document.body}

                                                // Asegura que el menú se posicione correctamente sobre otros elementos
                                                styles={{
                                                    container: (provided) => ({ 
                                                        ...provided,
                                                        margin: "2%",
                                                        width:'96%' 
                                                    }),
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                    }),
                                                }}
                                            />
                                            {errors.id_destino && (
                                                <span className="error-message" style={{ color: 'red', fontSize: '0.875rem' }}>
                                                    {errors.id_destino.message}
                                                </span>
                                            )}
                                        </>

                                    )}
                                />
                            )}
                        />
                    </CardData>
                    <CardData>
                        <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }} >
                            Producto
                        </Typography>
                        <Controller
                            name="id_producto"
                            control={control}
                            render={({ field }) => (
                                <Controller
                                    name="id_producto"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Select
                                                {...field} // Pasa las propiedades de field al componente Select
                                                options={productosOptions}
                                                isLoading={loadingStock}
                                                isDisabled={loadingStock}
                                                placeholder="Seleccione el producto a trasladar o asignar"
                                                value={field.value ? productosOptions.find(option => option.value === field.value) : ''} // Encuentra el valor seleccionado
                                                onChange={(selectedOption) => field.onChange(selectedOption.value)} // Actualiza el valor seleccionado
                                                aria-errormessage={errors.id_producto?.message}
                                                aria-invalid={!!errors.id_producto} // Añade aria-invalid si hay error
                                                className={errors.id_producto ? 'is-invalid' : ''} // Añade una clase de error si hay error
                                                // Renderiza el menú de opciones en el body
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    container: (provided) => ({ 
                                                        ...provided,
                                                        margin: "2%",
                                                        width:'96%' 
                                                    }),
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                    }),
                                                }}
                                            />
                                            {errors.id_producto && (
                                                <span className="error-message" style={{ color: 'red', fontSize: '0.875rem' }}>
                                                    {errors.id_producto.message}
                                                </span>
                                            )}
                                        </>

                                    )}
                                />
                            )}
                        />
                    </CardData>
                </Fondo>
                {productoUnico && (
                    <BoxTabla>
                        {
                            errorSeries && <Alert className='m-2' severity="error">Debe seleccionar al menos un número de serie.</Alert>
                        }
                        <Box sx={{ maxHeight: '500px', overflowY: 'auto', width: '100%' }}>
                            <MaterialReactTable
                                table={table}
                            />
                        </Box>
                    </BoxTabla>
                )}

                <BtnGuardar
                    type='submit'
                    disabled={loadingSaveStock || loadingStock || loadingLocales || localError}
                >
                    {(loadingStock || loadingSaveStock || loadingLocales) && (
                        <CircularProgress />
                    )}
                    Guardar
                </BtnGuardar>
            </DashboardLayout>
        </form>
    );
}

export default App;
