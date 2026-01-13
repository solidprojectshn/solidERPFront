import { React, useEffect, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import styled from "@emotion/styled";
import { CssBaseline, Box, IconButton, Button, Typography, useTheme, useMediaQuery } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";
import { useSelector } from "react-redux";
import { PERMISOS } from "../../../services/constantes";

//imagene fondo
import imgFondSubmVentas from '../../../assets/images/fondoSubVentas.png';

//tabla
import { Suspense } from 'react';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';

//pdf
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

//icons
import PrintIcon from '@mui/icons-material/Print';

//estilos nav
const BoxNav = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '20vh',
    padding: '1.5%'
}));

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

const Reporteria = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const {
        permissions: userPermissions
    } = useSelector((store) => store.auth);

    const buttons = [
        { label: "Impresión Facturas - Dursan", route: '/impresionfacturas/dursan', logo: <PrintIcon sx={{ fontSize: isSmallScreen ? 20 : 30 }} />, description: 'Impresion Facturas Dursan', permissions: [PERMISOS.ACCEDER_VENTA_DURSAN]},
        { label: "Impresión Facturas - Krediya", route: '/impresionfacturas/krediya', logo: <PrintIcon sx={{ fontSize: isSmallScreen ? 20 : 30 }} />, description: 'Impresion Facturas Krediya', permissions: [PERMISOS.ACCEDER_VENTA_DURSAN]}
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
            <BoxNav>
                <DashboardNavbar />
            </BoxNav>
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
    )
}

export default Reporteria;