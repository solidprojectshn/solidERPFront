import React from "react";
import { useNavigate } from 'react-router-dom';
import { CssBaseline, Box, Button, Grid, Typography, useTheme } from "@mui/material";
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import imgFondSubmExist from '../../../assets/images/FSmExistencias.png';
import styled from "@emotion/styled";
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";
import { useSelector } from "react-redux";

//import iconos
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { PERMISOS } from "../../../services/constantes";

const BoxMenu = styled(Box)(({theme}) =>({
    display:'flex',
    flexDirection:'column',
    width:'50%',
    height:'50vh',
    justifyContent:'center',
    alignItems:'center',
    [theme.breakpoints.down('md')]: {
        width: '90%',
    },
    [theme.breakpoints.down('sm')]: {
        width: '95%',
    },
}));


const MenuVentas = () =>{

    const navigate = useNavigate();
    const theme = useTheme();

    const {
        permissions : userPermissions
    } = useSelector((store) => store.auth);

    const buttons = [
        { label: "Inventario / General", route: '/inventario/general', logo: <WarehouseIcon sx={{ fontSize: 30 }} />, description: 'Control de existencias en general.', permissions: [PERMISOS.ACCEDER_INVENTARIO_GENERAL] },
        { label: "Inventario / Buscador", route: '/inventario/buscador', logo: <WarehouseIcon sx={{ fontSize: 30 }} />, description: 'Buscador de series.', permissions: [PERMISOS.ACCEDER_INVENTARIO_GENERAL] },
        { label: "Inventario / Bodega Principal", route: "/inventario/bodega-principal", logo: <WarehouseIcon sx={{ fontSize: 50 }} />, description: 'Control de existencias en bodega principal.', permissions: [PERMISOS.ACCEDER_INVENTARIO_BODEGA] },
        { label: "Inventario / Locales", route: "/inventario/locales", logo: <WarehouseIcon sx={{ fontSize: 50 }} />, description: 'Control de existencias por locales.' , permissions: [PERMISOS.ACCEDER_INVENTARIO_POR_TIENDA_ESPECIFICO, PERMISOS.ACCEDER_INVENTARIO_POR_TIENDA_GENERAL]},
        { label: "Inventario / Puntos Estacionarios", route: "/inventario/puntos-estacionarios", logo: <WarehouseIcon sx={{ fontSize: 50 }} />, description: 'Control de existencias por puntos estacionarios.' , permissions: [PERMISOS.ACCEDER_INVENTARIO_PUNTOS_ESTACIONARIOS]},
        { label: "Inventario / Supervisores", route: "/inventario/supervisores", logo: <WarehouseIcon sx={{ fontSize: 50 }} />, description: 'Control de existencias por supervisores (SIMS).' , permissions: [PERMISOS.ACCEDER_INVENTARIO_SUPERVISORES_ESPECIFICO, PERMISOS.ACCEDER_INVENTARIO_SUPERVISORES_GENERAL]},
    ];

    const getStyles = (index) => {
        return {
          backgroundColor: index % 2 === 0 ? '#847790' : '#847790',
          color: '#ffffff',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: 0, // Esquinas cuadradas
          width: '70%',  // Ancho del botón
          height: 'auto',  // Altura automática para ajustar el contenido
          margin:'1% 0% 1% 0%',
          padding: 1,     // Añade un poco de relleno
          '&:hover': {
            backgroundColor: index % 2 === 0 ? '#5f1ba1' : '#511299',
          },
          justifyContent:'start',
          [theme.breakpoints.down('sm')]: {
            width: '95%',
            },
        };
    };

    return(
        <DashboardLayout>
            <CssBaseline />
            <DashboardNavbar absolute={false} light={false} isMini={false} />
            <Box sx={{
                    display:'flex',
                    flexDirection:'column',
                    background: `url(${imgFondSubmExist})`,
                    backgroundSize:'cover',
                    backgroundPosition:'center',
                    backgroundRepeat:'no-repeat',
                    width:'100%',
                    height:'86vh',
                    justifyContent:'center'
                }}
            >
                <BoxMenu sx={{height:"auto"}}>
                    {buttons.map((button, index) => 
                      button.permissions && button.permissions?.some(element => userPermissions.includes(element)) && (
                        <Button
                            key={index}
                            variant="contained"
                            onClick={() => navigate(button.route)}
                            sx={{ ...getStyles(index), height:"auto"}}
                            >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ mr: 1 }}>
                                {button.logo}
                                </Box>
                                <Box sx={{ textAlign: 'left' }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    {button.label}
                                </Typography>
                                <Typography variant="caption">
                                    {button.description}
                                </Typography>
                                </Box>
                            </Box>
                        </Button>
                    ))}

                </BoxMenu>
            </Box>
        </DashboardLayout>
    )
}

export default MenuVentas;