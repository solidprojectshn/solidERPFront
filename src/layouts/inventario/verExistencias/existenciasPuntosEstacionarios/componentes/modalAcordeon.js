import React from 'react';
import {
  Modal,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Button,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import swal from 'sweetalert';
import { deleteUnidad } from '../../../../../redux/inventario/agregarStock/actions';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 2,
  display: 'flex',
  flexDirection: 'column',
};

const scrollContentStyle = {
  overflowY: 'auto',
  flexGrow: 1,
  mt: 1,
  pr: 1,
};

const SeriesModal = ({ open, handleClose, unidades, onUnidadEliminada, tienePermisoEspecifico}) => {
  const dispatch = useDispatch();
  const unidadesActivas = unidades?.filter((u) => u.estado === true) || [];

  const handleDelete = (data, index) => {
    swal({
      title: "¿Está seguro de eliminar esta unidad?",
      text: "Una vez eliminada no podrá recuperarla.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        data.estado = false;
        dispatch(deleteUnidad(data, data.id_unidad, index)).then(() => {
          if (onUnidadEliminada) onUnidadEliminada();
        });
      }
    });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Series activas</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon color="error" />
          </IconButton>
        </Stack>

        <Box sx={scrollContentStyle}>
          {unidadesActivas.length > 0 ? (
            unidadesActivas.map((unidad, index) => (
              <Accordion key={index} disabled={tienePermisoEspecifico}>
                <AccordionSummary expandIcon={!tienePermisoEspecifico && <ExpandMoreIcon />}>
                  <Typography>{unidad.numero_serie}</Typography>
                </AccordionSummary>
                {!tienePermisoEspecifico && (
                  <AccordionDetails>
                    <Button
                      size="large"
                      variant="contained"
                      sx={{
                        background:'#ff0000',
                        width:'100%',
                        color:'#ffffff',
                        ':hover':{
                            background:'#ff0000',
                            color:'#ffffff',
                        }
                      }}
                      onClick={() => handleDelete(unidad, index)}
                    >
                      Eliminar
                    </Button>
                  </AccordionDetails>
                )}
              </Accordion>
            ))
          ) : (
            <Typography mt={2}>No hay series activas disponibles.</Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default SeriesModal;
