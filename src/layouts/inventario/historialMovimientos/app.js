import React from "react";
import { useNavigate } from 'react-router-dom';
import { CssBaseline, Box, Button, Grid, Typography } from "@mui/material";
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import imgFondSubmVentas from '../../../assets/images/fSmHistMov.png';
import styled from "@emotion/styled";
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";
import { useSelector } from "react-redux";

//import iconos
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StoreIcon from '@mui/icons-material/Store';
import { PERMISOS } from "../../../services/constantes";

const BoxMenu = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
    height: '50vh',
    justifyContent: 'center',
    alignItems: 'end',
    margin: '1% 1.5% 1.5% 1.5%',
    [theme.breakpoints.down('md')]: {
        width: '90%',
    },
    [theme.breakpoints.down('sm')]: {
        width: '90%',
        flexDirection: 'column',
        justifyContent: 'end',
        alignItems: 'start',
    },
}));


const SubMHistM = () => {

    const navigate = useNavigate();

    const {
        permissions: userPermissions
    } = useSelector((store) => store.auth);

    const buttons = [
        { label: "H. Productos", route: '/historial/productos', logo: <StoreIcon sx={{ fontSize: 30 }} />, description: 'Historial asignaciones productos.', permissions: [PERMISOS.ACCEDER_HISTORIAL_GENERAL, PERMISOS.ACCEDER_HISTORIAL_ESPECIFICO] },
        { label: "H. Sims", route: "/historial/sims", logo: <AccountCircleIcon sx={{ fontSize: 50 }} />, description: 'Historial de asignaciones de sims', permissions: [PERMISOS.ACCEDER_HISTORIAL_SIMS_ESPECIFICO, PERMISOS.ACCEDER_HISTORIAL_SIMS_GENERAL_SUPERVISOR] },
    ];

    const getStyles = (index) => {
        return {
            backgroundColor: index % 2 === 0 ? '#6a8173' : '#6a8173',
            color: '#ffffff',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: 0, // Esquinas cuadradas
            width: '70%',  // Ancho del botón
            height: 'auto',  // Altura automática para ajustar el contenido
            margin: '2%',
            padding: 1,     // Añade un poco de relleno
            '&:hover': {
                backgroundColor: index % 2 === 0 ? '#033b32' : '#bea38e',
            },
            justifyContent: 'start',
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

export default SubMHistM;