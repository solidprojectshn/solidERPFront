import { React, useMemo, useState, useEffect } from 'react';
import styled from "@emotion/styled";
import { Dialog, DialogTitle, DialogContent, Button, TextField, DialogActions, MenuItem, InputLabel, FormControl, Box, Typography, Alert, Checkbox } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { zodResolver } from "@hookform/resolvers/zod"// ESTO
import { z } from 'zod';// ESTO
import { useForm, Controller, useFieldArray, set } from 'react-hook-form';// ESTO
import { useSelector, useDispatch } from "react-redux";// ESTO
import Select from 'react-select'
import { MRT_Localization_ES } from 'material-react-table/locales/es';

import {
    useMaterialReactTable,
} from 'material-react-table';

//estilos modal
const Contenedor = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: '500px',
    height: 'auto',
}));

import {
    editAddStock,
    getProductoAsignado,
    getUnidades
} from "../../../../redux/inventario/agregarStock/actions"
import { CameraAltOutlined, CheckBox } from '@mui/icons-material';

const ModalAddProducto = ({ open, onClose, handleAgregar, listaProductos, setListaProductos, listaUnidades, setListaUnidades }) => {
    const [productoUnico, setProductoUnico] = useState(false); // Control para unidades únicas
    const [selectedProductoAsignado, setSelectedProductoAsignado] = useState(null); // Control para guardar el producto asignado
    const [errorSeries, setErrorSeries] = useState(false);
    const [errorCantidad, setErrorCantidad] = useState(false)
    const [selectedRows, setSelectedRows] = useState([]);
    // Definimos el esquema de validación del formulario

    const formSchema = z
        .object({
            id_producto: z.number({ required_error: "Este campo es requerido", invalid_type_error: "Debe seleccionar una opción" }).positive().int(),
        })

    const dispatch = useDispatch();
    //definicion de las variables del reducer

    const {
        addStocks,
        loading: loadingStock,
        saveLoading: loadingSaveStock,
        formError,
        loadingUnidades,
        unidades
    } = useSelector((store) => store.addStock);

    const { control, handleSubmit, watch, reset, setValue, resetField, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id_producto: '',
            stock: ''
        },
    });

    const selectedProductoId = watch('id_producto');
    const stockCampo = watch('stock');

    useEffect(() => {
        if (addStocks) {
            setListaProductos([...addStocks])
        }
    }, [addStocks])


    const productosOptions = listaProductos ? listaProductos.map((item) => ({ value: item.id_producto_asignado, label: `${item.producto.nombre} - ${item.stock} disponibles` })) : []

    useEffect(() => {
        if (selectedProductoId) {
            const selectedProducto = addStocks.find(
                (prod) => prod.id_producto_asignado === parseInt(selectedProductoId)
            );
            setSelectedProductoAsignado(selectedProducto)
            if (selectedProducto && selectedProducto.producto.tipo_producto.unidades_unicas) {
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

    const handleSelect = (unidad_id, numero_serie) => {
        setSelectedRows((prev) => {
            // Verificar si el elemento ya está seleccionado por su unidad_id y numero_serie
            const isSelected = prev.some(
                (row) => row.unidad_id === unidad_id && row.numero_serie === numero_serie
            );

            if (isSelected) {
                // Si ya está seleccionado, eliminarlo
                return prev.filter(
                    (row) => row.unidad_id !== unidad_id || row.numero_serie !== numero_serie
                );
            } else {
                // Si no está seleccionado, agregarlo
                return [...prev, { unidad_id, numero_serie }];
            }
        });
    };


    function validarCantidad(input) {
        if (input === "") {
            return false;
        }
        const numero = parseInt(input, 10);
        if (!isNaN(numero) && Number.isInteger(numero)) {
            return numero <= selectedProductoAsignado.stock
        }
        return false
    }

    const handleClose = () => {
        // Reinicia estados
        setProductoUnico(false);
        setErrorSeries(false);
        setErrorCantidad(false);
        setSelectedProductoAsignado(null);
        setSelectedRows([]);
        reset();
        onClose();
    }

    const onSubmit = (event) => {
        event.preventDefault();
        setErrorCantidad(false);

        if (productoUnico && selectedRows.length <= 0) {
            setErrorSeries(true);
            return;
        }
        if (!productoUnico && !validarCantidad(stockCampo)) {
            setErrorCantidad(true);
            return;
        }

        const productosAAgregar = [];
        let _listaProductos = [...listaProductos]

        if (productoUnico) {
            selectedRows.forEach((item) => {
                let _listaUnidades = [...listaUnidades]
                const producto = {
                    producto_asignado: selectedProductoId,
                    producto_nombre: selectedProductoAsignado.producto.nombre,
                    tipo_producto: selectedProductoAsignado.producto.tipo_producto.nombre,
                    numero_serie: item.numero_serie,
                    unidad: item.unidad_id,
                    cantidad: 1,
                    precio_venta: parseFloat(selectedProductoAsignado.producto.precio_venta),
                };
                _listaUnidades.push(item.unidad_id)
                setListaUnidades(_listaUnidades)
                productosAAgregar.push(producto);
            });
        } else {

            const producto = {
                producto_asignado: selectedProductoId,
                producto_nombre: selectedProductoAsignado.producto.nombre,
                tipo_producto: selectedProductoAsignado.producto.tipo_producto.nombre,
                numero_serie: null,
                unidad: null,
                cantidad: stockCampo,
                precio_venta: selectedProductoAsignado.producto.precio_venta,
            };
            productosAAgregar.push(producto);
        }
        // Actualizar el arreglo de productos con el stock reducido
        const updatedListaProductos = _listaProductos.map(item => {
            if (item.id_producto_asignado === selectedProductoId) {
                return {
                    ...item,
                    stock: item.stock > 0 ? productoUnico ? item.stock - 1 : item.stock - stockCampo : 0 // Reducir stock si es mayor a 0
                };
            }
            return item; // Devolver los demás elementos sin cambios
        });
        setListaProductos(updatedListaProductos);
        // Llama a handleAgregar con todos los productos
        handleAgregar(productosAAgregar);
        handleClose()

    };


    const columns = useMemo(() => [
        {
            header: 'Número de serie',
            accessorKey: 'numero_serie',
        },
        {
            header: 'Seleccionar',
            id: 'seleccion',
            Cell: ({ row }) => {
                const isSelected = selectedRows.some(
                    (selectedRow) =>
                        selectedRow.unidad_id === row.original?.id_unidad &&
                        selectedRow.numero_serie === row.original?.numero_serie
                );

                const wasAdded = listaUnidades.some(
                    (unidad) => unidad === row.original?.id_unidad
                );

                return (
                    <div>
                        {wasAdded ? (
                            <span>Esta unidad ya ha sido seleccionada</span>
                        ) : (
                            <Checkbox
                                checked={isSelected} // Marca el checkbox si está seleccionado
                                onChange={() => {
                                    handleSelect(row.original?.id_unidad, row.original?.numero_serie); // Selección de fila
                                }}
                                sx={{
                                    border: "1px solid #000000", // Borde cuando está desmarcado
                                }}
                            />
                        )}
                    </div>
                );
            }


        },
    ],);

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
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle variant='h4'>Agregar Producto</DialogTitle>
                <Contenedor>
                    <DialogContent sx={{ width: '100%', height: 'auto' }}>
                        <FormControl sx={{ width: '100%', height: 'auto' }}>
                            <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2% 0% 1% 0%' }} >
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
                                                    placeholder="Seleccione el producto"
                                                    value={field?.value ? productosOptions.find(option => option.value === field.value) : ''} // Encuentra el valor seleccionado
                                                    onChange={(selectedOption) => field.onChange(selectedOption?.value)} // Actualiza el valor seleccionado
                                                    aria-errormessage={errors.id_producto?.message}
                                                    aria-invalid={!!errors.id_producto} // Añade aria-invalid si hay error
                                                    className={errors.id_producto ? 'is-invalid' : ''} // Añade una clase de error si hay error
                                                    // Renderiza el menú de opciones en el body
                                                    menuPortalTarget={document.body}
                                                    isClearable
                                                    styles={{
                                                        control: (base) => ({
                                                        ...base,
                                                        fontSize:'medium',
                                                        width:{sm:320, md:350},
                                                        marginBottom:'2%'
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
                        </FormControl>
                        {!productoUnico && (
                            <>
                                <>
                                    <Typography
                                        variant='h6'
                                        sx={{
                                            color: '#a6a6a6',
                                            fontSize: 'small',
                                            marginBottom:'1%'
                                        }}
                                    >
                                        Cantidad
                                    </Typography>
                                </>

                                <>
                                    <Controller
                                        name="stock"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                type="number"
                                                error={errorCantidad}
                                                helperText={errorCantidad && "Este campo es un número entero requerido y debe ser menor a la cantidad disponible."}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="outlined"
                                                inputProps={{
                                                    min: 0,
                                                }}
                                                sx={{
                                                    width: '100%',
                                                    margin: '0% 0% 2% 0%',
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
                                </>
                            </>
                        )}
                    </DialogContent>
                </Contenedor>
                {productoUnico && (

                    <>
                        {
                            errorSeries && <Alert className='m-2' severity="error">Debe seleccionar al menos un número de serie.</Alert>
                        }
                        <Box sx={{ maxHeight: '500px', overflowY: 'auto', width: '100%' }}>
                            <MaterialReactTable
                                table={table}
                            />
                        </Box>
                    </>
                )}
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button
                        onClick={onSubmit}
                        type="submit"
                    >
                        Agregar
                    </Button>
                </DialogActions>
            </Dialog>
        </form >



    );

};

export default ModalAddProducto;