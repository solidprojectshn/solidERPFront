import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Dialog, DialogTitle, DialogContent, Button, Box, CircularProgress, Alert, Checkbox, TextField, FormControlLabel} from "@mui/material";
import { z } from "zod";
import { useSelector, useDispatch } from "react-redux";
import Select from 'react-select';
import styled from "@emotion/styled";

//acciones del Redux 
import {
    editProducto,
    getProducto,
    saveProducto
} from "../../../../../../redux/mantenimientos/producto/actions";

import {
    getProductType
} from "../../../../../../redux/mantenimientos/tipoProducto/actions";


//esquema de validación
const formSchema = z.object({
    nombre: z.string({ required_error: "Este campo es requerido" }).trim().min(2, { message: "El campo debe contener un mínimo de 2 caracteres" }).max(50, { message: "El campo debe contener un máximo de 50 caracteres" }),
    descripcion: z.string().trim().min(2, { message: "El campo debe contener un mínimo de 2 caracteres" }).max(250, { message: "El campo debe contener un máximo de 250 caracteres" }),
    precio_unitario: z.string()
        .transform((value) => parseFloat(value)) // Convertir string a número
        .pipe(z.number({ required_error: "Este campo es requerido", invalid_type_error: "El precio unitario debe ser un número" })),
    precio_venta: z.string()
        .transform((value) => parseFloat(value)) // Convertir string a número
        .pipe(z.number({ required_error: "Este campo es requerido", invalid_type_error: "El precio de venta debe ser un número" })),
    punto_reorden:z.string()
    .transform((value) => parseInt(value, 10))
    .pipe(z.number({ required_error: "Este campo es requerido", invalid_type_error: "La cantidad debe ser un número entero" }).positive().int()),
    tipo_producto_id: z.number({ required_error: "Este campo es requerido" }).positive().int()
});

// Estilos
const BoxBotton = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: "95%",
    margin: '0% 2% 2% 2%',
    justifyContent: 'space-between'
}));

const ProductoForm = ({ isEdit, initialData, setShowModal, showModal }) => {

    const dispatch = useDispatch();
    const {loading, saveLoading ,formError} = useSelector((store) => store.producto);
    const {loading: loadingTProductos, productTypes: tProductos } = useSelector((store) => store.productType);

    const tipoProductosOptions = tProductos ?
        tProductos.map((tp) => ({ value: tp.id_tipo_producto, label: tp.nombre })) : [];
    
    useEffect(() => {
        dispatch(getProducto())
        dispatch(getProductType())
    }, [dispatch]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control
    } = useForm({
        resolver: zodResolver(formSchema)
    });

    const {
        username
    } = useSelector((store) => store.auth);
    
    const user = username
    
    useEffect(() => {
        if (isEdit && initialData && initialData.data) {
            reset({
                nombre: initialData.data.nombre|| "",
                descripcion: initialData.data.descripcion|| "",
                precio_unitario: initialData.data.precio_unitario|| "",
                precio_venta: initialData.data.precio_venta|| "",
                punto_reorden: initialData.data.punto_reorden|| "",
                tipo_producto_id: initialData.data.tipo_producto.id_tipo_producto|| "",
            });
        } else {
            // Resetear formulario.
            reset({
                nombre: "",
                descripcion: "",
                precio_unitario: "",
                precio_venta: "",
                punto_reorden: "",
                tipo_producto_id: "",
            });
        }
    }, [initialData, isEdit, reset]);

    const onCloseModal = () => {
        setShowModal(false);
        reset();
    }

    const onSubmit = (data) => {
        console.log(data);
        if (!data.descripcion) {
            delete data.descripcion
        }
        
        if (isEdit) {
            data.actualizado_por = user            
            console.log(data)
            dispatch(editProducto(data,initialData.data.id_producto,initialData.index,setShowModal))
            
        } else {
            data.creado_por = user
            console.log(data)
            dispatch(saveProducto(data,setShowModal))
        }

        reset()
    }

    return (
        <Dialog
            open={showModal}
            onClose={onCloseModal}
            fullWidth
            maxWidth="sm"
            sx={{
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "rgba(106, 129, 115, 0.8)",
                fontFamily: "sans-serif"
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>
                    {isEdit ? 'Editar Producto ' : 'Añadir Producto'}
                </DialogTitle>
                {formError && ( <Alert className='mx-4' severity="error">{formError}</Alert>)}
                {console.log(initialData,isEdit)}
                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0,
                        padding: "5%",
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        boxShadow: "inset 0px 0px 10px rgba(0, 0, 0, 0.05)",
                    }}
                >
                    <TextField
                        placeholder="Nombre"
                        name="nombre"
                        margin="normal"
                        variant="outlined"
                        defaultValue={isEdit ? initialData.data.nombre : ""}
                        size="small"
                        {...register("nombre")}
                        error={errors.nombre}
                        helperText={errors.nombre?.message}
                    />
                    <TextField
                        placeholder="Descripcion"
                        name="descripcion"
                        margin="normal"
                        variant="outlined"
                        defaultValue={isEdit ? initialData.data.descripcion : ""}
                        size="small"
                        {...register("descripcion")}
                        error={errors.descripcion}
                        helperText={errors.descripcion?.message}
                    />
                    <TextField
                        placeholder="Precio Unitario"
                        name="precio_unitario"
                        margin="normal"
                        variant="outlined"
                        defaultValue={isEdit ? initialData.data.precio_unitario : ""}
                        size="small"
                        {...register("precio_unitario")}
                        error={errors.precio_unitario}
                        helperText={errors.precio_unitario?.message}
                    />
                    <TextField
                        placeholder="Precio Venta"
                        name="precio_venta"
                        margin="normal"
                        variant="outlined"
                        defaultValue={isEdit ? initialData.data.precio_venta : ""}
                        size="small"
                        {...register("precio_venta")}
                        error={errors.precio_venta}
                        helperText={errors.precio_venta?.message}
                    />
                    <TextField
                        placeholder="Punto de Reorden"
                        name="punto_reorden"
                        margin="normal"
                        variant="outlined"
                        defaultValue={isEdit ? initialData.data.punto_reorden : ""}
                        size="small"
                        {...register("punto_reorden")}
                        error={errors.punto_reorden}
                        helperText={errors.punto_reorden?.message}
                    />
                    <Controller
                    name="tipo_producto_id"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={tipoProductosOptions}
                            isLoading={loadingTProductos}
                            placeholder="Tipo de Producto"
                            value={tipoProductosOptions.find(option => option.value === field.value) || ""}
                            defaultValue={""}
                            onChange={(selectedOption) => field.onChange(selectedOption.value)}
                            menuPortalTarget={document.body}
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    marginTop: '2%' 
                                }),
                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                menu: (provided) => ({
                                    ...provided,
                                    maxHeight: '150px', 
                                    overflowY: 'auto'
                                })
                            }}
                            menuShouldScrollIntoView={false}
                            menuShouldBlockScroll={true} 
                            aria-errormessage={errors.tipo_producto_id?.message}
                            isSearchable
                        />
                    )}
                />
                {errors.tipo_producto_id && <span>{errors.tipo_producto_id.message}</span>}
                </DialogContent>
                <BoxBotton>
                <Button
                    onClick={onCloseModal}
                    type="button"
                    variant="contained"
                    sx={{
                        margin: 0.5,
                        textTransform: 'none',
                        backgroundColor: '#ff0000',
                        width: '60%',
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#ff0000',
                        },
                    }}
                >
                    Cancelar
                </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={saveLoading}
                        sx={{
                            margin: 0.5,
                            textTransform: 'none',
                            backgroundColor: '#43b399',
                            color: '#ffffff',
                            width: '60%',
                            '&:hover': {
                                backgroundColor: '#43b399',
                                color: '#ffffff'
                            },
                        }}
                    >
                        {(saveLoading || loading) && <CircularProgress />}
                        Guardar
                    </Button>
                </BoxBotton>
            </form>
        </Dialog>
    );
}

export default ProductoForm;
