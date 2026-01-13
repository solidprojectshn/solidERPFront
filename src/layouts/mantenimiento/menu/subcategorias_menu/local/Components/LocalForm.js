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
    editLocal,
    getLocal,
    saveLocal,
} from "../../../../../../redux/mantenimientos/local/actions";

import {
    getTipoLocal
} from "../../../../../../redux/mantenimientos/tipoLocal/actions";


//esquema de validación
const formSchema = z.object({
    nombre: z.string({ required_error: "Este campo es requerido" }).trim().min(2, { message: "El campo debe contener un mínimo de 2 caracteres" }).max(50, { message: "El campo debe contener un máximo de 50 caracteres" }),
    direccion: z.string().max(500, { message: 'El campo debe contener un máximo de 500 caracteres' }),
    telefono: z.string({ required_error: "Este campo es requerido" }).trim().min(8, { message: "El campo debe contener un mínimo de 8 caracteres" }).max(50, { message: "El campo debe contener un máximo de 50 caracteres" }),
    codigo_establecimiento: z.string({ required_error: "Este campo es requerido" }).trim().min(3, { message: "El campo debe contener un mínimo de 1 caracteres" }).max(3, { message: "El campo debe contener un máximo de 3 caracteres" }),
    correlativo_venta:  z.string({ required_error: "Este campo es requerido" }).trim().min(2, { message: "El campo debe contener un mínimo de 2 caracteres" }).max(50, { message: "El campo debe contener un máximo de 50 caracteres" }),
    stock_maximo: z.string()
        .transform((value) => parseInt(value, 10))
        .pipe(z.number({ required_error: "Este campo es requerido", invalid_type_error: "La cantidad debe ser un número entero" }).positive().int()),
    tipo_local_id: z.number({ required_error: "Este campo es requerido" }).positive().int(),
    recarga_guerrilla: z.boolean({ required_error: "Este campo es requerido" }),
});

// Estilos
const BoxBotton = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: "95%",
    margin: '2%',
    justifyContent: 'space-between'
}));

const LocalForm = ({ isEdit, initialData, setShowModal, showModal }) => {

    const dispatch = useDispatch();
    const {loading, saveLoading ,formError} = useSelector((store) => store.local);
    const { loading: loadingTiposLocales, tipoLocales} = useSelector((store) => store.tipoLocal)

    const {
        username
    } = useSelector((store) => store.auth);
    
    const user = username
    const tipoLocalesOptions = tipoLocales ?
        tipoLocales.map((tp) => ({ value: tp.id_tipo_local, label: tp.nombre })) : [];
    
    useEffect(() => {
        dispatch(getTipoLocal())
        console.log("Datos de tipos locales", tipoLocales);
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

    useEffect(() => {
        if (isEdit && initialData && initialData.data) {
            reset({
                nombre: initialData.data.nombre || "",
                direccion: initialData.data.direccion || "",
                telefono: initialData.data.telefono || "",
                correlativo_venta: initialData.data.correlativo_venta || "",
                tipo_local_id: initialData.data.tipo_local.id_tipo_local || "",
                recarga_guerrilla: initialData.data.recarga_guerrilla || false,
            });
        } else {
            // Resetear formulario.
            reset({
                nombre: "",
                direccion: "" ,
                telefono: "",
                correlativo_venta: "",
                tipo_local_id: "" ,
                recarga_guerrilla: false,
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
            dispatch(editLocal(data,initialData.data.id_local,initialData.index,setShowModal))
            
        } else {
            data.creado_por = user
            console.log(data)
            dispatch(saveLocal(data,setShowModal))
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
                    {isEdit ? 'Editar Local ' : 'Añadir Local'}
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
                        placeholder="Direccion"
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
                        size="small"
                        {...register("telefono")}
                        error={errors.telefono}
                        helperText={errors.telefono?.message}
                    />
                    <TextField
                        placeholder="Cod. Establecimiento"
                        name="codigo_establecimiento"
                        margin="normal"
                        variant="outlined"
                        defaultValue={isEdit ? initialData.data.codigo_establecimiento : ""}
                        size="small"
                        {...register("codigo_establecimiento")}
                        error={errors.codigo_establecimiento}
                        helperText={errors.codigo_establecimiento?.message}
                    />
                    <TextField
                        placeholder="Correlativo"
                        name="correlativo_venta"
                        margin="normal"
                        variant="outlined"
                        defaultValue={isEdit ? initialData.data.correlativo_venta : ""}
                        size="small"
                        {...register("correlativo_venta")}
                        error={errors.correlativo_venta}
                        helperText={errors.correlativo_venta?.message}
                    />
                    <TextField
                        placeholder="Stock Maximo"
                        name="stock_maximo"
                        margin="normal"
                        variant="outlined"
                        defaultValue={isEdit ? initialData.data.stock_maximo : ""}
                        size="small"
                        {...register("stock_maximo")}
                        error={errors.stock_maximo}
                        helperText={errors.stock_maximo?.message}
                    />
                    <Controller
                        name="tipo_local_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={tipoLocalesOptions}
                                isLoading={loadingTiposLocales}
                                placeholder="Tipo de locales"
                                value={tipoLocalesOptions.find(option => option.value === field.value) || ""}
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
                                aria-errormessage={errors.tipo_local_id?.message}
                                isSearchable
                            />
                        )}
                    />
                    {errors.tipo_local_id && <span>{errors.tipo_local_id.message}</span>}
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="recarga_guerrilla"
                                size="small"
                                {...register("recarga_guerrilla")}
                                error={errors.recarga_guerrilla}
                                defa
                                defaultChecked={isEdit ? initialData.data.recarga_guerrilla : false}
                                helperText={errors.recarga_guerrilla?.message}
                                sx={{
                                    marginLeft: "10px",
                                }}
                            />
                        }
                        label="Recargas Guerilla"
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

export default LocalForm;
