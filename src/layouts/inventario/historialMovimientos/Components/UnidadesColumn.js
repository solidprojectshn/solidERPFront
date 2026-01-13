import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CssBaseline, Box, Typography, useTheme, CircularProgress, Button, Modal, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { useState } from "react";
const UnidadesColumn = ({ cell }) => {
    const [open, setOpen] = useState(false); // Estado para manejar el modal
    const unidades = cell.getValue(); // Obtener las unidades

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            {/* Botón para abrir el modal */}
            {
                unidades && unidades?.length > 0 &&
                <Button variant="contained" size="small" color="primary" onClick={handleOpen}>
                    Ver Unidades
                </Button>
            }

            {/* Modal para mostrar las unidades */}
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-unidades" aria-describedby="modal-unidades-descripcion">
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "80%",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography id="modal-unidades" variant="h6" component="h2" gutterBottom>
                        Detalle de Unidades
                    </Typography>

                    {/* Acordeón para cada unidad */}
                    {unidades && unidades.length > 0 ? (
                        unidades.map((unidad, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff', // Alternar colores para mejor visualización
                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <span
                                    style={{
                                        fontWeight: 'bold',
                                        marginRight: '8px',
                                        color: '#333',
                                    }}
                                >
                                    Unidad {index + 1}:
                                </span>
                                <span>{unidad.numero_serie}</span>
                            </div>
                        ))
                    ) : (
                        <Typography>No hay unidades disponibles.</Typography>
                    )}

                    {/* Botón para cerrar el modal */}
                    <Box textAlign="right" mt={2}>
                        <Button variant="outlined" color="secondary" onClick={handleClose}>
                            Cerrar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default UnidadesColumn