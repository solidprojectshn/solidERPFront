import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Dialog, DialogTitle, DialogContent, Button, Box, CircularProgress, Alert, Checkbox, TextField, FormControlLabel} from "@mui/material";
import { z } from "zod";
import { useSelector, useDispatch } from "react-redux";
import Select from 'react-select';
import styled from "@emotion/styled";

//acciones de Redux para manejar los tipos de productos
import {
    editProductType,
    saveProductType
} from "../../../../../../redux/mantenimientos/tipoProducto/actions"



//esquema de validación
const formSchema = z.object({
    nombre: z.string({ required_error: "Este campo es requerido" }).trim().min(2, { message: "El campo debe contener un mínimo de 2 caracteres" }).max(50, { message: "El campo debe contener un máximo de 50 caracteres" }),
    unidades_unicas: z.boolean({ required_error: "Este campo es requerido" }),
    descripcion: z.string().max(250, { message: 'El campo debe contener un máximo de 250 caracteres' })
});

// Estilos
const BoxBotton = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: "95%",
    margin: '2%',
    justifyContent: 'space-between'
}));

const DialogForm = ({ isEdit, initialData, setShowModal, showModal }) => {

    const dispatch = useDispatch();

    const {loading, saveLoading ,formError} = useSelector((store) => store.productType);

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
                nombre: initialData.data.nombre || "",
                descripcion: initialData.data.descripcion || "",
                unidades_unicas: initialData.data.unidades_unicas || false,
            });
        } else {
            // Resetear el formulario cuando se abre para añadir un nuevo tipo de producto
            reset({
                nombre: "",
                descripcion: "",
                unidades_unicas: false,
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
            dispatch(editProductType(data,initialData.data.id_tipo_producto,initialData.index,setShowModal))
            
        } else {
            data.creado_por = user
            console.log(data)
            dispatch(saveProductType(data,setShowModal))
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
                    {isEdit ? 'Editar Tipo de Producto' : 'Agregar Tipo de Producto'}
                </DialogTitle>
                {formError && ( <Alert className='mx-4' severity="error">{formError}</Alert>)}
                {console.log(initialData,isEdit)}
                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
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
                        size="medium"
                        {...register("nombre")}
                        error={errors.nombre}
                        helperText={errors.nombre?.message}

                    />
                    <TextField
                        placeholder="Descripción"
                        name="descripcion"
                        margin="normal"
                        variant="outlined"
                        defaultValue={isEdit && initialData.data?.descripcion ? initialData.data?.descripcion : ""}
                        size="medium"
                        {...register("descripcion")}
                        error={errors.descripcion}
                        helperText={errors.descripcion?.message}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="unidades_unicas"
                                size="small"
                                {...register("unidades_unicas")}
                                error={errors.unidades_unicas}
                                defa
                                defaultChecked={isEdit ? initialData.data.unidades_unicas : false}
                                helperText={errors.unidades_unicas?.message}
                                sx={{
                                    marginLeft: "10px",
                                }}
                            />
                        }
                        label="Unidades Únicas"
                        labelPlacement="end"
                        sx={{
                            '& .MuiFormControlLabel-label': {
                                fontSize: '0.8rem',
                                fontFamily: 'sans-serif',
                                color:'000000'
                            },
                        }}
                    />
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

export default DialogForm;
