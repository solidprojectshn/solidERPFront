import { React, Suspense, useMemo, useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Typography, Box, Button, CircularProgress, IconButton, Alert } from "@mui/material";
import styled from "@emotion/styled";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";

// iconos
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';

// api
import { getCliente, deleteCliente } from "../../../../../redux/mantenimientos/clientes/actions";
import { useDispatch, useSelector } from "react-redux";

// alertas
import swal from 'sweetalert';

// import complementos
import ClienteForm from "./Components/ClienteForm";
import { PERMISOS } from "../../../../../services/constantes";

const Fondo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundImage: 'linear-gradient(to bottom, #43b399 50%, #ffffff 50%)',
  width: '100%',
  height: 'auto',
  justifyContent: 'start'
}));

const BoxNav = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: '#43b399',
  width: '100%',
  height: '20vh',
  padding: '1.5%'
}));

const BoxButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: '#43b399',
  width: '100%',
  height: '15vh',
  padding: '1.5%',
  justifyContent: 'end',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    height: '12vh',
    padding: '2%',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    height: 'auto',
    padding: '3%',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const ButtonAdd = styled(Button)(({ theme }) => ({
  width: '25%',
  height: '7vh',
  backgroundColor: '#43b399',
  border: '1px solid #ffffff',
  [theme.breakpoints.down('md')]: {
    width: '15%',
    height: '7vh',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: '7vh',
  },
}));

const BoxTabla = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: 'auto',
  backgroundColor: '#ffffff',
  padding: '2%',
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down('sm')]: {
    padding: '5%',
  },
}));

const app = () => {

  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editItem, setEditItem] = useState({});

  const {
    loading,
    saveLoading,
    clientes,
    clienteError,
  } = useSelector((store) => store.cliente);

  const {
    permissions: userPermissions
  } = useSelector((store) => store.auth);

  useEffect(() => {
    dispatch(getCliente());
    console.log("Datos de clientes:", clientes);
  }, []);

  const handleAdd = () => {
    setShowModal(true);
    setIsEdit(false);
    setEditItem(null);
  }

  const handleEdit = (data, index) => {
    console.log(data, index);
    setEditItem({ data, index });
    setIsEdit(true);
    setShowModal(true);
  }

  const handleDelete = (data, index) => {
    console.log('Eliminar tipo de producto con ID:', data, index);
    swal({
      title: "¿Está seguro de eliminar este registro?",
      text: "Una vez que lo elimine no podrá recuperarlo.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          data.estado = false;
          dispatch(deleteCliente(data, data.id_cliente, index));
        }
      });
  };

  // Definición de columnas
  const columns = useMemo(() => [
    {
      accessorKey: 'id_cliente',
      header: 'ID',
      muiTableHeadCellProps: {
        sx: {
          paddingLeft: "25px"
        }
      },
      muiTableBodyCellProps: {
        sx: {
          paddingLeft: "25px"
        }
      }
    },
    { accessorKey: 'nombre_completo', header: 'Nombre' },
    { accessorKey: 'dni', header: 'DNI' },
    { accessorKey: 'telefono', header: 'Télefono' },
    {
      header: 'Acciones',
      id: 'acciones',
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          {userPermissions.includes(PERMISOS.PERMISO_EDITAR) && (
            <IconButton
              color="primary"
              onClick={() => handleEdit(row.original, row.index)}
            >
              <EditIcon />
            </IconButton>
          )}
          {userPermissions.includes(PERMISOS.PERMISO_ELIMINAR) && (
            <IconButton
              color="secondary"
              onClick={() => handleDelete(row.original, row.index)}
            >
              <DeleteIcon />
            </IconButton>
          )}

        </Box>
      ),
    },
  ], []);

  // Configuración de la tabla
  const table = useMaterialReactTable({
    columns,
    data: clientes,
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
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "primary",
      rowsPerPageOptions: [5, 10, 15, 20],
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
      isSaving: saveLoading,
      showProgressBars: loading,
    },
  });

  return (
    <DashboardLayout>
      <Fondo>
        <BoxNav>
          <DashboardNavbar absolute={false} light={true} isMini={false} />
        </BoxNav>
        <BoxButton>
          {clienteError && <Alert severity="error">{clienteError}</Alert>}
          <ButtonAdd onClick={handleAdd}>
            <Typography sx={{ fontSize: 'small', color: '#ffffff' }}>
              Agregar
            </Typography>
          </ButtonAdd>
        </BoxButton>
        <ClienteForm initialData={editItem} isEdit={isEdit} setShowModal={setShowModal} showModal={showModal} />
        <BoxTabla>
          <Box sx={{ maxHeight: '500px', overflowY: 'auto', width: '100%' }}>
            <Suspense fallback={<CircularProgress />}>
              <MaterialReactTable table={table} />
            </Suspense>
          </Box>
        </BoxTabla>
      </Fondo>
    </DashboardLayout>
  )
}

export default app;
