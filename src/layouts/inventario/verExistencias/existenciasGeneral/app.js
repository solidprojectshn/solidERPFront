import {React, useMemo, useState, Suspense, useEffect} from "react";
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import styled from "@emotion/styled";
import { CssBaseline, Box,Typography, useTheme, CircularProgress} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";

//import - montaje api
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { getExistencias } from "../../../../redux/inventario/verExistencias/actions";
import { TIPO_LOCAL } from "../../../../services/constantes";
import { useDispatch, useSelector } from "react-redux";

//icons
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { item } from "examples/Sidenav/styles/sidenavItem";

//estilos nav
const BoxNav = styled(Box)(({theme}) => ({
    display:'flex',
    flexDirection:'row',
    width:'100%',
    height:'20vh',
    padding:'1.5%'
}));

const Fondo = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    width: '100%',
    height: 'auto',
    padding:'2% 0% 2% 0%',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
    },
}));

const CardData = styled(Box)(({theme}) => ({
    display:'flex',
    flexDirection:'row',
    background:'#ffffff',
    border: '1px solid #ffffff',
    borderRadius:'10px',
    width:'50%',
    height:'15vh',
    margin:'1%',
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

const Logo = styled(Box)(({theme})=>({
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#ffffff',
    width:'30%', 
    margin:'1%'
}));

const ContenedorData = styled(Box)(({theme}) => ({
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#ffffff',
    width:'67%',
    margin:'1%'
}));

const BoxTabla = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', //vertical
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: '100%',
    height: 'auto',
    margin:'2.5% 0% 2.5% 0%',
    padding:'2%',
    boxShadow: theme.shadows[3],
}));

const AppEGeneral = ()=>{

    const theme = useTheme(); 
    const dispatch = useDispatch();

    const {
        loading,
        existencias,
        existenciaError,
        existenciasLength,
        mayorStock,
        menorStock
    } = useSelector((store) => store.existencias);

    // Estados locales y paginacion
    const [localSeleccionado, setLocalSeleccionado] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    //data de proyeccion
    const totalProductos = existenciasLength;

    useEffect(() => {
        const offset = pagination.pageIndex * pagination.pageSize;
        const limit = pagination.pageSize;

        dispatch(getExistencias({
            group_by: "producto",
            offset,
            limit
        }));
    }, [dispatch, pagination.pageIndex, pagination.pageSize]);
    
    //tabla
    const columns = useMemo(() => [
        {
            header: 'Producto',
            accessorKey: 'producto_nombre', 
        },
        {
            header: 'Descripcion',
            accessorKey: 'descripcion', 
        },
        {
            header: 'Precio Unitario',
            accessorKey: 'precio_unitario', 
        },
        {
            header: 'Precio de venta',
            accessorKey: 'precio_venta', 
        },
        {
            header: 'Stock',
            accessorKey: 'total_stock', 
        },
    ]);

    // Configuración de la tabla
    const table = useMaterialReactTable({
        columns,
        data: existencias || [],
        manualPagination:true,
        initialState: {pagination:{pageSize: 10, pageIndex: 0},density: "compact" },
        rowCount: existenciasLength || 0,
        onPaginationChange: setPagination,
        initialState: { density: "compact" },
        paginationDisplayMode: "pages",
        enableColumnResizing: true,
        enableGrouping: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        positionToolbarAlertBanner: 'bottom',
        localization: MRT_Localization_ES,
        muiTableHeadProps: {
        sx: {
            padding: "0"
        }
        },

        muiTableContainerProps: {
        className: "mrt-container table-style",

        },
        muiBottomToolbarProps: {
        className: "table-bottom"
        },
        muiToolbarAlertBannerChipProps: { color: "primary" },
        muiSearchTextFieldProps: {
        size: "small",
        variant: "outlined",
        },
        muiPaginationProps: {
        color: "primary",
        rowsPerPageOptions: [10, 20, 30],
        shape: "rounded",
        variant: "outlined",
        className: "pagination-selector"
        },
        muiTableBodyRowProps: {
        className: "filasTablaDark"
        },
        muiTopToolbarProps: {
        sx: {
            backgroundColor: "transparent"
        }
        },
        muiColumnActionsButtonProps: {
        className: "table-column-buttons"
        },
        muiTableFooterProps: {
        className: "table-footer-line"
        },
        state: {
        isLoading: loading,      
        showProgressBars: loading,
        pagination
        }
    });

    return(
        <DashboardLayout>
            <CssBaseline/>
            <BoxNav>
                <DashboardNavbar/>
            </BoxNav>
            <Fondo>
                <CardData>
                    <Logo><NotificationsActiveIcon fontSize="large" htmlColor="#696969" /></Logo>
                    <ContenedorData>
                        <Typography 
                            sx={{
                                fontSize:'small',
                                color:'#696969',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize:'small',
                                },
                            }}
                        >
                            Total de productos
                        </Typography>
                        <Typography 
                            sx={{
                                fontSize:'medium',
                                fontWeight:'bold',
                                color:'#696969',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize:'2vh',
                                    fontWeight:'bold'
                                },
                            }}
                        >
                            {totalProductos}
                        </Typography>
                    </ContenedorData>
                </CardData>  
                <CardData>
                <Logo><NotificationsActiveIcon fontSize="large" htmlColor="#4caf50" /></Logo>
                    <ContenedorData>
                        <Typography 
                            sx={{
                                fontSize:'small',
                                color:'#6c6a69',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize:'small',
                                },
                            }}
                        >
                            Producto mayor Stock
                        </Typography>
                        <Typography 
                            sx={{
                                fontSize:'small',
                                fontWeight:'bold',
                                color:'#4caf50',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize:'2vh',
                                    fontWeight:'bold'
                                },
                            }}
                        >
                            {mayorStock ? mayorStock.nombre : 'Sin datos'}
                        </Typography>
                    </ContenedorData>
                </CardData> 
                <CardData>
                <Logo><NotificationsActiveIcon fontSize="large" htmlColor="#ff3131" /></Logo>
                    <ContenedorData>
                        <Typography 
                            sx={{
                                fontSize:'small',
                                color:'#6c6a69',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize:'small',
                                },
                            }}
                        >
                            Producto menor Stock
                        </Typography>
                        <Typography 
                            sx={{
                                fontSize:'small',
                                fontWeight:'bold',
                                color:'#ff3131',
                                [theme.breakpoints.down('sm')]: {
                                    fontSize:'2vh',
                                    fontWeight:'bold'
                                },
                            }}
                        >
                            {menorStock ? menorStock.nombre : 'Sin datos'}
                        </Typography>
                    </ContenedorData>
                </CardData>     
            </Fondo>
            <BoxTabla>
                <Box sx={{ maxHeight: '500px', overflowY: 'auto', width: '100%' }}>
                    <Suspense fallback={<CircularProgress />}>
                        <MaterialReactTable table={table} />
                    </Suspense>
                </Box>
            </BoxTabla>
        </DashboardLayout>
    )
};

export default AppEGeneral;