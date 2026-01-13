import { React, useEffect, useMemo, useState } from "react";
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import styled from "@emotion/styled";
import { CssBaseline, Box, Typography, TextField, Button, CircularProgress, Alert } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";
import { zodResolver } from "@hookform/resolvers/zod"// ESTO
import { z } from 'zod';// ESTO

import { useForm, Controller, useFieldArray, set } from 'react-hook-form';// ESTO
import { useSelector, useDispatch } from "react-redux";// ESTO
//icons
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import {
    saveArqueo, getResumenMetodoPago, getDenominaciones, getArqueo

} from "../../../redux/facturacion/arqueo/actions"


import {
    getLocal
} from "../../../redux/mantenimientos/local/actions"


import {
    getMetodoPago
} from "../../../redux/mantenimientos/metodopago/actions"

import moment from "moment";
import { TIPO_METODO_PAGO } from "./../../../services/constantes";
import { getRecargaSummary } from "../../../redux/facturacion/recargaSummary/actions";

//alerta
import swal from "sweetalert";

//estilos nav
const BoxNav = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#43b399',
    width: '100%',
    height: '20vh',
    padding: '1.5%'
}))

const Fdata = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    width: '99%',
    height: 'auto',
    margin: '2% 0% 2% 0%',
    alignItems: 'start',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column', // En pantallas pequeñas, cambiar a columna
    }
}));

const Fondo = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    width: '50%',
    height: 'auto',
    margin: '0.5%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1%',
    boxShadow: theme.shadows[3],
    [theme.breakpoints.down('sm')]: {
        width: '100%', // En pantallas pequeñas, que ocupe todo el ancho
    }
}));


const Paper = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    width: '98%',
    height: 'auto',
    margin: '0.1%',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'row',
    }
}));

const Data = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    width: '33%',
    height: '5vh',
    margin: '0.5%',
    alignItems: 'center',
    justifyContent: 'center',
    border: '0.5px solid #000000',
}));

//Saldo
const TitSaldo = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#6a8173',
    width: '98%',
    height: '5vh',
    margin: '1%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1%',
    [theme.breakpoints.down('sm')]: {
        width: '98',
        margin: '1%',
    }
}));

const TitSaldoProd = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#6a8173',
    width: '98%',
    height: '5vh',
    margin: '1%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1%',
    [theme.breakpoints.down('sm')]: {
        width: '98',
        margin: '1%',
    }
}));

const TitDenom = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#6a8173',
    width: '98%',
    height: '5vh',
    margin: '1%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1%',
    [theme.breakpoints.down('sm')]: {
        width: '98',
        margin: '1%',
    }
}));

const FondSaldo = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    width: '98%',
    height: 'auto',
    margin: '0.5%',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        margin: '1%',
    }
}));

const DataSaldo = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    width: '47%',
    height: 'auto',
    margin: '1%',
    padding: '1%',
    alignItems: 'start',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
        width: '98%'
    }
}));

const Arqueo = () => {
    const dispatch = useDispatch()
    const username = JSON.parse(localStorage.getItem('user-info'))?.username
    const [pagosRecargaEnviada, setPagosRecargaEnviada] = useState([]);
    const [denominacionesSeleccionadas, setDenominacionesSeleccionadas] = useState([]);
    const [disableArqueosPage, setDisableArqueosPage] = useState(false);



    //definicion de las variables del reducer
    const {
        loading: loadingLocales,
        locales,
        localError
    } = useSelector((store) => store.local);

    const {
        loadingRecargaSummary,
        recargaSummary,
        recargaSummaryError,
    } = useSelector((store) => store.recargaSummary);

    const {
        saveLoading: saveLoadingArqueo,
        formError,
        resumenMetodoPago,
        loadingResumenMetodoPago,
        resumenMetodoPagoError,
        denominaciones,
        loadingDenominaciones,
        denominacionesPagoError,
        arqueos,
        loading: loadingArqueo,


    } = useSelector((store) => store.arqueos);


    const {
        loading: loadingMetodosPago,
        metodosPago,
        metodoPagoError
    } = useSelector((store) => store.metodoPago);

    const {
        user
    } = useSelector((store) => store.auth);

    const tieneLocal = user?.local_id || false

    // Definimos el esquema de validación del formulario

    const formSchema = z.object({
        saldo_inicial_recarga: z
            .string() // Primero lo definimos como string para poder validar el formato decimal
            .nonempty('El saldo inicial es obligatorio') // Valida que no esté vacío
            .refine(value => !isNaN(parseFloat(value)), {
                message: 'El saldo inicial debe ser un número decimal',
            })
            .transform(value => parseFloat(value)) // Convierte el valor a número decimal
            .refine(value => value >= 0, {
                message: 'El saldo inicial debe ser un número positivo',
            }),
        saldo_enviado: z
            .string() // Primero lo definimos como string para poder validar el formato decimal
            .nonempty('El saldo enviado es obligatorio') // Valida que no esté vacío
            .refine(value => !isNaN(parseFloat(value)), {
                message: 'El saldo enviado debe ser un número decimal',
            })
            .transform(value => parseFloat(value)) // Convierte el valor a número decimal
            .refine(value => value >= 0, {
                message: 'El saldo enviado debe ser un número positivo',
            }),

        recargas_guerrilla: z
            .string()
            .optional()
            .transform(value => (value?.trim() === "" ? undefined : value)) // Trata cadenas vacías como undefined
            .refine(value => value === undefined || !isNaN(parseFloat(value)), {
                message: 'Si se proporciona, el campo recargas guerrilla debe ser un número decimal',
            })
            .transform(value => (value ? parseFloat(value) : undefined)) // Convierte el valor a número decimal o deja undefined
            .refine(value => value === undefined || value >= 0, {
                message: 'Si se proporciona, el campo recargas guerrilla debe ser un número positivo',
            }),
        comentario: z.string().max(50, "El comentario no puede tener más de 50 caracteres").optional(),
    });

    useEffect(() => {
        dispatch(getArqueo({
            fecha_busqueda: moment().format('YYYY-MM-DD'),
            local: tieneLocal
        }))
    }, [])

    useEffect(() => {
        if (user) {
            dispatch(getDenominaciones())
            dispatch(getMetodoPago())
            dispatch(getLocal())
            dispatch(getResumenMetodoPago({
                fecha: moment().format('YYYY-MM-DD'),
                local: tieneLocal
            }))
            dispatch(getRecargaSummary({
                fecha: moment().format('YYYY-MM-DD'),
                local: tieneLocal
            }))

        }

    }, [user])

    const { control, handleSubmit, watch, reset, resetField, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            saldo_inicial_recarga: "",
            saldo_enviado: "",
            recargas_guerrilla: "",
            comentario: "",

        },
    });

    const onSubmit = async (data) => {
        console.log(data)
        let denominacionesArray = denominacionesSeleccionadas.map((item) => {
            return {
                denominacion_id: item.denominacion,
                cantidad: item.cantidad,
                creado_por: username
            }
        })

        let recMetodoPagoArray = pagosRecargaEnviada.map((item) => {
            // Obtener el monto adicional desde recargaSummary si existe
            const montoRecarga = recargaSummary?.resumen?.find(
                (recarga) => recarga.id_metodo_pago === item.id_metodo_pago
            )?.total_monto || 0;

            return {
                metodo_pago_id: item.id_metodo_pago,
                monto: item.monto + montoRecarga, // Sumar el monto de recargas si hay datos
                creado_por: username,
            };
        });

        let ventasMetodoPago = resumenMetodoPago?.resumen?.map((item) => {
            return {
                metodo_pago_id: item.id_metodo_pago,
                monto: item.total_monto,
                creado_por: username

            }
        })
        let req = {
            local: localEmpleado.id_local,
            total_efectivo_arqueado: sumaImportes,
            fondo_fijo: fondoFijo,
            diferencia: diferencia,
            saldo_inicial_recarga: data.saldo_inicial_recarga,
            saldo_enviado: data.saldo_enviado,
            recargas_guerrilla: data?.recargas_guerrilla || 0,
            saldo_final: saldoFinal,
            creado_por: username,
            detalle_arqueo: denominacionesArray,
            recarga_metodo_pago: recMetodoPagoArray,
            arqueo_metodo_pago: ventasMetodoPago

        }

        if (data?.comentario) req.comentario = data?.comentario
        if (data?.recargas_guerrilla) req.recargas_guerrilla = data?.recargas_guerrilla
        console.log(req)
        await dispatch(saveArqueo(req));
        reset();

        setDenominacionesSeleccionadas([])
        setPagosRecargaEnviada([])
        setDisableArqueosPage(true)
    }

    // Función para manejar el evento de presionar "Enter" y evitar el envío directo
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();  // Prevenir el envío directo al presionar Enter
            swal({
                title: "¿Estás seguro?",
                text: "¿Deseas Enviar el arqueo?",
                icon: "warning",
                buttons: ["Cancelar", "Sí, enviar"],
                dangerMode: true,
            }).then(async (willSubmit) => {
                if (willSubmit) {
                    // Llamar a la función de envío
                    handleSubmit(onSubmit)();
                }
            });
        }
    };

    const handleCantidadChange = (idDenominacion, valorDenominacion, cantidad) => {
        if (cantidad < 0) return;
        const importe = cantidad * valorDenominacion;

        setDenominacionesSeleccionadas((prev) => {
            // Verifica si la denominación ya está en el arreglo
            const existente = prev.find((item) => item.denominacion === idDenominacion);

            if (existente) {
                // Actualiza la cantidad y el importe si ya existe
                return prev?.map((item) =>
                    item.denominacion === idDenominacion
                        ? { ...item, cantidad, importe }
                        : item
                );
            } else {
                // Agrega un nuevo elemento si no existe
                return [...prev, { denominacion: idDenominacion, cantidad, importe }];
            }
        });
    };

    const handleMontoChange = (idMetodoPago, monto, nombre) => {
        if (monto < 0) return; // Evitar números negativos

        setPagosRecargaEnviada((prev) => {
            const existente = prev.find((pago) => pago.id_metodo_pago === idMetodoPago);

            if (existente) {
                return prev?.map((pago) =>
                    pago.id_metodo_pago === idMetodoPago ? { ...pago, monto } : pago
                );
            } else {
                return [...prev, { id_metodo_pago: idMetodoPago, monto, nombre_metodo: nombre }];
            }
        });
    };

    const calcularTotal = () => {
        return pagosRecargaEnviada?.reduce((total, pago) => total + pago.monto, 0);
    };

    const sumaImportes = denominacionesSeleccionadas?.reduce(
        (acumulado, item) => acumulado + (item.importe || 0),
        0
    );

    // Crear un mapa de los totales iniciales desde resumenMetodoPago
    const totalesIniciales = new Map(
        resumenMetodoPago.resumen?.map((item) => [item.id_metodo_pago, item.total_monto]) || []
    );

    // Sumar los montos de la API de recargas si existen
    if (recargaSummary?.resumen?.length) {
        console.log("Si entra en recargaSummary");
        recargaSummary.resumen.forEach(({ id_metodo_pago, total_monto }) => {
            console.log(id_metodo_pago, total_monto, "Recarga antes de sumar");
            const montoActual = totalesIniciales.get(id_metodo_pago) || 0;
            totalesIniciales.set(id_metodo_pago, montoActual + total_monto);
            console.log(id_metodo_pago, totalesIniciales.get(id_metodo_pago), "Recarga después de sumar");
        });
    }

    // Verificar el estado de totalesIniciales después de la suma
    console.log("totalesIniciales después de la suma:", Array.from(totalesIniciales.entries()));

    // Crear el resumen actualizado basado en pagosRecargaEnviada y totalesIniciales
    const resumenActualizado = (pagosRecargaEnviada || []).map((recarga) => {
        const totalInicial = totalesIniciales.get(recarga.id_metodo_pago) || 0;
        console.log(recarga.id_metodo_pago, totalInicial, recarga.monto, "Antes de sumar en resumenActualizado");
        return {
            id_metodo_pago: recarga.id_metodo_pago,
            metodo_pago: recarga.nombre_metodo || "Desconocido",
            total_monto: totalInicial + recarga.monto,
        };
    });

    // Verificar que resumenActualizado tenga los valores correctos
    console.log("Resumen actualizado antes de agregar métodos faltantes:", resumenActualizado);

    // Agregar métodos de la API que no estén en pagosRecargaEnviada
    resumenMetodoPago?.resumen?.forEach((metodo) => {
        const yaIncluido = resumenActualizado.some((item) => item.id_metodo_pago === metodo.id_metodo_pago);
        if (!yaIncluido) {
            console.log(metodo.id_metodo_pago, "Agregado desde resumenMetodoPago");
            resumenActualizado.push({
                id_metodo_pago: metodo.id_metodo_pago,
                metodo_pago: metodo.metodo_pago,
                total_monto: totalesIniciales.get(metodo.id_metodo_pago) || metodo.total_monto,
            });
        }
    });

    console.log("Resumen actualizado final:", resumenActualizado, totalesIniciales);

    const fondoFijo = 500

    const sumaTotalVentas = resumenActualizado?.reduce(
        (total, item) => (item.metodo_pago === TIPO_METODO_PAGO.EFECTIVO ? total + item.total_monto : total),
        0
    );

    const saldoInicial = Number(watch("saldo_inicial_recarga")) || 0
    const saldoEnviado = Number(watch("saldo_enviado")) || 0
    const recargasGuerrilla = Number(watch("recargas_guerrilla")) || 0
    const sumaRecargasEnviadas = pagosRecargaEnviada?.reduce(
        (total, pago) => total + pago.monto,
        0
    );
    const saldoFinal = saldoInicial + saldoEnviado - sumaRecargasEnviadas - recargasGuerrilla


    const diferencia = (Number(sumaImportes) - Number(sumaTotalVentas + fondoFijo))

    const localEmpleado = locales ? locales?.find((item) => item.id_local == user.local_id) : []

    return (
        <DashboardLayout>
            <CssBaseline />
            <CssBaseline />
            <BoxNav>
                <DashboardNavbar />
            </BoxNav>
            <form onKeyDown={handleKeyDown} onSubmit={handleSubmit(onSubmit)}>
                {loadingArqueo || loadingDenominaciones || loadingResumenMetodoPago || saveLoadingArqueo || loadingLocales || loadingMetodosPago ? (
                    <div className="py-3 flex justify-center">
                        <CircularProgress />
                    </div>
                ) : (
                    (arqueos?.length > 0 || disableArqueosPage) ? (
                        <div className="py-3 flex justify-center">
                            <Alert severity="info">Ya se ha registrado el arqueo del día.</Alert>
                        </div>
                    ) : (
                        <Fdata>
                            <Fondo>
                                <Paper>
                                    <TitDenom>
                                        <Typography variant="h6" sx={{
                                            justifyContent: 'start',
                                            alignItems: 'start',
                                            fontSize: 'small',
                                            color: '#ffffff'
                                        }}
                                        >
                                            Total En Caja
                                        </Typography>
                                    </TitDenom>
                                </Paper>
                                {sumaImportes <= 0 && (
                                    <Alert severity="error">Debe ingresar el efectivo en caja.</Alert>
                                )}
                                <Paper>
                                    <Data>
                                        <Typography sx={{ fontSize: 'small' }}>Denominacion</Typography>
                                    </Data>
                                    <Data>
                                        <Typography sx={{ fontSize: 'small' }}>Cantidad</Typography>
                                    </Data>
                                    <Data>
                                        <Typography sx={{ fontSize: 'small' }}>Importe</Typography>
                                    </Data>
                                </Paper>
                                {
                                    denominaciones &&
                                    denominaciones?.length > 0 &&
                                    denominaciones?.map((item, index) => {
                                        const idDenominacion = item.id_denominacion;
                                        const valorDenominacion = parseFloat(item.valor); // Asegúrate de convertir el valor a número
                                        const seleccion = denominacionesSeleccionadas.find(
                                            (d) => d.denominacion === idDenominacion
                                        );

                                        return (
                                            <Paper key={index}>
                                                <Data>
                                                    <Typography sx={{ fontSize: 'small' }}>{Number(item.valor).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}</Typography>
                                                </Data>
                                                <Data>
                                                    <input
                                                        name={`cantidad_${idDenominacion}`}
                                                        type="number"
                                                        min={0}
                                                        placeholder="Cantidad"
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            padding: '5px',
                                                            fontSize: 'small',
                                                            textAlign: 'center',
                                                            outline: 'none',
                                                        }}
                                                        onChange={(e) =>
                                                            handleCantidadChange(
                                                                idDenominacion,
                                                                valorDenominacion,
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                    />
                                                </Data>
                                                <Data>
                                                    <input
                                                        type="text"
                                                        placeholder="Importe"
                                                        value={
                                                            seleccion?.importe
                                                                ? seleccion.importe.toLocaleString('es-HN', {
                                                                    style: 'currency',
                                                                    currency: 'HNL',
                                                                })
                                                                : ''
                                                        }
                                                        readOnly
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            padding: '5px',
                                                            fontSize: 'small',
                                                            textAlign: 'center',
                                                            outline: 'none',
                                                            backgroundColor: '#f0f0f0',
                                                        }}
                                                    />
                                                </Data>
                                            </Paper>
                                        )
                                    })
                                }

                            </Fondo>
                            <Fondo>
                                <TitSaldo>
                                    <Typography variant="h6" sx={{
                                        justifyContent: 'start',
                                        alignItems: 'start',
                                        fontSize: 'small',
                                        color: '#ffffff'
                                    }}
                                    >
                                        Totales En Saldo
                                    </Typography>
                                </TitSaldo>
                                <Paper>
                                    <FondSaldo>
                                        <DataSaldo>
                                            <Typography variant="h6" sx={{ fontSize: 'small' }}>Saldo Inicial</Typography>
                                            <Controller
                                                name="saldo_inicial_recarga"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        type="number"
                                                        placeholder="Saldo inicial"
                                                        helperText={errors?.saldo_inicial_recarga?.message}
                                                        error={!!errors?.saldo_inicial_recarga}
                                                        variant='outlined'
                                                        inputProps={{
                                                            style: {
                                                                color: '#000000',
                                                                fontSize: 'small',
                                                                fontWeight: 'bold',
                                                                padding: '0',
                                                            }
                                                        }}
                                                        sx={{
                                                            width: '100%',
                                                            '& .MuiOutlinedInput-root': {
                                                                height: '100%',
                                                                '& input': {
                                                                    height: '100%',
                                                                    padding: '0 14px',
                                                                }
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />
                                        </DataSaldo>
                                        <DataSaldo>
                                            <Typography variant="h6" sx={{ fontSize: 'small' }}>Saldo Enviado</Typography>
                                            <Controller
                                                name="saldo_enviado"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        type="number"
                                                        placeholder="Saldo Enviado"
                                                        helperText={errors?.saldo_enviado?.message}
                                                        error={!!errors?.saldo_enviado}
                                                        variant='outlined'
                                                        inputProps={{
                                                            style: {
                                                                color: '#000000',
                                                                fontSize: 'small',
                                                                fontWeight: 'bold',
                                                                padding: '0',
                                                            }
                                                        }}
                                                        sx={{
                                                            width: '100%',
                                                            '& .MuiOutlinedInput-root': {
                                                                height: '100%',
                                                                '& input': {
                                                                    height: '100%',
                                                                    padding: '0 14px',
                                                                }
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />
                                        </DataSaldo>
                                    </FondSaldo>
                                </Paper>
                                {recargaSummary?.resumen?.length > 0 && (
                                    <Paper>
                                        <FondSaldo>
                                            {recargaSummary?.resumen?.map((metodo) => (
                                                <DataSaldo key={metodo.id_metodo_pago}>
                                                    <Typography variant="h6" sx={{ fontSize: "small" }}>
                                                        (KITS) Recarga Enviada {metodo.metodo_pago}
                                                    </Typography>
                                                    <TextField
                                                        type="text"
                                                        disabled={true}
                                                        style={{
                                                            width: "100%",
                                                            fontSize: "small",
                                                            textAlign: "center",
                                                        }}
                                                        value={Number(metodo.total_monto).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
                                                    />
                                                </DataSaldo>
                                            ))}
                                        </FondSaldo>
                                    </Paper>
                                )}

                                <Paper>
                                    <FondSaldo>
                                        {metodosPago?.map((metodo) => (
                                            <DataSaldo key={metodo.id_metodo_pago}>
                                                <Typography variant="h6" sx={{ fontSize: "small" }}>
                                                    Recarga Enviada {metodo.nombre}
                                                </Typography>
                                                <TextField
                                                    type="number"
                                                    placeholder={`Monto (${metodo.nombre})`}
                                                    style={{
                                                        width: "100%",
                                                        fontSize: "small",
                                                        textAlign: "center",
                                                    }}
                                                    onChange={(e) => {
                                                        const monto = parseFloat(e.target.value) || 0;
                                                        handleMontoChange(metodo.id_metodo_pago, monto, metodo.nombre);
                                                    }}
                                                />
                                            </DataSaldo>
                                        ))}
                                    </FondSaldo>
                                </Paper>
                                <Paper>
                                    <FondSaldo>
                                        {localEmpleado && localEmpleado.recarga_guerrilla && (
                                            <DataSaldo>
                                                <Typography variant="h6" sx={{ fontSize: 'small' }}>Recarga Guerilla</Typography>
                                                <Controller
                                                    name="recargas_guerrilla"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            type="number"
                                                            placeholder="Recarga Guerrilla"
                                                            helperText={errors?.recargas_guerrilla?.message}
                                                            error={!!errors?.recargas_guerrilla}
                                                            variant='outlined'
                                                            inputProps={{
                                                                style: {
                                                                    color: '#000000',
                                                                    fontSize: 'small',
                                                                    fontWeight: 'bold',
                                                                    padding: '0',
                                                                }
                                                            }}
                                                            sx={{
                                                                width: '100%',
                                                                '& .MuiOutlinedInput-root': {
                                                                    height: '100%',
                                                                    '& input': {
                                                                        height: '100%',
                                                                        padding: '0 14px',
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </DataSaldo>
                                        )}
                                        <DataSaldo>
                                            <Typography variant="h6" sx={{ fontSize: 'small' }}>Saldo Final</Typography>
                                            <TextField
                                                type="text"
                                                disabled={true}
                                                value={Number(saldoFinal).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
                                                placeholder="saldo final"
                                                style={{
                                                    width: '100%',
                                                    fontSize: 'small',
                                                    textAlign: 'center',
                                                }}
                                            />
                                        </DataSaldo>
                                    </FondSaldo>
                                </Paper>
                                <TitSaldoProd>
                                    <Typography variant="h6" sx={{
                                        justifyContent: 'start',
                                        alignItems: 'start',
                                        fontSize: 'small',
                                        color: '#ffffff'
                                    }}
                                    >
                                        Total En Producto
                                    </Typography>
                                </TitSaldoProd>
                                <Paper>
                                    <FondSaldo>
                                        <DataSaldo>
                                            <Typography variant="h6" sx={{ fontSize: 'small' }}>Total Efectivo Arqueado</Typography>
                                            <TextField
                                                type="text"
                                                value={Number(sumaImportes).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
                                                disabled
                                                style={{
                                                    width: '100%',
                                                    fontSize: 'small',
                                                    textAlign: 'center',
                                                }}
                                            />
                                        </DataSaldo>
                                        <DataSaldo>
                                            <Typography variant="h6" sx={{ fontSize: 'small' }}>Fondo Fijo</Typography>
                                            <TextField
                                                type="text"
                                                value={fondoFijo.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
                                                disabled
                                                style={{
                                                    width: '100%',
                                                    fontSize: 'small',
                                                    textAlign: 'center',
                                                }}
                                            />
                                        </DataSaldo>
                                    </FondSaldo>
                                </Paper>
                                <Paper>
                                    <FondSaldo>
                                        {
                                            (resumenActualizado &&
                                                resumenActualizado?.length > 0) ?
                                                resumenActualizado?.map((item, index) => {
                                                    return (
                                                        <DataSaldo key={index}>
                                                            <Typography variant="h6" sx={{ fontSize: 'small' }}>Total Ventas {item.metodo_pago}</Typography>
                                                            <TextField
                                                                type="text"
                                                                value={Number(item.total_monto).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
                                                                disabled
                                                                style={{
                                                                    width: '100%',
                                                                    fontSize: 'small',
                                                                    textAlign: 'center',
                                                                }}
                                                            />
                                                        </DataSaldo>
                                                    )
                                                }
                                                ) : (
                                                    <Alert severity="error">No se han registrado ventas con algún método de pago.</Alert>
                                                )}
                                    </FondSaldo>
                                </Paper>
                                <Paper>
                                    <FondSaldo>
                                        {(diferencia > 0 || diferencia < 0) && (
                                            <Alert severity="warning">
                                                La diferencia es {diferencia > 0 ? 'positiva' : 'negativa'}.
                                            </Alert>
                                        )}
                                        <DataSaldo>
                                            <Typography variant="h6" sx={{ fontSize: 'small' }}>Diferencia</Typography>
                                            <TextField
                                                type="text"
                                                value={diferencia.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
                                                disabled
                                                style={{
                                                    width: '100%',
                                                    fontSize: 'small',
                                                    textAlign: 'center',
                                                    border: 'solid 1px',
                                                    borderColor: diferencia > 0 || diferencia < 0 ? "#fd2020" : "#60fd20"
                                                }}
                                            />
                                        </DataSaldo>

                                    </FondSaldo>
                                </Paper>
                                <Paper>
                                    <FondSaldo>
                                        <DataSaldo>
                                            <Typography variant="h6" sx={{ fontSize: 'small' }}>Comentario</Typography>
                                            <Controller
                                                name="comentario"
                                                control={control}
                                                render={({ field }) => (
                                                    <textarea
                                                        {...field}
                                                        placeholder="Escribe tu comentario"
                                                        style={{
                                                            width: '100%',
                                                            maxWidth: '100%',
                                                            height: '5vh',
                                                            fontSize: 'small',
                                                            textAlign: 'left',
                                                            border: 'solid 1px #000000',
                                                            padding: '8px',
                                                            resize: 'vertical'
                                                        }}
                                                    />
                                                )}
                                            />
                                            {/* Mostrar error si el comentario supera los 50 caracteres */}
                                            {errors.comentario && (
                                                <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                                                    {errors.comentario.message}
                                                </p>
                                            )}
                                        </DataSaldo>
                                        <DataSaldo>
                                            <Button
                                                type="submit"
                                                disabled={
                                                    Number(sumaImportes) <= 0 ||
                                                    !(resumenActualizado &&
                                                        resumenActualizado?.length > 0)

                                                }
                                                sx={{
                                                    backgroundColor: '#000000',
                                                    width: '100%',
                                                    height: '50px',
                                                    color: '#ffffff',
                                                    '&:hover': {
                                                        backgroundColor: '#ff0000',
                                                        color: '#ffffff'
                                                    }
                                                }}>
                                                Guardar Arqueo
                                            </Button>
                                        </DataSaldo>
                                    </FondSaldo>
                                </Paper>
                            </Fondo>
                        </Fdata>
                    )

                )}
            </form>

        </DashboardLayout>
    )
};

export default Arqueo;