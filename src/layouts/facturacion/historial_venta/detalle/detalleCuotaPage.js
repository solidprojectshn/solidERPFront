import { React, useMemo, useState, useEffect } from "react";
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { zodResolver } from "@hookform/resolvers/zod"// ESTO
import { z } from 'zod';// ESTO
import Select from 'react-select'
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

import { useForm, Controller, useFieldArray, set } from 'react-hook-form';// ESTO
import { useSelector, useDispatch } from "react-redux";// ESTO
import styled from "@emotion/styled";
import { CssBaseline, Box, Button, Grid, Typography, TextField, RadioGroup, FormControlLabel, Radio, IconButton, Checkbox, CircularProgress, Alert } from "@mui/material";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from 'material-react-table/locales/es';

import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";

//estilos nav
const BoxNav = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '20vh',
    padding: '1.5%'
}));

const Fondo = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 'auto',
    padding: '2% 0% 2% 0%',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
    },
}));

const CarsData = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    background: '#ffffff',
    border: '1px solid #ffffff',
    borderRadius: '10px',
    width: '50%',
    height: 'auto',
    margin: '1%',
    boxShadow: theme.shadows[3],
    [theme.breakpoints.down('lg')]: {
        width: '95%',
        height: '10vh',
    },
    [theme.breakpoints.down('md')]: {
        width: '95%',
        height: 'auto',
    },
    [theme.breakpoints.down('sm')]: {
        width: '95%',
        height: 'auto',
    },
}));

//estilos - detalle factura
const BoxDellFactura = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    width: '100%',
    height: 'auto', // Ajuste para que no se quede fijo en 42vh
    margin: '1% 0% 1% 0%',
    backgroundColor: '#ffffff',
    boxShadow: theme.shadows[3],
    [theme.breakpoints.down('sm')]: { // Ajustes para pantallas pequeñas
        flexDirection: 'column', // Cambiar a columna en pantallas pequeñas
        padding: '2%',
    },
}));

const BoxDetalle = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '50%',
    height: 'auto', // Ajuste automático de la altura
    margin: '0.5%',
    backgroundColor: '#ffffff',
    border: '1px solid #cdcdcd',
    [theme.breakpoints.down('sm')]: {
        width: '98%', // Ocupa el 100% en pantallas pequeñas
        margin: '1%',
    },
}));

const CardBtn = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    flexGrow:1,
    width: '30%',
    height: '', // Ajuste automático de la altura
    margin: '0.5%',
    backgroundColor: '#ffffff',
    [theme.breakpoints.down('sm')]: {
        width: '100%', // Ocupa el 100% en pantallas pequeñas
        margin: '1%',
    },
}));

const CarsDataPago = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    background: '#ffffff',
    border: '1px solid #ffffff',
    width: '98%', // Ajuste al 100% para que no se desborde
    height: '90%',
    margin: '1%',
    [theme.breakpoints.down('sm')]: {
        width: '100%', // En pantallas pequeñas, ocupará todo el ancho
    },
}));

const BoxCantPago = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '98%',
    height: '50%',
    margin: '0.5%',
    backgroundColor: '#ffffff',
    //boxShadow: theme.shadows[3],
    border:'1px solid #cdcdcd',
    [theme.breakpoints.down('sm')]: {
        padding: '2%',
        margin: '1%',
        flexDirection: 'column', // Ajuste para pantallas pequeñas, usando columna
    },
}));

const BoxMetodoP = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '98%',
    height: '48%',
    margin: '0.5%',
    backgroundColor: '#ffffff',
    //boxShadow: theme.shadows[3],
    border:'1px solid #cdcdcd',
    [theme.breakpoints.down('sm')]: {
        padding: '2%',
        margin: '1%',
    },
}));


const BoxDetalletot = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: 'auto', // Ajuste automático de la altura
    margin: '0.5%',
    backgroundColor: '#ffffff',
    border: '1px solid #cdcdcd',
    [theme.breakpoints.down('sm')]: {
        width: '98%', // Ocupa el 100% en pantallas pequeñas
        margin: '1%',
    },
}));

const BoxTotales = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '98%',
    height: 'auto', // mirar
    //boxShadow: theme.shadows[3],
    backgroundColor: '#ffffff',
}));

const CarsDetalleT = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    border: '1px solid #ffffff',
    width: '98%',
    height: 'auto', // Ajusta la altura automáticamente
    margin: '1%',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column', // Ajusta a columna en pantallas pequeñas
        margin: '1%',
    },
}));

const BtnGenerar = styled(Button)(({ theme }) => ({
    width: '98%',
    margin: '1%',
    height: '100%',
    display: "flex",
    flexGrow: 1,
    backgroundColor: '#d31717',
    color: '#ffffff',
    boxShadow: theme.shadows[3],
    borderRadius: '5px',
    '&:hover': {
        backgroundColor: '#333333',
        color: '#ffffff',
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%', // En pantallas pequeñas, ocupa todo el ancho
        margin: '2% 0',
    },
}));


import {
    getVentaById
} from "../../../../redux/facturacion/ventas/actions"
import { useParams } from "react-router-dom";


const CuotasKrediya = () => {
    const { idVenta } = useParams()
    const dispatch = useDispatch()

    const {
        venta,
        ventaByIdError,
        loadingById
    } = useSelector((store) => store.ventas);

    const username = JSON.parse(localStorage.getItem('user-info'))?.username

    useEffect(() => {
        dispatch(getVentaById(idVenta));
    }, [idVenta]);



    return (
       
            <DashboardLayout>
                <CssBaseline />
                <BoxNav>
                    <DashboardNavbar />
                </BoxNav>

                {loadingById ? (
                    <div className="py-3 flex justify-center">
                        <CircularProgress />
                    </div>
                ) : (
                    <div >
                        <Grid container className="p-4 text-white" sx={{ backgroundColor: "#526878" }}>
                            {ventaByIdError && (
                                <Alert severity="error">{ventaByIdError}</Alert>
                            )}
                        </Grid>
                        <Fondo>
                            <CarsData>
                                <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }} >
                                    Local
                                </Typography>
                                <TextField
                                    disabled
                                    variant='outlined'
                                    value={venta?.local?.nombre || ""}
                                    inputProps={{
                                        style: {
                                            color: '#000000',
                                            fontSize: 'small',
                                            fontWeight: 'bold',
                                            padding: '0',
                                        }
                                    }}
                                    sx={{
                                        width: '95%',
                                        margin: '0% 2% 2% 2%',
                                        height: '6.6vh',
                                        '& .MuiOutlinedInput-root': {
                                            height: '100%',
                                            '& input': {
                                                height: '100%',
                                                padding: '0 14px',
                                            }
                                        }
                                    }}
                                />
                            </CarsData>
                            <CarsData>
                                <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }}>
                                    Cliente
                                </Typography>
                                <TextField
                                    disabled
                                    variant='outlined'
                                    value={venta?.cliente?.nombre_completo || ""}

                                    inputProps={{
                                        style: {
                                            color: '#000000',
                                            fontSize: 'small',
                                            fontWeight: 'bold',
                                            padding: '0',
                                        }
                                    }}
                                    sx={{
                                        width: '95%',
                                        margin: '0% 2% 2% 2%',
                                        height: '6.6vh',
                                        '& .MuiOutlinedInput-root': {
                                            height: '100%',
                                            '& input': {
                                                height: '100%',
                                                padding: '0 14px',
                                            }
                                        }
                                    }}
                                />
                            </CarsData>
                        </Fondo>
                        <BoxDellFactura>
                            <BoxDetalle>
                                <BoxMetodoP>
                                    <CarsDataPago>
                                        <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }}>
                                            Colaborador
                                        </Typography>
                                        <TextField
                                            variant='outlined'
                                            disabled={true}
                                            value={venta?.empleado?.nombre_completo || ""}
                                            inputProps={{
                                                style: {
                                                    color: '#000000',
                                                    fontSize: 'small',
                                                    fontWeight: 'bold',
                                                    padding: '0',
                                                    whiteSpace: "normal", // Permite el ajuste de líneas
                                                    overflow: "visible", // Evita cortar texto
                                                    textOverflow: "ellipsis", // Agrega "..." si el texto es demasiado largo (opcional)
                                                }
                                            }}
                                            sx={{
                                                width: '95%',
                                                margin: '0% 2% 2% 2%',
                                                height: '6.6vh',
                                                '& .MuiOutlinedInput-root': {
                                                    height: '100%',
                                                    '& input': {
                                                        height: '100%',
                                                        padding: '0 14px',
                                                    }
                                                }
                                            }}
                                        />
                                    </CarsDataPago>

                                </BoxMetodoP>
                                <BoxCantPago>
                                    {(venta?.metodos_pagos && venta?.metodos_pagos.length > 0 ? venta.metodos_pagos : []).map(
                                        (item, index) => {
                                            return (
                                                <CarsDataPago key={index}>
                                                    <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }}>
                                                        {item.metodo_pago.nombre}
                                                    </Typography>
                                                    <TextField
                                                        variant='outlined'
                                                        disabled={true}
                                                        value={Number(item.monto).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
                                                        inputProps={{
                                                            style: {
                                                                color: '#000000',
                                                                fontSize: 'small',
                                                                fontWeight: 'bold',
                                                                padding: '0',
                                                            }
                                                        }}
                                                        sx={{
                                                            width: '95%',
                                                            margin: '0% 2% 2% 2%',
                                                            height: '6.6vh',
                                                            '& .MuiOutlinedInput-root': {
                                                                height: '100%',
                                                                '& input': {
                                                                    height: '100%',
                                                                    padding: '0 14px',
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </CarsDataPago>
                                            )
                                        }
                                    )}
                                </BoxCantPago>
                            </BoxDetalle>
                            <BoxDetalletot>
                                <BoxTotales>
                                    <CarsDetalleT>
                                        <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }}>
                                            Total
                                        </Typography>
                                        <TextField
                                            variant='outlined'
                                            value={(Number(venta?.total)).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }) || "-"}
                                            inputProps={{
                                                style: {
                                                    color: '#000000',
                                                    fontSize: 'small',
                                                    fontWeight: 'bold',
                                                    padding: '0',
                                                }
                                            }}
                                            sx={{
                                                width: '95%',
                                                margin: '0% 2% 2% 2%',
                                                height: '6.6vh',
                                                '& .MuiOutlinedInput-root': {
                                                    height: '100%',
                                                    '& input': {
                                                        height: '100%',
                                                        padding: '0 14px',
                                                    }
                                                }
                                            }}
                                        />
                                    </CarsDetalleT>
                                    <CarsDetalleT>
                                        <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small', margin: '2%' }}>
                                            Número de Crédito
                                        </Typography>
                                        <TextField
                                            variant='outlined'
                                            value={venta?.num_credito}
                                            inputProps={{
                                                style: {
                                                    color: '#000000',
                                                    fontSize: 'small',
                                                    fontWeight: 'bold',
                                                    padding: '0',
                                                }
                                            }}
                                            sx={{
                                                width: '95%',
                                                margin: '0% 2% 2% 2%',
                                                height: '6.6vh',
                                                '& .MuiOutlinedInput-root': {
                                                    height: '100%',
                                                    '& input': {
                                                        height: '100%',
                                                        padding: '0 14px',
                                                    }
                                                }
                                            }}
                                        />
                                    </CarsDetalleT>
                                </BoxTotales>
                            </BoxDetalletot>
                            <CardBtn>
                                <BtnGenerar  disabled={loadingById}>Imprimir Copia</BtnGenerar>
                            </CardBtn>
                        </BoxDellFactura>

                    </div>

                )
                }
            </DashboardLayout>

    )
}

export default CuotasKrediya;