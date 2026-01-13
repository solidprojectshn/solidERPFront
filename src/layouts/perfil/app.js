import React, { useState } from "react";
import { Box, styled, Button} from "@mui/material";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const BoxNav = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '20vh',
    padding: '1.5%'
}));

// Images
import burceMars from "assets/images/bruce-mars.jpg";
import logoDursan from "assets/images/IconoDursan.png";

function ProfileLayout() {
  const [tabValue, setTabValue] = useState(0);

    // Content for each tab
    const tabContents = [
        {
            title: "Manual Del Sistema",
            description: "Bienvenido al Manual del Sistema. Este manual ha sido diseñado para proporcionar una guía detallada sobre cómo utilizar las funcionalidades del sistema de manera efectiva y eficiente. Nuestro objetivo es asegurar que los usuarios puedan navegar a través de las herramientas y características del sistema con facilidad, maximizando así su rendimiento y productividad.",
            pdfUrl: "https://example.com/manual.pdf",
            color: "#526D7C",
            fontColor:"#ffffff",
        },
        {
            title: "Presentaciones Del Sistema",
            description: 
            "Las Presentaciones del sistema tienen como objetivo facilitar el aprendizaje y la adopción del sistema, presentando de manera clara y visual los flujos de trabajo, herramientas clave y funcionalidades esenciales. Estas presentaciones están diseñadas tanto para nuevos usuarios que están comenzando con el sistema, como para usuarios avanzados que buscan aprovechar al máximo sus capacidades." +
            "Además, sirven como recursos fundamentales para futuras capacitaciones que su empresa pueda organizar, permitiendo a los usuarios profundizar en temas específicos según sus necesidades y roles dentro de la organización.",
            pdfUrl: "https://example.com/presentaciones.pdf",
            color: "#455A64",
            fontColor:"#ffffff",
        },
        {
            title: "Sobre Nosotros",
            description: "Información sobre nuestra empresa y equipo.",
            pdfUrl: "https://example.com/sobre-nosotros.pdf",
            color: "#37474F",
            fontColor:"#ffffff",
        },
    ];

  // Handle tab change
  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <DashboardLayout>
        <BoxNav>
            <DashboardNavbar />
        </BoxNav>
        <Box marginTop={1}>
            <Box position="relative" width="100%" zIndex={1}>
                <Card sx={{py: 2, px: 2, boxShadow: 3,}}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item>
                        <Avatar
                            src={logoDursan}
                            alt="profile-image"
                            variant="rounded"
                            sx={{ width: 56, height: 56, boxShadow: 2 }}
                        />
                        </Grid>
                        <Grid item>
                        <Box height="100%" mt={0.5} lineHeight={1}>
                            <Typography variant="button" color="text.secondary" fontWeight="medium">
                                Inversiones
                            </Typography>
                            <Typography variant="h5" fontWeight="medium">
                                Dursan
                            </Typography>
                        </Box>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} ml="auto">
                        <AppBar position="static" color="default" sx={{width:"100%"}}>
                            <Tabs value={tabValue}
                                onChange={handleSetTabValue}
                                textColor="primary"
                                indicatorColor="primary"
                            >
                            <Tab label="Manual"/>
                            <Tab label="Presentaciones"/>
                            <Tab label="Nosotros"/>

                            </Tabs>
                        </AppBar>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, mt: 3, gap: 2 }}>
                <Box flex={1} p={2} sx={{ border: "1px solid #ddd", borderRadius: 2 }}>
                    <Typography 
                        variant="h3" 
                        fontWeight="bold" 
                        gutterBottom
                        sx={{
                            fontFamily: '"Poppins", sans-serif', 
                            lineHeight: 1.5, 
                        }}
                    >
                        {tabContents[tabValue].title}
                    </Typography>
                    <Typography 
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            fontFamily: '"Poppins", sans-serif', 
                            fontSize: '14px', 
                            lineHeight: 1.5, 
                        }}
                    >
                        {tabContents[tabValue].description}
                    </Typography>
                </Box>
                <Box flex={1} p={2} sx={{ border: "1px solid #ddd", borderRadius: 2 }}>
                    <Button
                        variant="contained"
                        href={tabContents[tabValue].pdfUrl}
                        sx={{
                            width:'100%',
                            height:'100%',
                            backgroundColor:tabContents[tabValue].color,
                            color:tabContents[tabValue].fontColor,
                        }}
                    >
                        {tabContents[tabValue].title}
                    </Button>
                </Box>
            </Box>
        </Box>
    </DashboardLayout>
  );
}

export default ProfileLayout;
