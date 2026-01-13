import React from "react";
import { useNavigate } from 'react-router-dom';
import { CssBaseline, Box, Button, Typography, useTheme, useMediaQuery } from "@mui/material";
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import imgFondSubmVentas from '../../../assets/images/FSmFacturacion.png';
import styled from "@emotion/styled";
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";
import { useSelector } from "react-redux";

// Importar iconos
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StoreIcon from '@mui/icons-material/Store';
import { PERMISOS } from "../../../services/constantes";

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
        { label: "Historial Ventas Contado", route: '/historial/Venta/Contado', logo: <StoreIcon sx={{ fontSize: isSmallScreen ? 20 : 30 }} />, description: 'Historial de ventas al contado', permissions: [PERMISOS.ACCEDER_HISTORIAL_VENTAS_DURSAN_GENERAL, PERMISOS.ACCEDER_HISTORIAL_VENTAS_DURSAN_ESPECIFICO] },
        { label: "Historial Ventas Credito", route: "/historial/Venta/Credito", logo: <AccountCircleIcon sx={{ fontSize: isSmallScreen ? 30 : 50 }} />, description: 'Historial de ventas al credito', permissions: [PERMISOS.ACCEDER_HISTORIAL_VENTAS_KREDIYA_ESPECIFICO, PERMISOS.ACCEDER_HISTORIAL_VENTAS_KREDIYA_GENERAL] },
        // { label: "Historial Ventas OI", route: "/historial/Venta/OI", logo: <AccountCircleIcon sx={{ fontSize: isSmallScreen ? 30 : 50 }} />, description: 'Historial de ventas OI', permissions: [PERMISOS.ACCEDER_HISTORIAL_VENTAS_KREDIYA_ESPECIFICO, PERMISOS.ACCEDER_HISTORIAL_VENTAS_KREDIYA_GENERAL] },
        { label: "Historial Pagos Cuotas", route: "/historial/Venta/Cuota", logo: <AccountCircleIcon sx={{ fontSize: isSmallScreen ? 30 : 50 }} />, description: 'Historial de coutas al credito', permissions: [PERMISOS.ACCEDER_HISTORIAL_CUOTAS_KREDIYA_ESPECIFICO, PERMISOS.ACCEDER_HISTORIAL_CUOTAS_KREDIYA_GENERAL] },

    ];

    const getStyles = (index) => {
        return {
            backgroundColor: index % 2 === 0 ? '#5d5765' : '#5d5765',
            color: '#ffffff',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: 0, // Esquinas cuadradas
            width: '80%',  // Ancho del botón
            height: 'auto',  // Altura automática para ajustar el contenido
            margin: '2% 0% 2% 0%',
            padding: 1,     // Añade un poco de relleno
            '&:hover': {
                backgroundColor: index % 2 === 0 ? '#998779f' : '#998779f',
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
                height: '77vh',
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
