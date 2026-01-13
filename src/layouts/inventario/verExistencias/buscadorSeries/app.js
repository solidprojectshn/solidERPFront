import {React,useState, useEffect, useMemo} from "react";

//mui
import styled from "@emotion/styled";
import {
  TextField,
  Button,
  CircularProgress,
  Paper,
  TableContainer,
  Typography,
  Box,
  Container,
} from "@mui/material";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getBuscadorSerie } from "../../../../redux/inventario/buscadorSerie/actions";

//componentes extras
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";

//tabla
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';

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
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    width: '100%',
    height: 'auto',
    padding:'2%',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
    },
}));

const Buscador = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    width: '100%',
    height: 'auto',
    padding:'2%',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
    },
}));

const AppBuscador = ()=>{

    const dispatch = useDispatch();
    const { datosBuscador, loading, buscadorError } = useSelector(
        (state) => state.buscadorSeries
    );

    const [serie, setSerie] = useState("");

    //dispara la busqueda al hacer click
    const handleBuscar = () => {
        if (serie.trim() !== "") {
        dispatch(getBuscadorSerie({ numero_serie: serie.trim() }));
        }
    };

    //Permitir presionar Enter en el TextField
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
        handleBuscar();
        }
    };

    //tabla
    const columns = useMemo(() => [
        {
            header: 'ID Unidad',
            accessorKey: 'id_unidad', 
        },
        {
            header: 'Numero de Serie',
            accessorKey: 'numero_serie', 
        },
        {
            header: 'Producto',
            accessorKey: 'producto', 
        },
        {
            header: 'Local',
            accessorKey: 'local', 
        },
        {
            header: 'Estado',
            accessorKey: 'estado',
            size: 300,
            Cell: ({ cell }) => {
            if (cell.getValue() === true) {
                return 'Activo';
            }
                return 'Facturado';
            } 
        },
    ]);

    const table = useMaterialReactTable({
        columns,
        data: datosBuscador || [],
        
        // Estado inicial
        initialState: {
            pagination: { pageIndex: 0, pageSize: 10 },
            density: "compact",
        },
        
        // Funcionalidades clave
        enableColumnResizing: true,
        enableGrouping: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        
        // Localización
        localization: MRT_Localization_ES,
        
        // Props de estado
        state: {
            isLoading: loading,
            showProgressBars: loading,
        },
        
        // Opciones de paginación
        muiPaginationProps: {
            rowsPerPageOptions: [10, 20, 30],
        },
        muiTableHeadProps: {
            sx: {
                backgroundColor: '#ffffff',
                color: 'white',
            },
        },
        muiTopToolbarProps: {
            sx: {
                backgroundColor: '#fff',   // fondo blanco para filtros y acciones
            },
        },
        muiBottomToolbarProps: {
            sx: {
                backgroundColor: '#fff',   // fondo blanco para el pie (paginación)
            },
        },
    });

    return(
        <DashboardLayout>
            <BoxNav>
                <DashboardNavbar/>
            </BoxNav>
            <Fondo>
                <Buscador>
                    <TextField
                        placeholder="Serie a Buscar"
                        value={serie}
                        onChange={(e) => setSerie(e.target.value)}
                        onKeyDown={handleKeyDown}
                        fullWidth
                    />
                    <Button 
                        variant="contained"
                        sx={{margin : "0% 0% 0% 2%"}}
                        onClick={handleBuscar}
                    > 
                        Buscar 
                    </Button>
                </Buscador>
                <TableContainer 
                    component={Paper}
                    sx={{
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        borderRadius: 2,
                    }}
                >
                    <MaterialReactTable table={table} />
                </TableContainer>
            </Fondo>
        </DashboardLayout>
    )
};

export default AppBuscador;