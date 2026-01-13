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
    editDenominacion,
    saveDenominacion
} from "../../../../../../redux/mantenimientos/denominacion/actions";


//esquema de validación
const formSchema = z.object({
    valor: z
        .number({ required_error: "Este campo es requerido" }) // Debe ser un número, no un string
        .min(0.05, { message: "El valor debe ser mayor o igual a 0.05" }) // No tiene sentido `min(0.05)` en `string`
        .max(1000, { message: "El valor debe ser menor o igual a 1000" }), // Permitimos hasta 1000 como en el modelo
});

// Estilos
const BoxBotton = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: "95%",
    margin: '2%',
    justifyContent: 'space-between'
}));

const DenominacionForm = ({ isEdit, initialData, setShowModal, showModal }) => {

    const dispatch = useDispatch();
    const {loading, saveLoading ,formError} = useSelector((store) => store.denominacion);

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
                valor: initialData.data.valor|| "",
            });
        } else {
            // Resetear formulario.
            reset({
                valor: "",
            });
        }
    }, [initialData, isEdit, reset]);

    const onCloseModal = () => {
        setShowModal(false);
        reset();
    }

    const onSubmit = (data) => {
        console.log(data);
       
        if (isEdit) {
            data.actualizado_por = user            
            console.log(data)
            dispatch(editDenominacion(data,initialData.data.id_denominacion,initialData.index,setShowModal))
            
        } else {
            data.creado_por = user
            console.log(data)
            dispatch(saveDenominacion(data,setShowModal))
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
                    {isEdit ? 'Editar Denominación ' : 'Añada Denominación'}
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
                        placeholder="Valor"
                        name="valor"
                        margin="normal"
                        variant="outlined"
                        defaultValue={isEdit ? initialData.data.valor : ""}
                        size="medium"
                        {...register("valor", { valueAsNumber: true })}
                        error={errors.valor}
                        helperText={errors.valor?.message}
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

export default DenominacionForm;
