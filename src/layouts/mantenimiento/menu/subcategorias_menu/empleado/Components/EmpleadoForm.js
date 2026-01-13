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
    editEmpleado,
    saveEmpleado
} from "../../../../../../redux/mantenimientos/Empleado/actions";

import { getUsuario} from "../../../../../../redux/mantenimientos/usuario/actions";
import { getLocal}from "../../../../../../redux/mantenimientos/local/actions";



//esquema de validación
const formSchema = z.object({
    nombre_completo: z.string({ required_error: "Este campo es requerido" }).trim().min(5, { message: "El campo debe contener un mínimo de 5 caracteres" }).max(500, { message: "El campo debe contener un máximo de 500 caracteres" }),
    telefono: z.string({ required_error: "Este campo es requerido" }).trim().min(8, { message: "El campo debe contener un mínimo de 8 caracteres" }).max(50, { message: "El campo debe contener un máximo de 50 caracteres" }),
    usuario: z.number({ required_error: "Este campo es requerido" }).positive().int(),
    local: z.number({ required_error: "Este campo es requerido" }).positive().int(),
});

// Estilos
const BoxBotton = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: "95%",
    margin: '2%',
    justifyContent: 'space-between'
}));

const EmpleadoForm = ({ isEdit, initialData, setShowModal, showModal }) => {

    const dispatch = useDispatch();
    const {loading, saveLoading ,formError} = useSelector((store) => store.empleado);
    const {loading : userLoanding, saveLoading : userSaveLoanding, usuarios, usuarioError} = useSelector((store) => store.usuario);
    const {loading : localLoanding, saveLoading : localSaveLoading, locales, localError} = useSelector((store) => store.local);
    
    const {
        username
    } = useSelector((store) => store.auth);
    
    const user = username
    useEffect(() => {
        dispatch(getUsuario());        
        dispatch(getLocal());
    }, [dispatch]);

    const localesOptions = locales ?
    locales.map((lc) => ({ value: lc.id_local, label: lc.nombre })) : [];

    const usersOptions = usuarios ?
    usuarios.map((us) => ({ value: us.id, label: us.username })) : [];

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
                nombre: initialData.data.nombre_completo|| "",
                telefono: initialData.data.telefono|| "",
                usuario: initialData.data.usuario || "",
                local: initialData.data.local || "", 
            });
        } else {
            // Resetear formulario.
            reset({
                nombre: "",
                telefono: "",
                usuario: "",
                local: "", 
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
            dispatch(editEmpleado(data,initialData.data.id_empleado,initialData.index,setShowModal))
            
        } else {
            data.creado_por = user
            console.log(data)
            dispatch(saveEmpleado(data,setShowModal))
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
                    {isEdit ? 'Editar Colaborador ' : 'Añadir Colaborador'}
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
                        defaultValue={isEdit ? initialData.data.nombre_completo : ""}
                        size="small"
                        {...register("nombre_completo")}
                        error={errors.nombre_completo}
                        helperText={errors.nombre_completo?.message}
                    />
                    <TextField
                        placeholder="Telefono"
                        name="telefono"
                        margin="normal"
                        variant="outlined"
                        defaultValue={isEdit ? initialData.data.telefono : ""}
                        size="small"
                        {...register("telefono")}
                        error={errors.telefono}
                        helperText={errors.telefono?.message}
                    />
                    <Controller
                        name="local"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={localesOptions}
                                isLoading={localLoanding}
                                placeholder="Local"
                                value={localesOptions.find(option => option.value === field.value) || ""}
                                onChange={(selectedOption) => field.onChange(selectedOption.value)}
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                    menu: (provided) => ({
                                        ...provided,
                                        maxHeight: '150px', 
                                        overflowY: 'auto'
                                    })
                                }}
                                menuShouldScrollIntoView={false}
                                menuShouldBlockScroll={true} 
                                aria-errormessage={errors.id_local?.message}
                                isSearchable
                            />
                        )}
                    />
                    {errors.id_local && <span>{errors.id_local.message}</span>}
                    <Controller
                        name="usuario"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={usersOptions}
                                isLoading={userLoanding}
                                placeholder="User"
                                value={usersOptions.find(option => option.value === field.value) || ""}
                                onChange={(selectedOption) => field.onChange(selectedOption.value)}
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                    menu: (provided) => ({
                                        ...provided,
                                        maxHeight: '150px', 
                                        overflowY: 'auto'
                                    })
                                }}
                                menuShouldScrollIntoView={false}
                                menuShouldBlockScroll={true} 
                                aria-errormessage={errors.id?.message}
                                isSearchable
                            />
                        )}
                    />
                    {errors.id_local && <span>{errors.id.message}</span>}
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

export default EmpleadoForm;
