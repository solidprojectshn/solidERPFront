import { React, Suspense, useMemo, useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Typography, Box, Button, CircularProgress, IconButton, Alert } from "@mui/material";
import styled from "@emotion/styled";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";

// api
import { getPermisos, deletePermisos, getPermisosById, editPermisos } from "../../../../../redux/mantenimientos/permisos/actions";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Checkbox from '@mui/material/Checkbox';

// import complementos
// alertas
import swal from "sweetalert";

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
  const { idRol } = useParams();
  const [selectedPermisos, setSelectedPermisos] = useState([]);

  const {
    loading,
    loadingById,
    saveLoading,
    permisosLength,
    permisos,
    permiso: gruposPermisos,
    permisosError,
    formError,
  } = useSelector((store) => store.permisos);

  useEffect(() => {
    dispatch(getPermisos());
  }, []);
  // Inicializa los permisos seleccionados con los del rol actual
  useEffect(() => {
    if (gruposPermisos) {
      const permisosIniciales = gruposPermisos?.permissions?.map((permiso) => permiso.id);
      setSelectedPermisos(permisosIniciales);
    }
    

  }, [gruposPermisos]);

  useEffect(() => {
    if (idRol) {
      console.log("si entra 2")
      dispatch(getPermisosById(idRol))
    }
  }, [idRol])

  const onSubmit = () => {
    let req = {
      permission_ids:selectedPermisos
    }
    dispatch(editPermisos(req, idRol))
  }


  // Definición de columnas
  const columns = useMemo(() => [
    {
      accessorKey: 'id',
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
    { accessorKey: 'name', header: 'Permiso' },

    {
      id: "checkbox",
      header: "Asignar",
      Cell: ({ row }) => (
        <Checkbox
          checked={selectedPermisos?.includes(row.original.id)}
          onChange={() => handleCheckboxChange(row.original.id)}
        />
      ),
    },
  ], [selectedPermisos, gruposPermisos]);

  

  // Maneja cambios en los checkboxes
  const handleCheckboxChange = (id) => {
    setSelectedPermisos((prev) =>
      prev.includes(id)
        ? prev.filter((permisoId) => permisoId !== id) // Eliminar permiso
        : [...prev, id] // Agregar permiso
    );
  };

  // Configuración de la tabla
  const table = useMaterialReactTable({
    columns,
    data: permisos,
    enableRowSelection: false,
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
      isLoading: loading || loadingById,
      isSaving: saveLoading,
      showProgressBars: loading || loadingById,
    },
  });

  return (
    <DashboardLayout>
      <Fondo>

        <BoxNav>
          <DashboardNavbar absolute={false} light={true} isMini={false} />
        </BoxNav>
        <BoxButton>
          {permisosError && <Alert severity="error">{permisosError}</Alert>}
          {formError && <Alert severity="error">{formError}</Alert>}
        </BoxButton>
        <BoxTabla>
          <Box sx={{ maxHeight: '500px', overflowY: 'auto', width: '100%' }}>
            <Suspense fallback={<CircularProgress />}>
              <MaterialReactTable table={table} />
            </Suspense>
          </Box>
        </BoxTabla>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>

          <Button
            onClick={() => onSubmit()}
            variant="contained"
            color="primary"
            disabled={saveLoading}
          >
            {saveLoading && <CircularProgress size={24} /> }
            Guardar
          </Button>
        </Box>
      </Fondo>
    </DashboardLayout>
  )
}

export default app;
