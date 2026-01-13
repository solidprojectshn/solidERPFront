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
    editCliente,
    saveCliente
} from "../../../../../../redux/mantenimientos/clientes/actions";



//esquema de validación
const formSchema = z.object({
    nombre_completo: z.string({ required_error: "Este campo es requerido" }).trim().min(5, { message: "El campo debe contener un mínimo de 5 caracteres" }).max(500, { message: "El campo debe contener un máximo de 500 caracteres" }),
    dni: z.string().trim().max(15, { message: "El campo debe contener un máximo de 15 caracteres" }),
    //rtn: z.string().trim().max(15, { message: "El campo debe contener un máximo de 15 caracteres" }),
    telefono: z.string({ required_error: "Este campo es requerido" }).trim().min(8, { message: "El campo debe contener un mínimo de 8 caracteres" }).max(50, { message: "El campo debe contener un máximo de 50 caracteres" }),
});

// Estilos
const BoxBotton = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: "95%",
    margin: '2%',
    justifyContent: 'space-between'
}));

const ClienteForm = ({ isEdit, initialData, setShowModal, showModal }) => {

    const dispatch = useDispatch();

    const {loading, saveLoading ,formError} = useSelector((store) => store.cliente);

    const {
        username
    } = useSelector((store) => store.auth);
    
    const user = username

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control
    } = useForm({
        resolver: zodResolver(formSchema)
    });

    useEffect(() => {
        if (isEdit && initialData && initialData.data) {
            reset({
                nombre_completo: initialData.data.nombre_completo|| "",
                dni : initialData.data.dni || "",
                //rtn: initialData.data.rtn|| "",
                telefono: initialData.data.telefono|| "",
            });
        } else {
            // Resetear el formulario cuando se abre para añadir un nuevo cliente
            reset({
                nombre_completo: "",
                dni : "",
                //rtn: "",
                telefono: "",
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
            dispatch(editCliente(data,initialData.data.id_cliente,initialData.index,setShowModal))
            
        } else {
            data.creado_por = user
            console.log(data)
            dispatch(saveCliente(data,setShowModal))
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
                    {isEdit ? 'Editar Cliente' : 'Añada un Cliente'}
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
                        name="nombre_completo"
                        margin="normal"
                        variant="outlined"
                        defaultValue={isEdit ? initialData.data.nombre_completo : ""}
                        size="medium"
                        {...register("nombre_completo")}
                        error={errors.nombre_completo}
                        helperText={errors.nombre_completo?.message}
                    />
                    <TextField
                        placeholder="DNI"
                        name="dni"
                        margin="normal"
                        variant="outlined"
                        defaultValue={isEdit ? initialData.data.dni : ""}
                        size="medium"
                        {...register("dni")}
                        error={errors.dni}
                        helperText={errors.dni?.message}
                    />
                    <TextField
                        placeholder="Telefono"
                        name="telefono"
                        margin="normal"
                        variant="outlined"
                        defaultValue={isEdit ? initialData.data.telefono : ""}
                        size="medium"
                        {...register("telefono")}
                        error={errors.telefono}
                        helperText={errors.telefono?.message}
                    />
                </DialogContent>
                <BoxBotton>
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
                </BoxBotton>
            </form>
        </Dialog>
    );
}

export default ClienteForm;
