import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Dialog, DialogTitle, DialogContent, Button, Box, CircularProgress, Alert, Checkbox, TextField, FormControlLabel} from "@mui/material";
import { z } from "zod";
import { useSelector, useDispatch } from "react-redux";
import Select from 'react-select';
import styled from "@emotion/styled";

//acciones de Redux 
import { saveTipoVenta } from "../../../../../../redux/mantenimientos/tipoVenta/actions";

//esquema de validación
const formSchema = z.object({
    nombre: z.string({ required_error: "Este campo es requerido" }).trim().min(2, { message: "El campo debe contener un mínimo de 2 caracteres" }).max(50, { message: "El campo debe contener un máximo de 50 caracteres" }),
});

// Estilos
const BoxBotton = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: "95%",
    margin: '2%',
    justifyContent: 'space-between'
}));

const TVentaForm = ({ setShowModal, showModal }) => {

    const dispatch = useDispatch();

    const {loading, saveLoading ,formError} = useSelector((store) => store.tipoVenta);

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

    const onCloseModal = () => {
        setShowModal(false);
        reset();
    }

    const onSubmit = (data) => {
        data.creado_por = user;
        console.log(data);
        dispatch(saveTipoVenta(data,setShowModal));
        reset();
    }

    return (
        <Dialog
            open={showModal}
            onClose={onCloseModal}
            fullWidth
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>
                    {'Agregar Tipo de Venta'}
                </DialogTitle>
                {formError && ( <Alert className='mx-4' severity="error">{formError}</Alert>)}
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        placeholder="Nombre Tipo Venta"
                        {...register("nombre")}
                        error={errors.nombre}
                        helperText={errors.nombre?.message}
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

export default TVentaForm;
