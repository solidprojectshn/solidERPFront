import React from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

const PrinterSelectionModal = ({ open, printers, onSelectPrinter, onClose }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    Selecciona una impresora
                </Typography>
                <List>
                    {printers.map((printer, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton onClick={() => onSelectPrinter(printer)}>
                                <ListItemText primary={printer} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Modal>
    );
};

export default PrinterSelectionModal;
