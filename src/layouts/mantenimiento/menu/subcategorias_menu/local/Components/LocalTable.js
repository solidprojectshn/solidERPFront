import React, { memo, useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box, Button, CircularProgress, Grid, IconButton, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { useSelector, useDispatch } from "react-redux";
import "./../../../../../../assets/css/tables-styles.css"
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import swal from 'sweetalert';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';


//definicion de las funciones de actions en el redux que llaman a la api

import {
  getLocal,
  deleteLocal,
}from "../../../../../../redux/mantenimientos/local/actions"

import { Suspense } from 'react';
import LocalForm from './LocalForm';

// Estilo para el botón de "Agregar"
const StyledButton = styled(Button)(({ theme }) => ({
  color: 'white',  // Color de la letra en blanco
}));

const LocalTable = () => {
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState({})
  const [isEdit, setIsEdit] = useState(false)
  const [index, setIndex] = useState()

  const dispatch = useDispatch();
  //definicion de las variables del reducer
  const {
    loading,
    loadingById,
    saveLoading,
    localLength,
    locales,
    local,
    localError,
    formError,
  } = useSelector((store) => store.local);

  useEffect(() => {
    dispatch(getLocal())
  }, [])


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
    {
      accessorKey: 'empleado.nombre_completo',
      header: 'Colaborador Encargado',
      Cell: ({ cell }) => cell.getValue() || 'No asignado', 
    },
    { accessorKey: 'correlativo_venta', header: 'Correlativo' },
    { accessorKey: 'stock_maximo', header: 'Stock Maximo' },
    { accessorKey: 'tipo_local.nombre', header: 'Tipo de Local' },
    {
      accessorKey: 'recarga_guerilla',
      header: '¿Posee Autorización Para Venta De Recargas?',
      size: 300,
      muiTableBodyCellProps: {
        sx: {
          fontSize: "25px",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        },
      },
      Cell: ({ cell }) => {
        if (cell.getValue() == true) {
          return (
            <DoneIcon className='text-green-600' />
          );
        }
        return (
          <ClearIcon className='text-red-600' />
        )
      }
    },
    {
      header: 'Acciones',
      id: 'acciones',
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <IconButton
            color="primary"
            onClick={() => handleEdit(row.original, row.index)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDelete(row.original, row.index)}
          >
            <DeleteIcon />
          </IconButton>
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
    muiToolbarAlertBannerChipProps: { color: "primary" },
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "primary",
      rowsPerPageOptions: [1,10, 20, 30],
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

  //Función para abrir la modal y agregar un nuevo
  const handleAdd = () => {
    setShowModal(true);
    setIsEdit(false);
    setEditItem(null)
  }

  // Función para abrir la modal y editar un producto
  const handleEdit = (data, index) => {
    console.log(data, index)
    setEditItem({ data, index })
    setIsEdit(true);
    setShowModal(true);
  }


  // Función para eliminar filas seleccionadas
  const handleDelete = (data, index) => {
    console.log('Eliminar local con ID:', data, index);
    swal({
      title: "¿Está seguro de eliminar este registro?",
      text: "Una vez que lo elimine no podrá recuperarlo.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          data.estado = false
          data.tipo_local_id = data.tipo_local.id_tipo_local
          delete data.tipo_local
          dispatch(deleteLocal(data, data.id_local, index))
        }
      });
  };

  return (
    <Box sx={{ padding: '16px' }}>
      {localError && <Alert severity="error">{localError}</Alert>}

      <Grid container justifyContent="space-between" alignItems="center" style={{ marginBottom: '16px' }}>
        <Typography variant="h5"></Typography>
        <StyledButton
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            backgroundColor:"#6a8173",
            border:'1px solid #ffffff',
            '&:hover': {
            backgroundColor: '#bea38e',
            },
          }}
        >
          Agregar
        </StyledButton>
      </Grid>
      <LocalForm initialData={editItem} isEdit={isEdit} setShowModal={setShowModal} showModal={showModal} />

      <Suspense fallback={<CircularProgress />}>
        <MaterialReactTable table={table} />
      </Suspense>


    </Box>
  );
};

export default memo(LocalTable)
