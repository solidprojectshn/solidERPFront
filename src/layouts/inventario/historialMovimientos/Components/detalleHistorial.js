import React, { useEffect, useState } from "react";
import { Box, Card, Grid, Typography, Button, Modal, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { column } from "stylis";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {format} from 'date-fns';

//reporteria
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

//llamado a l api desde redux
import { getHistorialMById } from "../../../../redux/inventario/historialMovimiento/historialMProductos/actions";

function ProductoDetalle() {
  const { id} = useParams();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    historialMById,
    loadingById,
    historialMByIdError
  } = useSelector((store) => store.historialM);

  useEffect(()=> {
    dispatch(getHistorialMById(id));
  },[dispatch,id]);

  useEffect(() => {
    console.log('Data en base al id:', historialMById);
}, [historialMById]);

 const datahistorial = historialMById;

  const handleExport = (type, datahistorial, fecha, hora) => {
    if (type === 'PDF') {
        const doc = new jsPDF();
        doc.text(`Detalle del movimiento N° ${datahistorial.id_historial_movimiento}`, 10, 10);
        
        // Información general
        const detalles = [
            ["Local de Origen", datahistorial?.origen_local?.nombre || ""],
            ["Local de Destino", datahistorial?.destino_local?.nombre || ""],
            ["Nombre del Producto", datahistorial?.producto?.nombre || ""],
            ["Cantidad", datahistorial?.cantidad || ""],
            ["Movimiento realizado por", datahistorial?.creado_por || ""],
            // ["Fecha", `${fecha} ${hora}`]
            ["Fecha",datahistorial.fecha_movimiento || ""],
        ];
        
        autoTable(doc, {
            startY: 20,
            head: [["Detalle", "Valor"]],
            body: detalles,
        });

        // Agregar detalle de unidades
        if (datahistorial?.unidades?.length > 0) {
          autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            head: [["#", "Número de Series"]],
            body: datahistorial.unidades.map((unidad, index) => [index + 1, unidad.numero_serie]),
          });
        } else {
          doc.text("No hay unidades disponibles.", 10, doc.lastAutoTable.finalY + 10);
        }

        doc.save(`Movimiento_${datahistorial.id_historial_movimiento}.pdf`);
    } else if (type === 'Excel') {
        const ws = XLSX.utils.aoa_to_sheet([
          ["Detalle", "Valor"],
          ["Local de Origen", datahistorial?.origen_local?.nombre || ""],
          ["Local de Destino", datahistorial?.destino_local?.nombre || ""],
          ["Nombre del Producto", datahistorial?.producto?.nombre || ""],
          ["Cantidad", datahistorial?.cantidad || ""],
          ["Movimiento realizado por", datahistorial?.creado_por || ""],
          // ["Fecha", `${fecha} ${hora}`],
          ["Fecha",datahistorial.fecha_movimiento || ""],
          [],
          ["Detalle de Unidades"],
          ["#", "Número de Series"],
          ...datahistorial.unidades.map((unidad, index) => [index + 1, unidad.numero_serie])
        ]);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Historial Movimiento");
        XLSX.writeFile(wb, `Movimiento_${datahistorial.id_historial_movimiento}.xlsx`);
    }
  };

  //fecha formato
  // const fechaOriginal = datahistorial?.fecha_movimiento || "";
  // const fecha = format(new Date(fechaOriginal), 'dd-MM-yyyy');
  // const hora = format(new Date(fechaOriginal), 'HH:mm:ss');

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box marginTop={2}>
        <Card sx={{ padding: 3, boxShadow: 3 }}>
          <Typography
            fontWeight="bold"
            gutterBottom
            sx={{
              color: '#515151',
              fontFamily: 'sans-serif',
              fontSize: 'large'
            }}
          >
            Detalle del movimiento N° {datahistorial.id_historial_movimiento}
          </Typography>
          <Grid container spacing={2}>
            {/* Primera columna - Detalle del movimiento */}
            <Grid item xs={12} sm={6}>
                <Grid container spacing={1} direction={"row"}>
                    <Grid item>
                        <Typography
                            sx={{
                                fontSize:'medium',
                                color:'#666666',
                                fontFamily:'sans-serif'
                            }}
                        >Local de Origen:</Typography>
                    </Grid>
                    <Grid item>
                        <Typography
                            sx={{
                                fontSize:'medium',
                                color:'#8c8c8c',
                                fontFamily:'sans-serif'
                            }}
                        >
                            {datahistorial?.origen_local?.nombre || ""}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container spacing={1} direction={"row"}>
                <Grid item>
                    <Typography
                        sx={{
                            fontSize:'medium',
                            color:'#666666',
                            fontFamily:'sans-serif'
                        }}
                    >
                        Local de Destino:
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        sx={{
                            fontSize:'medium',
                            color:'#8c8c8c',
                            fontFamily:'sans-serif'
                        }}
                    >
                        {datahistorial?.destino_local?.nombre || ""}
                    </Typography>
                </Grid>
                </Grid>

                <Grid container spacing={1} direction={"row"}>
                  <Grid item>
                    <Typography 
                        sx={{
                            fontSize:'medium',
                            color:'#666666',
                            fontFamily:'sans-serif'
                        }}
                    >
                        Nombre del Producto:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      sx={{
                          fontSize:'medium',
                          color:'#8c8c8c',
                          fontFamily:'sans-serif'
                      }}
                    >
                      {datahistorial?.producto?.nombre || ""}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={1} direction={"row"}>
                  <Grid item>
                    <Typography 
                        sx={{
                            fontSize:'medium',
                            color:'#666666',
                            fontFamily:'sans-serif'
                        }}
                    >
                        Cantidad:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                        sx={{
                            fontSize:'medium',
                            color:'#8c8c8c',
                            fontFamily:'sans-serif'
                        }}
                    >
                        {datahistorial?.cantidad || ""}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={1} direction={"row"}>
                  <Grid item>
                    <Typography 
                        sx={{
                            fontSize:'medium',
                            color:'#666666',
                            fontFamily:'sans-serif'
                        }}
                    >
                        Movimiento realizado por:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                        sx={{
                            fontSize:'medium',
                            color:'#8c8c8c',
                            fontFamily:'sans-serif'
                        }}
                    >
                        {datahistorial?.creado_por || ""}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={1} direction={"row"}>
                  <Grid item>
                    <Typography 
                        sx={{
                            fontSize:'medium',
                            color:'#666666',
                            fontFamily:'sans-serif'
                        }}
                    >
                        Fecha:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                        sx={{
                            fontSize:'medium',
                            color:'#8c8c8c',
                            fontFamily:'sans-serif'
                        }}
                    >
                        {datahistorial.fecha_movimiento}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              
            {/* Segunda columna - Detalle de las Unidades y botones */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Detalle de las Unidades:</Typography>
              <Modal open={open} onClose={handleClose}>
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
                  <Typography variant="h6" gutterBottom>
                    Detalle de Unidades
                  </Typography>
                  {datahistorial?.unidades?.length > 0 ? (
                    datahistorial?.unidades?.map((unidad, index) => (
                      <Accordion key={unidad.id_historial_movimiento_unidad} sx={{padding:'1%'}}>
                          <Typography>Serie: {index + 1}: {unidad.numero_serie}</Typography>
                      </Accordion>
                    ))
                  ) : (
                    <Typography>No hay unidades disponibles.</Typography>
                  )}
                  <Box textAlign="right" mt={2}>
                    <Button variant="contained"
                      onClick={handleClose}
                      sx={{
                        margin: 0.5,
                        textTransform: 'none',
                        backgroundColor: '#ff0000',
                        color: '#ffffff',
                        width: '20%',
                        '&:hover': {
                            backgroundColor: '#ff0000',
                            color: '#ffffff'
                        },
                      }}
                      >
                        Cerrar
                      </Button>
                  </Box>
                </Box>
              </Modal>

              {/* Contenedor de botones en columnas */}
              <Box mt={2}>
                <Grid container spacing={2} direction={"column"}>
                    <Grid item xs={12} sm={6}>
                        <Button 
                            variant="contained" 
                            size="medium" 
                            color="primary" 
                            onClick={handleOpen}
                            fullWidth
                        >
                            Ver Unidades
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            onClick={() => handleExport('PDF', datahistorial)}
                        >
                            Exportar a PDF
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="contained"
                            color="info"
                            fullWidth
                            onClick={() => handleExport('Excel', datahistorial)}
                        >
                            Exportar a Excel
                        </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </DashboardLayout>
  );
}

export default ProductoDetalle;
