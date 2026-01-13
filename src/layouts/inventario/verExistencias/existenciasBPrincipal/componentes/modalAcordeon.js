// SeriesModal.jsx
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

const SeriesModal = ({ open, handleClose, unidades }) => {
  const unidadesActivas = unidades?.filter((u) => u.estado === true) || [];

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
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{unidad.numero_serie}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>Serie válida y activa.</Typography>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography mt={2}>No hay series activas disponibles.</Typography>
          )}
        </Box>

        <Button
            onClick={handleClose}
            variant="contained"
            sx={{ 
                mt: 3,
                background:'#ff0000',
                color:'#ffffff',
                ':hover':{
                    background:'#ff0000',
                    color:'#ffffff',
                }
            }}
            fullWidth
        >
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
};

export default SeriesModal;
