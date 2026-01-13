import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Dialog, DialogTitle, DialogContent, Button, Box, CircularProgress, Alert, Checkbox, TextField, FormControlLabel } from "@mui/material";
import { z } from "zod";
import { useSelector, useDispatch } from "react-redux";
import Select from 'react-select';
import styled from "@emotion/styled";
import { editUsuario, saveUsuario } from "../../../../../../redux/mantenimientos/usuario/actions";



//esquema de validación
const formSchema = z.object({
    username: z.string({ required_error: "Este campo es requerido" }).trim().min(2, { message: "El campo debe contener un mínimo de 2 caracteres" }).max(50, { message: "El campo debe contener un máximo de 50 caracteres" }),
    password: z.string({ required_error: "Este campo es requerido" }).trim().min(2, { message: "El campo debe contener un mínimo de 2 caracteres" }).max(50, { message: "El campo debe contener un máximo de 50 caracteres" }),
    rol: z.number({ required_error: "Este campo es requerido" }).positive().int(),
});

// Estilos
const BoxBotton = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: "95%",
    margin: '2%',
    justifyContent: 'space-between'
}));

const UsuarioForm = ({ isEdit, initialData, setShowModal, showModal }) => {

    const dispatch = useDispatch();

    const { loading, saveLoading, formError } = useSelector((store) => store.usuario);

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
        loading: loadingRol,
        roles,
        rolError,
    } = useSelector((store) => store.rol);

    const rolesOptions = roles ?
    roles.map((tl) => ({ value: tl.id, label: tl.name })) : []

    useEffect(() => {
        if (isEdit && initialData && initialData.data) {
            reset({
                username: initialData.data.username || "",
                password: initialData.data.password || "",
                rol: initialData.data.roles[0].id || "",
            });
        } else {
            // Resetear el formulario cuando se abre para añadir un nuevo cliente
            reset({
                username: "",
                password: "",
                rol:"",                
            });
        }
    }, [initialData, isEdit, reset]);

    const onCloseModal = () => {
        setShowModal(false);
        reset();
    }

    const onSubmit = (data) => {
        console.log(data);
        let req = {
            username: data.username,
            email: data.username,
            is_active: true,
            password: data.password,
            role_ids: [data.rol]
        }

        if (isEdit) {
            console.log(req)
            dispatch(editUsuario(req, initialData.data.id, initialData.index, setShowModal))

        } else {
            console.log(req)
            dispatch(saveUsuario(req, setShowModal))
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
                    {isEdit ? 'Editar Usuario ' : 'Añada un Usuario'}
                </DialogTitle>
                {formError && (<Alert className='mx-4' severity="error">{formError}</Alert>)}
                {console.log(initialData, isEdit)}
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
                        name="username"
                        margin="normal"
                        variant="outlined"
                        defaultValue={isEdit ? initialData.data.username : ""}
                        size="small"
                        {...register("username")}
                        error={errors.username}
                        helperText={errors.username?.message}
                    />
                    <TextField
                        placeholder="Contraseña"
                        type="password"
                        name="password"
                        margin="normal"
                        variant="outlined"
                        defaultValue={isEdit ? initialData.data.password : ""}
                        size="small"
                        {...register("password")}
                        error={errors.password}
                        helperText={errors.password?.message}
                    />
                    <Controller
                        name="rol"
                        control={control}
                        defaultValue={
                            isEdit && initialData?.data?.tipo_local ?
                                { value: initialData.data.tipo_local.id_tipo_local, label: initialData.data.tipo_local.nombre } :
                                null
                        }
                        render={({ field }) => (
                            <>
                                <Select
                                    {...field} // Pasa las propiedades de field al componente Select
                                    options={rolesOptions}
                                    isLoading={loadingRol}
                                    placeholder="Rol"
                                    value={rolesOptions.find(option => option.value === field.value) || ""}
                                    onChange={(selectedOption) => field.onChange(selectedOption.value)} // Actualiza el valor seleccionado
                                    aria-errormessage={errors.rol?.message}
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
                                    isSearchable
                                />
                                {errors.rol && <span>{errors.rol.message}</span>}
                            </>
                        )}
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

export default UsuarioForm;
