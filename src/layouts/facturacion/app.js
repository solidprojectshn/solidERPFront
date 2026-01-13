import React from "react";
import { useNavigate } from 'react-router-dom';
import { CssBaseline, Box, Button, Typography, useTheme, useMediaQuery } from "@mui/material";
import DashboardNavbar from '../../examples/Navbars/DashboardNavbar';
import imgFondSubmVentas from '../../assets/images/fondoSubVentas.png';
import styled from "@emotion/styled";
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";

// Importar iconos
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StoreIcon from '@mui/icons-material/Store';

import { useSelector } from "react-redux";
import { PERMISOS } from "../../services/constantes";

const BoxMenu = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    height: '50vh',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
        width: '90%',
        justifyContent: 'end',
        alignItems: 'start',
    },
}));

const MenuVentas = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const {
        permissions: userPermissions
    } = useSelector((store) => store.auth);

    const buttons = [
        { label: "Ventas Contado", route: '/venta/contado', logo: <StoreIcon sx={{ fontSize: isSmallScreen ? 20 : 30 }} />, description: 'Ventas al contado.', permissions: [PERMISOS.ACCEDER_VENTA_DURSAN] },
        { label: "Ventas Credito", route: "/venta/credito", logo: <AccountCircleIcon sx={{ fontSize: isSmallScreen ? 30 : 50 }} />, description: 'Ventas al Credito.', permissions: [PERMISOS.ACCEDER_VENTA_KREDIYA] },
        // { label: "Ventas OI", route: "/venta/OI", logo: <AccountCircleIcon sx={{ fontSize: isSmallScreen ? 30 : 50 }} />, description: 'Ventas relacionadas con OI.', permissions: [PERMISOS.ACCEDER_VENTA_KREDIYA] },
        { label: "Cuotas Credito", route: "/venta/cuota/Krediya", logo: <AccountCircleIcon sx={{ fontSize: isSmallScreen ? 30 : 50 }} />, description: 'Procesa y gestiona las cuotas relacionadas con Creditos.', permissions: [PERMISOS.ACCEDER_PAGO_CUOTA_KREDIYA] },

    ];

    const getStyles = (index) => {
        return {
            backgroundColor: index % 2 === 0 ? '#6a8173' : '#6a8173',
            color: '#ffffff',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: 0,
            width: isSmallScreen ? '90%' : isMediumScreen ? '80%' : '70%',
            height: 'auto',
            margin: '2%',
            padding: isSmallScreen ? 0.5 : 1,
            '&:hover': {
                backgroundColor: index % 2 === 0 ? '#033b32' : '#bea38e',
            },
            justifyContent: 'start',
            fontSize: { xs: 'small', sm: 'medium', md: 'large' },
            [theme.breakpoints.down('sm')]: {
                width: '70%',
            },
        };
    };

    return (
        <DashboardLayout>
            <CssBaseline />
            <DashboardNavbar absolute={false} light={false} isMini={false} />
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                background: `url(${imgFondSubmVentas})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '100%',
                height: '86vh',
                justifyContent: 'center'
            }}>
                <BoxMenu>
                    <Typography variant="h6" sx={{ color: '#000000', fontSize: isSmallScreen ? 'small' : isMediumScreen ? 'medium' : 'large' }}>

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
                                        <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: isSmallScreen ? '0.8rem' : '1rem' }}>
                                            {button.label}
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontSize: isSmallScreen ? '0.6rem' : '0.75rem' }}>
                                            {button.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Button>
                        ))}
                </BoxMenu>
            </Box>
        </DashboardLayout>
    );
};

export default MenuVentas;
