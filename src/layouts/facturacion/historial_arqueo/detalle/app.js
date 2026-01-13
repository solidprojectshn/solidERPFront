import { React, useEffect, useMemo, useState } from "react";
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import styled from "@emotion/styled";
import { CssBaseline, Box, Typography, TextField, Button, CircularProgress, Alert } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";
import { zodResolver } from "@hookform/resolvers/zod"// ESTO
import { z } from 'zod';// ESTO
import { useParams } from "react-router-dom";
import { useForm, Controller, useFieldArray, set } from 'react-hook-form';// ESTO
import { useSelector, useDispatch } from "react-redux";// ESTO
//icons
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import {

    getArqueoById
} from "../../../../redux/facturacion/arqueo/actions"

import moment from "moment";

//estilos nav
const BoxNav = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '20vh',
    padding: '1.5%'
}));

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
        width:'98',
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
        width:'98',
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
        width:'98',
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
        width:'98%'
    }
}));

const Arqueo = () => {
    const dispatch = useDispatch()
    const { idArqueo } = useParams()
    const [totales, setTotales] = useState([])

    //definicion de las variables del reducer
    const {
        arqueo,
        arqueoError,
        arqueoByIdError,
        loadingById

    } = useSelector((store) => store.arqueos);

    function calcularTotales() {
        // Validar que las propiedades existan y sean arreglos
        const recargaMetodosPagos = Array.isArray(arqueo.recarga_metodos_pagos)
            ? arqueo.recarga_metodos_pagos
            : [];
        const metodosPagos = Array.isArray(arqueo.metodos_pagos)
            ? arqueo.metodos_pagos
            : [];

        // Combinar los datos
        const todosLosMetodos = [...recargaMetodosPagos, ...metodosPagos];

        const totales = {};

        // Iterar sobre todos los métodos de pago
        todosLosMetodos.forEach((item) => {
            const metodo = item.metodo_pago.nombre;
            const monto = parseFloat(item.monto);

            // Sumar el monto al total correspondiente
            if (!totales[metodo]) {
                totales[metodo] = { metodo_pago: metodo, total: 0 };
            }
            totales[metodo].total += monto;
        });

        // Convertir el objeto de totales en un arreglo de objetos
        return Object.values(totales);
    }


    useEffect(() => {

        dispatch(getArqueoById(idArqueo))


    }, [])

    

    const totalesVentas = arqueo ? calcularTotales() : [];


    return (
        <DashboardLayout>
            <CssBaseline />
            <BoxNav>
                <DashboardNavbar />
            </BoxNav>
            <div>
                {loadingById ? (
                    <div className="py-3 flex justify-center">
                        <CircularProgress />
                    </div>
                ) : (
                    <Fdata>
                        <Fondo>
                            <Paper>
                                {console.log(totales)}
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
                                arqueo &&
                                arqueo?.detalle?.length > 0 &&
                                arqueo?.detalle?.map((item, index) => {
                                    return (
                                        <Paper key={index}>
                                            <Data>
                                                <Typography sx={{ fontSize: 'small' }}>{Number(item?.denominacion.valor)?.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}</Typography>
                                            </Data>
                                            <Data>
                                                <input
                                                    name={`cantidad`}
                                                    type="text"
                                                    disabled={true}
                                                    value={item?.cantidad}
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
                                                        (Number(item?.denominacion.valor) * Number(item?.cantidad))?.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })
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
                                        <TextField
                                            type="text"
                                            value={Number(arqueo?.saldo_inicial_recarga)?.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
                                            disabled={true}
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
                                    </DataSaldo>
                                    <DataSaldo>
                                        <Typography variant="h6" sx={{ fontSize: 'small' }}>Saldo Enviado</Typography>

                                        <TextField
                                            type="text"
                                            value={Number(arqueo?.saldo_enviado)?.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
                                            disabled={true}
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
                                    </DataSaldo>
                                </FondSaldo>
                            </Paper>
                            <Paper>
                                <FondSaldo>
                                    {arqueo &&
                                        arqueo?.recarga_metodos_pagos?.length > 0 &&
                                        arqueo?.recarga_metodos_pagos?.map((metodo) => (
                                        <DataSaldo key={metodo.id_metodo_pago}>
                                            <Typography variant="h6" sx={{ fontSize: "small" }}>
                                                Recarga Enviada {metodo?.metodo_pago.nombre}
                                            </Typography>
                                            <TextField
                                                type="text"
                                                value={Number(metodo?.monto)?.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
                                                variant='outlined'
                                                disabled
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
                                        </DataSaldo>
                                    ))}
                                </FondSaldo>
                            </Paper>
                            <Paper>
                                <FondSaldo>
                                    {arqueo && arqueo?.recargas_guerrilla && (
                                        <DataSaldo>
                                            <Typography variant="h6" sx={{ fontSize: 'small' }}>Recarga Guerilla</Typography>
                                            <TextField
                                                value={arqueo?.recargas_guerrilla?.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
                                                type="text"
                                                disabled
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
                                        </DataSaldo>
                                    )}
                                    <DataSaldo>
                                        <Typography variant="h6" sx={{ fontSize: 'small' }}>Saldo Final</Typography>
                                        <TextField
                                            type="text"
                                            disabled={true}
                                            value={Number(arqueo?.saldo_final)?.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
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
                                            value={Number(arqueo?.total_efectivo_arqueado)?.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
                                            disabled
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
                                    </DataSaldo>
                                    <DataSaldo>
                                        <Typography variant="h6" sx={{ fontSize: 'small' }}>Fondo Fijo</Typography>
                                        <TextField
                                            type="text"
                                            value={arqueo?.fondo_fijo?.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
                                            disabled
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
                                    </DataSaldo>
                                </FondSaldo>
                            </Paper>
                            <Paper>
                                <FondSaldo>
                                    {
                                        (totalesVentas &&
                                            totalesVentas?.length > 0) ?
                                            totalesVentas?.map((item, index) => {
                                                return (
                                                    <DataSaldo key={index}>
                                                        <Typography variant="h6" sx={{ fontSize: 'small' }}>Total Ventas {item?.metodo_pago}</Typography>
                                                        <TextField
                                                            type="text"
                                                            value={Number(item?.total)?.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
                                                            disabled
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
                                    {(arqueo?.diferencia > 0 || arqueo?.diferencia < 0) && (
                                        <Alert severity="warning">
                                            La diferencia es {arqueo?.diferencia > 0 ? 'positiva' : 'negativa'}.
                                        </Alert>
                                    )}
                                    <DataSaldo>
                                        <Typography variant="h6" sx={{ fontSize: 'small' }}>Diferencia</Typography>
                                        <input
                                            type="text"
                                            value={Number(arqueo?.diferencia)?.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
                                            disabled
                                            style={{
                                                width: '100%',
                                                maxWidth: '100%',
                                                height: '5vh',
                                                fontSize: 'small',
                                                textAlign: 'center',
                                                border: 'solid 1px',
                                                borderColor: arqueo?.diferencia > 0 || arqueo?.diferencia < 0 ? "#fd2020" : "#60fd20"
                                            }}
                                        />
                                    </DataSaldo>
                                    <DataSaldo>
                                        <Typography variant="h6" sx={{ fontSize: 'small' }}>Comentario</Typography>

                                        <textarea
                                            value={arqueo?.comentario || ''}
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
                                            disabled={true}
                                        />
                                    </DataSaldo>
                                </FondSaldo>
                            </Paper>
                            {/* <Paper>
                                <FondSaldo>
                                    <DataSaldo>
                                        <Typography variant="h6" sx={{ fontSize: 'small' }}>Comentario</Typography>

                                        <textarea
                                            value={arqueo?.comentario || ''}
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

                                    </DataSaldo>
                                </FondSaldo>
                            </Paper> */}
                        </Fondo>
                    </Fdata>
                )}
            </div>

        </DashboardLayout>
    )
};

export default Arqueo;