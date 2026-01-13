import React, { useEffect, useMemo, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"// ESTO
import { z } from 'zod';// ESTO
import { useForm, Controller, useFieldArray } from 'react-hook-form';// ESTO
import Select from 'react-select'

import { useSelector, useDispatch } from "react-redux";// ESTO
import { Box, TextField, IconButton, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { margin, maxWidth, styled } from '@mui/system';
import { MaterialReactTable } from 'material-react-table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const BoxPrincipal = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'start',
    width: '100%',
    height: 'auto',
    fontFamily: '"Montserrat", sans-serif',
}));

const Fondo = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 'auto',
    padding: '2% 0% 2% 0%',
    marginBottom: '3%',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
    },
}));

const BoxSelCant = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: '1%',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        width: '100%',
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        backgroundColor: '#ffffff',
        outline: 'none',
        padding: '11px',
        transition: 'border-color 0.3s ease',
    },
    width: '70%',
    height: '9vh',
    marginLeft: '0.5%',
    [theme.breakpoints.down('lg')]: {
        width: '100%',
    },
}));

const BoxSeries = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
    },
}));

const BotonSeries = styled(Button)(({ theme }) => ({
    width: '10%',
    margin: '1% 1% 1% 1%',
    height: '8vh',
    backgroundColor: '#000000',
    color: '#ffffff',
    borderRadius: '5px',
    '&:hover': {
        backgroundColor: '#333333',
    },
    [theme.breakpoints.down('sm')]: {
        width: '96%',
        margin: '3% 0% 0% 0%',
    },
}));

const BotonGuardar = styled(Button)(({ theme }) => ({
    width: '100%',
    height: '8vh',
    backgroundColor: '#000000',
    color: '#ffffff',
    borderRadius: '5px',
    '&:hover': {
        backgroundColor: '#333333',
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
    margin: '-5% 0% 1.5% 0%',
    padding: '1%',
    boxShadow: theme.shadows[3],
}));


import {
    saveAddStock
} from "../../../redux/inventario/agregarStock/actions"

//se importa funcion de la llave foranea 
import {
    getProducto
} from "../../../redux/mantenimientos/producto/actions"

import {
    getLocal
} from "../../../redux/mantenimientos/local/actions"
//
import { BODEGA_PRINCIPAL } from 'services/constantes';
import { toast } from 'react-toastify';


// Definimos el esquema de validación del formulario

const formSchema = z.object({
    id_producto: z.number({ required_error: "Este campo es requerido", invalid_type_error: "Debe seleccionar una opción" }).positive().int(),
    stock: z
        .string()
        .transform((val) => parseInt(val, 10)) // Convierte el valor a entero antes de la validación
        .pipe(
            z.number({ required_error: "Este campo es requerido", invalid_type_error: "Debe ser un número entero" })
                .positive()
                .int()
        )
})



const PrincipalStock = () => {
    const dispatch = useDispatch();// ESTO
    //definicion de las variables del reducer
    const {
        loading: loadingProductos,
        productos,
        productoError
    } = useSelector((store) => store.producto);// ESTO

    const {
        username
    } = useSelector((store) => store.auth);

    const user = username

    const {
        loading: loadingLocales,
        locales,
        localError
    } = useSelector((store) => store.local);

    const {
        saveLoading: loadingStock,
        formError
    } = useSelector((store) => store.addStock);

    useEffect(() => {
        dispatch(getProducto())
        dispatch(getLocal())
    }, [])

    const [productoUnico, setProductoUnico] = useState(false); // Control para unidades únicas
    const [numerosSerie, setNumerosSerie] = useState([])
    const [serie, setSerie] = useState(""); // Estado para el número de serie
    const [errorSeries, setErrorSeries] = useState(false)
    const [bodegaPrincipal, setBodegaPrincipal] = useState(null)

    const { control, handleSubmit, watch, reset, setValue, resetField, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id_producto: '',
            stock: ''
        },
    });

    useEffect(() => {
        if (locales && !loadingLocales) {
            let bodegaPrincipalId = locales.find((item) => item.correlativo_venta === BODEGA_PRINCIPAL)
            setBodegaPrincipal(bodegaPrincipalId)
        }

    }, [locales])

    const productosOptions = productos ?
        productos.map((tp) => ({ value: tp.id_producto, label: tp.nombre })) : []
    const cantidadStock = watch('stock');


    const selectedProductoId = watch('id_producto');


    useEffect(() => {
        if (selectedProductoId) {
            const selectedProducto = productos.find(
                (prod) => prod.id_producto === parseInt(selectedProductoId)
            );
            if (selectedProducto && selectedProducto.tipo_producto.unidades_unicas) {
                setProductoUnico(true);
            } else {
                setProductoUnico(false);
                setNumerosSerie([])// Resetea el arreglo si no son unidades únicas
            }
        } else {
            setProductoUnico(false);
        }
    }, [selectedProductoId, productos, resetField]);

    const onSubmit = (data) => {
        console.log(data)
        if (productoUnico && Number(cantidadStock) !== numerosSerie.length) {
            setErrorSeries(true)
            return
        }
        let req = {
            id_producto: data.id_producto,
            stock: data.stock,
            id_destino: bodegaPrincipal.id_local,
            creado_por: user
        }
        console.log(req, numerosSerie)
        dispatch(saveAddStock(req, numerosSerie));
        reset()
        setNumerosSerie([])
        setProductoUnico(false)
        setErrorSeries(false)
    };


    const handleAddSerie = () => {
        if (serie && numerosSerie.length < cantidadStock) {
            let hayDuplicados = numerosSerie.some((item) => item.serie  == serie)
            if(hayDuplicados) {
                toast.error("No pueden haber números de serie iguales.")
                return
            }
            let numeros = [...numerosSerie, { serie: serie }]
            setNumerosSerie(numeros)
            setSerie(''); // Limpia el campo de entrada
            numeros.length === Number(cantidadStock) && setErrorSeries(false)
        }
    };

    const handleDeleteSerie = (index) => {
        const nuevosNumerosSerie = numerosSerie.filter((_, i) => i !== index);
        setNumerosSerie(nuevosNumerosSerie);
    };

    const columns = useMemo(() => [
        { accessorKey: 'serie', header: 'Numero de Serie' },
        {
            header: 'Acciones',
            id: 'acciones',
            Cell: ({ row: { index } }) => (
                <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                    <IconButton color="secondary" onClick={() => handleDeleteSerie(index)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ], [numerosSerie]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <BoxPrincipal>
                <Fondo>
                    <BoxSelCant>
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
                                                isLoading={loadingProductos}
                                                placeholder="Seleccione un Producto"
                                                value={field.value ? productosOptions.find(option => option.value === field.value) : ''} // Encuentra el valor seleccionado
                                                onChange={(selectedOption) => field.onChange(selectedOption.value)} // Actualiza el valor seleccionado
                                                aria-errormessage={errors.id_producto?.message}
                                                aria-invalid={!!errors.id_producto} // Añade aria-invalid si hay error
                                                className={errors.id_producto ? 'is-invalid' : ''} // Añade una clase de error si hay error
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    container: (provided) => ({
                                                        ...provided,
                                                        margin: "2%",
                                                        width: '96%'
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
                        <Controller
                            name="stock"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field}
                                    placeholder="Ingrese cantidad"
                                    error={errors.stock}
                                    helperText={errors.stock?.message}
                                    sx={{
                                        margin: "2%",
                                        width: '96%',
                                    }}
                                />
                            )}
                        />
                    </BoxSelCant>
                </Fondo>
                {productoUnico && (
                    <>
                        <BoxTabla>
                            <BoxSeries>
                                <TextField
                                    value={serie}
                                    onChange={(e) => setSerie(e.target.value)}
                                    placeholder="Número de serie"
                                    disabled={Number(cantidadStock) === numerosSerie.length}
                                    sx={{
                                        margin: "2%",
                                        width: {
                                            xs: '96%',
                                            md: '90%'
                                        }
                                    }}
                                />
                                <Button
                                    onClick={handleAddSerie}
                                    disabled={Number(cantidadStock) === numerosSerie.length}
                                    type='button'
                                    sx={{
                                        background: '#000000',
                                        width: { xs: '96%', md: '10%' },
                                        height: '7vh',
                                        color: '#ffffff',
                                        margin: { sm: '3% 0% 0% 0%', md: '2%' },
                                    }}
                                >
                                    Agregar
                                </Button>
                            </BoxSeries>
                            <Box sx={{ overflowY: 'auto', width: '100%' }}>
                                {
                                    errorSeries && <Alert className='m-2' severity="error">Debe ingresar {cantidadStock} números de serie.</Alert>
                                }
                                <MaterialReactTable columns={columns} data={numerosSerie} enableRowSelection={false} />
                            </Box>
                        </BoxTabla>
                    </>
                )}
                <BotonGuardar
                    type='submit'
                    disabled={loadingStock || loadingLocales || loadingProductos || localError || productoError}
                >
                    {(loadingStock || loadingLocales || loadingProductos) && (
                        <CircularProgress />
                    )}
                    Guardar
                </BotonGuardar>
            </BoxPrincipal>

        </form>
    );
};

export default PrincipalStock;
