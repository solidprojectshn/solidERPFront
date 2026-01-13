import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Dialog, DialogTitle, DialogContent, Button, Box, CircularProgress, Alert, TextField } from "@mui/material";
import { z } from "zod";
import { useSelector, useDispatch } from "react-redux";
import Select from 'react-select';
import styled from "@emotion/styled";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import moment from "moment";
import { editRangoFactura, saveRangoFactura } from "../../../../../../redux/mantenimientos/rango_factura/actions";
import { getLocal } from "../../../../../../redux/mantenimientos/local/actions";

// Obtener usuario actual
const user = JSON.parse(localStorage.getItem('user-info'))?.username;

// Esquema de validación con Zod
const formSchema = z.object({
    local: z.number({ required_error: "Este campo es requerido" }).positive().int(),
    numero_inicio: z.string()
        .transform((value) => parseInt(value, 10))
        .pipe(z.number({ required_error: "Este campo es requerido", invalid_type_error: "Debe ser un número entero" }).positive().int()),
    numero_final: z.string()
        .transform((value) => parseInt(value, 10))
        .pipe(z.number({ required_error: "Este campo es requerido", invalid_type_error: "Debe ser un número entero" }).positive().int()),
    numero_actual: z.string()
        .transform((value) => parseInt(value, 10))
        .pipe(z.number({ required_error: "Este campo es requerido", invalid_type_error: "Debe ser un número entero" }).nonnegative().int()),
    cai: z.string().nonempty({ message: "Este campo es obligatorio" }),
    fecha_vencimiento: z.any().refine(val => val === null || dayjs(val).isValid(), {
        message: "Debe ser una fecha válida",
    }),
});

// Estilos
const BoxBotton = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: "95%",
    margin: '2%',
    justifyContent: 'space-between'
}));

const RangoFacturaForm = ({ isEdit, initialData, setShowModal, showModal }) => {
    const dispatch = useDispatch();
    const { loading, saveLoading, formError } = useSelector((store) => store.rangoFactura);
    const { loading: loadingLocales, locales } = useSelector((store) => store.local);

    const localesOptions = locales?.map((lc) => ({ value: lc.id_local, label: lc.nombre })) || [];

    useEffect(() => {
        dispatch(getLocal());
    }, [dispatch]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            local: "",
            numero_inicio: "",
            numero_final: "",
            numero_actual: "",
            cai: "",
            fecha_vencimiento: null
        }
    });

    useEffect(() => {
        console.log("Initial Data:", initialData);
        if (isEdit && initialData?.data) {
            reset({
                local: initialData.data.local.id_local || "",
                numero_inicio: initialData.data.numero_inicio || "",
                numero_final: initialData.data.numero_final || "",
                numero_actual: initialData.data.numero_actual || "",
                cai: initialData.data.cai || "",
                fecha_vencimiento: initialData.data.fecha_vencimiento ? dayjs(initialData.data.fecha_vencimiento) : null,
            });
        } else {
            reset();
        }
    }, [initialData, isEdit, reset]);

    const onCloseModal = () => {
        setShowModal(false);
        reset();
    };

    const onSubmit = (data) => {
        console.log("Datos antes de enviar:", data);

        data.local_id = Number(data.local);  // Asegurar que sea número
        data.numero_inicio = Number(data.numero_inicio);
        data.numero_final = Number(data.numero_final);
        data.numero_actual = Number(data.numero_actual);

        data.fecha_vencimiento = data.fecha_vencimiento
            ? moment(data.fecha_vencimiento).format('YYYY-MM-DD')
            : null;

        if (isEdit) {
            data.actualizado_por = user;
            dispatch(editRangoFactura(data, initialData.data.id_rango_factura, initialData.index, setShowModal));
        } else {
            data.creado_por = user;
            console.log("Datos enviados al backend:", data);
            dispatch(saveRangoFactura(data, setShowModal));
        }

        reset();
    };

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
                <DialogTitle>{isEdit ? 'Editar Rango' : 'Añadir Rango'}</DialogTitle>
                {formError && <Alert severity="error">{formError}</Alert>}

                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 1.5, padding: "5%" }}>
                    <Controller
                        name="local"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={localesOptions}
                                isLoading={loadingLocales}
                                placeholder="Seleccione un local"
                                value={localesOptions.find(option => option.value === field.value) || null}
                                onChange={(selectedOption) => field.onChange(selectedOption.value)}
                                menuPortalTarget={document.body}
                                styles={{
                                    control: (base) => ({ ...base, marginTop: "2%" }),
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                                menuShouldScrollIntoView={false}
                                menuShouldBlockScroll={true}
                                aria-errormessage={errors.local?.message}
                                isSearchable
                            />
                        )}
                    />
                    <TextField
                        placeholder="Número de Inicio"
                        {...register("numero_inicio")}
                        error={!!errors.numero_inicio}
                        helperText={errors.numero_inicio?.message}
                    />
                    <TextField
                        placeholder="Número Final"
                        {...register("numero_final")}
                        error={!!errors.numero_final}
                        helperText={errors.numero_final?.message}
                    />
                    <TextField
                        placeholder="Número Actual"
                        {...register("numero_actual")}
                        error={!!errors.numero_actual}
                        helperText={errors.numero_actual?.message}
                    />
                    <TextField
                        placeholder="CAI"
                        {...register("cai")}
                        error={!!errors.cai}
                        helperText={errors.cai?.message}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                            name="fecha_vencimiento"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    label="Fecha de Vencimiento"
                                    value={field.value || null}
                                    onChange={(newValue) => {
                                        field.onChange(newValue ?  moment(new Date(newValue)) : null)
                                    }}
                                    slotProps={{
                                        textField: {
                                          InputProps: {
                                            sx: {
                                              fontSize: 'small', // Tamaño del texto del input
                                              svg: {
                                                fontSize: '20px', // Tamaño del ícono del calendario
                                              },
                                            },
                                          },
                                          InputLabelProps: {
                                            sx: {
                                              fontSize: 'small', // Tamaño del texto de la etiqueta
                                            },
                                          },
                                        },
                                    }}
                                    renderInput={(params) => 
                                    <TextField 
                                        {...params}
                                        error={!!errors.fecha_vencimiento}
                                    />}
                                />
                            )}
                        />
                    </LocalizationProvider>
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
};

export default RangoFacturaForm;
