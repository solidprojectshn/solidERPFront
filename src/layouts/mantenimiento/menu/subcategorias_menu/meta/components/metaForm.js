import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Dialog, DialogTitle, DialogContent, Button, Box, CircularProgress } from "@mui/material";
import { z } from "zod";
import { useSelector, useDispatch } from "react-redux";

import { getMeta, saveMeta, editMeta } from "../../../../../../redux/mantenimientos/meta/actions";
import { getProductType, saveProductType } from "../../../../../../redux/mantenimientos/tipoProducto/actions";
import { getLocal } from "../../../../../../redux/mantenimientos/local/actions";

import Select from 'react-select';
import styled from "@emotion/styled";



//esquema de validación
const formSchema = z.object({
    tipo_producto_id: z.number({ required_error: "Este campo es requerido" }).positive().int(),
    local_id: z.number({ required_error: "Este campo es requerido" }).positive().int(),
    cantidad: z.string()
        .transform((value) => parseInt(value, 10))
        .pipe(z.number({ required_error: "Este campo es requerido", invalid_type_error: "La cantidad debe ser un número entero" }).positive().int()),
})

//estilos
const BoxBotton = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: "95%",
    margin: '2%',
    justifyContent: 'space-between'
}));

const MetaForm = ({ isEdit, initialData, setShowModal, showModal }) => {

    const dispatch = useDispatch();

    const {
        loading,
        saveLoading,
        formError,
    } = useSelector((store) => store.metas);

    const {
        loading: loadingProd,
        productTypes: dataProductos
    } = useSelector((store) => store.productType);

    const {
        username
    } = useSelector((store) => store.auth);

    const user = username

    const {
        loading: loadinglocal,
        locales: datalocales
    } = useSelector((store) => store.local);

    useEffect(() => {
        dispatch(getMeta()),
            dispatch(getProductType()),
            dispatch(getLocal())
    }, [])

    useEffect(() => {
        console.log("Productos cargados:", dataProductos);
    }, [dataProductos]);

    useEffect(() => {
        console.log("Datos Iniciales:", initialData);
    }, [initialData]);

    const ProductosOption = dataProductos
        ? dataProductos.map((prod) => ({
            value: prod.id_tipo_producto,
            label: prod.nombre,
        }))
        : [];

    const LocalOption = datalocales ?
        datalocales.map((lc) => ({ value: lc.id_local, label: lc.nombre })) : []

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control
    } = useForm(
        {
            resolver: zodResolver(formSchema)
        }
    )

    useEffect(() => {
        if (isEdit && initialData.data) {
            reset({
                tipo_producto_id: initialData.data.tipo_producto?.id_tipo_producto || "",
                local_id: initialData.data.local?.id_local || "",
                cantidad: initialData.data.cantidad?.toString() || ""
            });
        } else {
            // Resetear el formulario para añadir nuevas metas
            reset({
                tipo_producto_id: "",
                local_id: "",
                cantidad: ""
            });
        }
    }, [initialData, isEdit, reset]);

    const onCloseModal = () => {
        setShowModal(false);
        reset();
    }

    const onSubmit = (data) => {
        console.log("Estos son los datos del formulario", data);
        if (!data.cantidad) {
            delete data.cantidad
        }

        if (isEdit) {
            data.actualizado_por = user
            console.log(data)
            dispatch(editMeta(data, initialData.data.id_meta, initialData.index, setShowModal))

        } else {
            data.creado_por = user
            console.log(data)
            dispatch(saveMeta(data, setShowModal))
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
                    {isEdit ? "Editar Meta" : "Crear Meta"}
                </DialogTitle>
                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2, // Espaciado entre los elementos
                        padding: "5%",
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        boxShadow: "inset 0px 0px 10px rgba(0, 0, 0, 0.05)",
                    }}
                >
                    <Controller
                        name="tipo_producto_id"
                        control={control}
                        defaultValue={
                            isEdit && initialData?.data?.id_tipo_producto
                                ? {
                                    value: initialData.data.id_tipo_producto,
                                    label: initialData.data.nombre,
                                }
                                : null
                        }
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={ProductosOption}
                                isLoading={loadingProd}
                                placeholder="Seleccione un Producto"
                                value={
                                    ProductosOption.find((option) => option.value === field.value) || null
                                }
                                onChange={(selectedOption) => field.onChange(selectedOption.value)}
                                menuShouldScrollIntoView={false}
                                menuShouldBlockScroll={true}
                                aria-errormessage={errors.tipo_producto_id?.message}
                                isSearchable
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        marginTop: "5%",
                                    }),
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                    }),
                                }}
                            />
                        )}
                    />
                    {errors.tipo_producto_id && <span>{errors.tipo_producto_id.message}</span>}

                    <Controller
                        name="local_id"
                        control={control}
                        defaultValue={
                            isEdit && initialData?.data?.id_local
                                ? {
                                    value: initialData.data.id_local,
                                    label: initialData.data.nombre,
                                }
                                : null
                        }
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={LocalOption}
                                isLoading={loadinglocal}
                                placeholder="Seleccione un Local"
                                value={
                                    LocalOption.find((option) => option.value === field.value) || null
                                }
                                onChange={(selectedOption) => field.onChange(selectedOption.value)}
                                menuShouldScrollIntoView={false}
                                menuShouldBlockScroll={true}
                                aria-errormessage={errors.local_id?.message}
                                isSearchable
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        marginTop: "0%",
                                    }),
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                    }),
                                }}
                            />
                        )}
                    />
                    {errors.local_id && <span>{errors.local_id.message}</span>}

                    <Controller
                        name="cantidad"
                        control={control}
                        defaultValue={isEdit ? initialData.data.cantidad : ""}
                        render={({ field }) => (
                            <input
                                type="number"
                                placeholder="Cantidad"
                                {...field}
                                {...register("cantidad")}
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                style={{
                                    border: "solid 1px #000000",
                                    padding: "5px",
                                    borderRadius: "4px",
                                }}
                            />
                        )}
                    />
                    {errors.cantidad && <p>{errors.cantidad.message}</p>}
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
                        {(saveLoading || loading) && (
                            <CircularProgress />
                        )}
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
    )

}

export default MetaForm;
