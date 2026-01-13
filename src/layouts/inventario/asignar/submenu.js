import React from "react";
import { useNavigate } from 'react-router-dom';
import { CssBaseline, Box, Button, Grid, Typography, useTheme } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import imgFondSubmExist from '../../../assets/images/FSubmAsignar.png';
import styled from "@emotion/styled";

//import iconos
import WarehouseIcon from '@mui/icons-material/Warehouse';
import PersonIcon from '@mui/icons-material/Person';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import { PERMISOS } from "../../../services/constantes";
import { useSelector } from "react-redux";

const BoxMenu = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    height: '50vh',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
        width: '90%',
    },
    [theme.breakpoints.down('sm')]: {
        width: '95%',
    },
}));


const MenuVentas = () => {

    const navigate = useNavigate();
    const theme = useTheme();

    const {
        permissions : userPermissions
    } = useSelector((store) => store.auth);

    const buttons = [
        { label: "Asignación Tiendas/Estacionarios", route: '/asignar/locales', logo: <WarehouseIcon sx={{ fontSize: 'large' }} />, description: 'Asigne stock a tiendas y puntos estacionarios', permissions: [PERMISOS.ACCEDER_ASIGNAR_ENTRE_TIENDAS] },
        { label: "Asignación a Supervisores ", route: "/asignar/supervisores", logo: <PersonIcon sx={{ fontSize: 'large' }} />, description: 'Asigne stock a supervisores.', permissions: [PERMISOS.ACCEDER_ASIGNAR_A_SUPERVISORES] },
    ];

    const getStyles = (index) => {
        return {
            backgroundColor: index % 2 === 0 ? '#6a8173' : '#6a8173',
            color: '#ffffff',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: 0, // Esquinas cuadradas
            width: '80%',  // Ancho del botón
            height: 'auto',  // Altura automática para ajustar el contenido
            margin: '2% 0% 2% 0%',
            padding: 1,     // Añade un poco de relleno
            '&:hover': {
                backgroundColor: index % 2 === 0 ? '#033b32' : '#bea38e',
            },
            justifyContent: 'start',
            fontSize: { xs: 'small', sm: 'medium', md: 'large' },
            [theme.breakpoints.down('sm')]: {
                width: '95%',
            },
        };
    };

    return (
        <DashboardLayout>
            <CssBaseline />
            <DashboardNavbar />
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                background: `url(${imgFondSubmExist})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '100%',
                height: '86vh',
                justifyContent: 'center'
            }}
            >
                <BoxMenu>
                    <Typography variant="h6" sx={{ color: '#000000', fontSize: 'medium' }}>

                    </Typography>
                    {buttons.map((button, index) =>
                        button.permissions && button.permissions?.some(element => userPermissions.includes(element)) && (
                            <Button
                                key={index}
                                variant="contained"
                                onClick={() => navigate(button.route)}
                                sx={{ ...getStyles(index) }}
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