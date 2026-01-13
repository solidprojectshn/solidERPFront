import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Dialog, DialogTitle, DialogContent, Button, Box, CircularProgress, Alert, Checkbox, TextField, FormControlLabel} from "@mui/material";
import { z } from "zod";
import { useSelector, useDispatch } from "react-redux";
import Select from 'react-select';
import styled from "@emotion/styled";

//acciones de Redux para manejar los roles
import {
    editInfoEmpresa,
    saveInfoEmpresa
} from "../../../../../../redux/mantenimientos/Empresa/actions";


//esquema de validación
const formSchema = z.object({
    nombre: z.string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no debe exceder los 50 caracteres" }),
  
  rtn: z.string()
    .length(14, { message: "El RTN debe tener exactamente 14 caracteres" }),
    // .length(15, { message: "El RTN debe tener exactamente 15 caracteres" }),

  direccion: z.string()
    .min(5, { message: "La dirección debe tener al menos 5 caracteres" })
    .max(500, { message: "La dirección no debe exceder los 500 caracteres" }),

  telefono: z.string()
    .min(8, { message: "El teléfono debe tener al menos 8 caracteres" })
    .max(50, { message: "El teléfono no debe exceder los 50 caracteres" }),

  correo: z.string()
    .email({ message: "El correo electrónico no es válido" })
    .max(100, { message: "El correo no debe exceder los 100 caracteres" }),
});

// Estilos
const BoxBotton = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: "95%",
    margin: '2%',
    justifyContent: 'space-between'
}));

const EmpresaForm = ({ isEdit, initialData, setShowModal, showModal }) => {

    const dispatch = useDispatch();
    const {loading, saveLoading ,formError} = useSelector((store) => store.empresa);

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
                nombre: initialData.data.nombre|| "",
                rtn: initialData.data.rtn|| "",
                direccion: initialData.data.direccion|| "",
                telefono: initialData.data.telefono|| "",
                correo: initialData.data.correo || "",
            });
        } else {
            // Resetear formulario.
            reset({
                nombre: "",
                rtn: "",
                direccion: "",
                telefono: "",
                correo: "",
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
            dispatch(editInfoEmpresa(data,initialData.data.id_info_empresa,initialData.index,setShowModal))
            
        } else {
            data.creado_por = user
            console.log(data)
            dispatch(saveInfoEmpresa(data,setShowModal))
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
                    {isEdit ? 'Editar Información ' : 'Añada Información'}
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
                        placeholder="RTN"
                        name="rtn"
                        margin="normal"
                        variant="outlined"
                        defaultValue={isEdit ? initialData.data.rtn : ""}
                        size="medium"
                        {...register("rtn")}
                        error={errors.rtn}
                        helperText={errors.rtn?.message}
                    />
                    <TextField
                        placeholder="Dirección"
                        name="direccion"
                        margin="normal"
                        variant="outlined"
                        defaultValue={isEdit ? initialData.data.direccion : ""}
                        size="medium"
                        {...register("direccion")}
                        error={errors.direccion}
                        helperText={errors.direccion?.message}
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
                    <TextField
                        placeholder="Correo"
                        name="correo"
                        margin="normal"
                        variant="outlined"
                        defaultValue={isEdit ? initialData.data.correo : ""}
                        size="medium"
                        {...register("correo")}
                        error={errors.correo}
                        helperText={errors.correo?.message}
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

export default EmpresaForm;
