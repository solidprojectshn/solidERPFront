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
import { getEmpleado, deleteEmpleado } from "../../../../../redux/mantenimientos/Empleado/actions";
import { getUsuario } from "../../../../../redux/mantenimientos/usuario/actions";
import { getLocal } from "../../../../../redux/mantenimientos/local/actions";
import { useDispatch, useSelector } from "react-redux";

import { PERMISOS } from "../../../../../services/constantes";

// alertas
import swal from "sweetalert";

// import complementos
import EmpleadoForm from "./Components/EmpleadoForm";

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
    empleados,
    empleadoError,
  } = useSelector((store) => store.empleado);

  const {
    loading: userLoanding,
    saveLoading: userSaveLoanding,
    usuarios,
    usuarioError,
  } = useSelector((store) => store.usuario);

  const {
    loading: localLoanding,
    saveLoading: localSaveLoading,
    locales,
    localError,
  } = useSelector((store) => store.local);

  const {
    permissions: userPermissions
  } = useSelector((store) => store.auth);

  useEffect(() => {
    dispatch(getEmpleado());
    dispatch(getUsuario());
    dispatch(getLocal());
    console.log("Datos de empleados:", empleados);
  }, [dispatch]); //tabla

  const userMap = useMemo(() => {
    return usuarios.reduce((acc, user) => {
      acc[user.id] = user.username;
      return acc;
    }, {});
  }, [usuarios]);

  const localMap = useMemo(() => {
    return locales.reduce((acc, local) => {
      acc[local.id_local] = local.nombre;
      return acc;
    }, {});
  }, [locales]);

  const empleadosConInfo = useMemo(() => {
    return empleados.map((empleado) => ({
      ...empleado,
      nombre_usuario: userMap[empleado.usuario] || 'Sin usuario',
      nombre_local: localMap[empleado.local] || 'Sin local',
    }));
  }, [empleados, userMap, localMap]);

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
          dispatch(deleteEmpleado(data, data.id_empleado, index));
        }
      });
  };

  // Definición de columnas
  const columns = useMemo(() => [
    {
      accessorKey: 'id_empleado',
      header: 'ID',
    },
    { accessorKey: 'nombre_completo', header: 'Nombre' },
    { accessorKey: 'telefono', header: 'Telefono' },
    { accessorKey: 'nombre_usuario', header: 'Usuario' },
    { accessorKey: 'nombre_local', header: 'Local' },
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
    data: empleadosConInfo,
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
          {empleadoError && <Alert severity="error">{empleadoError}</Alert>}
          <ButtonAdd onClick={handleAdd}>
            <Typography sx={{ fontSize: 'small', color: '#ffffff' }}>
              Agregar
            </Typography>
          </ButtonAdd>
        </BoxButton>
        <EmpleadoForm initialData={editItem} isEdit={isEdit} setShowModal={setShowModal} showModal={showModal} />
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
