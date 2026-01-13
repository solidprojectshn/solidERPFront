import { React, Suspense, useMemo, useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Typography, Box, Button, CircularProgress, IconButton } from "@mui/material";
import styled from "@emotion/styled";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";

// iconos
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';

// api
import { getLocal, deleteLocal } from "../../../../../redux/mantenimientos/local/actions";
import { useDispatch, useSelector } from "react-redux";
import { PERMISOS } from "../../../../../services/constantes";


// import complementos
import PruebaForm from "./components/pruebaForm";

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
    locales,
    localError,
  } = useSelector((store) => store.local);

  const {
    permissions: userPermissions
  } = useSelector((store) => store.auth);

  useEffect(() => {
    dispatch(getLocal());
    console.log("Datos de locales", locales);
  }, []); //tabla

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
          data.tipo_local_id = data.tipo_local.id_tipo_local
          delete data.tipo_local
          dispatch(deleteLocal(data, data.id_local, index))
        }
      });
  };

  // Definición de columnas
  const columns = useMemo(() => [
    {
      accessorKey: 'id_local',
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
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'direccion', header: 'Dirección' },
    { accessorKey: 'telefono', header: 'Telefono' },
    { accessorKey: 'correlativo_venta', header: 'Correlativo' },
    { accessorKey: 'meta', header: 'Meta' },
    { accessorKey: 'stock_maximo', header: 'Stock Maximo' },
    { accessorKey: 'tipo_local.nombre', header: 'Tipo de Local' },
    {
      header: '¿Posee Autorización Para Venta De Recargas?',
      accessorKey: 'recarga_guerrilla',
      size: 300,
      Cell: ({ cell }) => {
        if (cell.getValue() === true) {
          return <DoneIcon className='text-green-600' />;
        }
        return <ClearIcon className='text-red-600' />;
      }
    },
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
    data: locales,
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
          <ButtonAdd onClick={handleAdd}>
            <Typography sx={{ fontSize: 'small', color: '#ffffff' }}>
              Agregar
            </Typography>
          </ButtonAdd>
        </BoxButton>
        <PruebaForm initialData={editItem} isEdit={isEdit} setShowModal={setShowModal} showModal={showModal} />
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

