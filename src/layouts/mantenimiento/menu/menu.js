import React from 'react';
import styled from "@emotion/styled";
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Typography, Box, CssBaseline, useTheme } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayoutFb';

//iconos material ui
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import BuildIcon from '@mui/icons-material/Build';
import LockIcon from '@mui/icons-material/Lock';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { PERMISOS } from '../../../services/constantes';
import { useSelector } from 'react-redux';

//estilos nav
const BoxNav = styled(Box)(({theme}) => ({
  display:'flex',
  flexDirection:'row',
  // backgroundColor:'#43b399', 
  width:'100%',
  height:'20vh',
  padding:'1.5%',
  margin:'0% 0% 2% 0%',
}));

const MantenimientoMenu = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    permissions: userPermissions
  } = useSelector((store) => store.auth);

  const buttons = [
    { label: "Tipo Producto", route: '/mantenimiento/tipoproducto', logo: <StoreIcon sx={{ fontSize: 30 }} />, description: 'Gestiona los tipos de productos', permissions: [PERMISOS.ACCEDER_MTN_TIPO_PRODUCTO] },
    { label: "Tipo Local", route: "/mantenimiento/tipolocal", logo: <BusinessIcon sx={{ fontSize: 30 }} />, description: 'Gestiona los tipos de locales', permissions: [PERMISOS.ACCEDER_MTN_TIPO_LOCAL] },
    { label: "Tipo Venta", route: "/mantenimiento/tipoVenta", logo: <BusinessIcon sx={{ fontSize: 30 }} />, description: 'Gestiona los tipos de Ventas', permissions: [PERMISOS.ACCEDER_MTN_TIPO_LOCAL] },
    { label: "Clientes", route: "/mantenimiento/clientes", logo: <PeopleIcon sx={{ fontSize: 30 }} />, description: 'Administra los clientes', permissions: [PERMISOS.ACCEDER_MTN_CLIENTES]},
    { label: "Método de pago", route: "/mantenimiento/metodopago", logo: <PaymentIcon sx={{ fontSize: 30 }} />, description: 'Gestiona métodos de pago', permissions: [PERMISOS.ACCEDER_MTN_METODOS_PAGOS] },
    { label: "Rol", route: "/mantenimiento/roles", logo: <BuildIcon sx={{ fontSize: 30 }} />, description: 'Configura los roles', permissions: [PERMISOS.ACCEDER_MTN_ROL] },
    { label: "Empresa", route: "/mantenimiento/empresa", logo: <BusinessIcon sx={{ fontSize: 30 }} />, description: 'Gestiona datos de la empresa', permissions: [PERMISOS.ACCEDER_MTN_EMPRESA] },
    { label: "Denominación", route: "/mantenimiento/denominaciones", logo: <AttachMoneyIcon sx={{ fontSize: 30 }} />, description: 'Administra denominaciones', permissions: [PERMISOS.ACCEDER_MTN_DENOMINACION] },
    { label: "Producto", route: "/mantenimiento/productos", logo: <ShoppingCartIcon sx={{ fontSize: 30 }} />, description: 'Administra productos', permissions: [PERMISOS.ACCEDER_MTN_PRODUCTO] },
    { label: "Empleado", route: "/mantenimiento/empleados", logo: <EngineeringIcon sx={{ fontSize: 30 }} />, description: 'Gestiona empleados', permissions: [PERMISOS.ACCEDER_MTN_EMPLEADO] },
    { label: "Local", route: "/mantenimiento/local", logo: <BusinessIcon sx={{ fontSize: 30 }} />, description: 'Gestiona los locales', permissions: [PERMISOS.ACCEDER_MTN_LOCAL] },
    { label: "Meta", route: "/mantenimiento/meta", logo: <BusinessIcon sx={{ fontSize: 30 }} />, description: 'Asignación de metas', permissions: [PERMISOS.ACCEDER_MTN_META] },
    { label: "Correlativos", route: "/mantenimiento/correlativos", logo: <BusinessIcon sx={{ fontSize: 30 }} />, description: 'Asignación de correlativos', permissions: [PERMISOS.ACCEDER_MTN_RANGOS_FACTURAS] },
    { label: "Usuario", route: "/mantenimiento/usuarios", logo: <ManageAccountsIcon sx={{ fontSize: 30 }} />, description: 'Gestiona los usuarios', permissions: [PERMISOS.ACCEDER_MTN_USUARIO] },
    // { label: "Detalle H", route: "/mantenimiento/detallehistorial", logo: <PeopleIcon sx={{ fontSize: 30 }} />, description: 'Prueba detalle H.', permissions: [PERMISOS.ACCEDER_MTN_CLIENTES]},
  ];

  const getStyles = (index) => {
    return {
      backgroundColor: index % 2 === 0 ? '#ffff' : '#ffff',
      color: '#737670',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: 0, // Esquinas cuadradas
      width: '100%',  // Ancho del botón
      height: 'auto',  // Altura automática para ajustar el contenido
      padding: 1,     // Añade un poco de relleno
      '&:hover': {
        backgroundColor: index % 2 === 0 ? '#f9c74f' : '#bdbdbd',
      },
      [theme.breakpoints.down('sm')]: {
        width: '96%',
      },
    };
  };

  return (
    <DashboardLayout>
      <CssBaseline />
      <BoxNav>
        <DashboardNavbar/>
        {/* <DashboardNavbar absolute={false} light={true} isMini={false} /> */}
      </BoxNav>
      <Grid container spacing={2}
        sx={{
          backgroundColor: '#ffffff',
          width: '100%',
          marginLeft: '0%',
          marginRight: '0%',
          padding: '2%',
          marginTop: '1%',
          [theme.breakpoints.down('sm')]: {
            width: '98%',
          },
        }}>
        {buttons.map((button, index) =>
          button.permissions && button.permissions?.some(element => userPermissions.includes(element)) && (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Button
                variant="contained"
                onClick={() => navigate(button.route)}
                sx={{ ...getStyles(index), mb: 1 }}
              >
                <Grid container alignItems="center">
                  <Grid item>
                    <Box sx={{ mr: 1 }}>
                      {button.logo}
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {button.label}
                      </Typography>
                      <Typography variant="caption">
                        {button.description}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Button>
            </Grid>
          ))}
      </Grid>
    </DashboardLayout>
  );
};

export default MantenimientoMenu;
