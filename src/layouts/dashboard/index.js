import React, { useEffect } from "react";
import { Box, Grid, Card, Typography, useTheme, styled, CircularProgress } from "@mui/material";
import ArgonBox from "components/ArgonBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import GraficoMetas from "examples/Charts/Recharts/LineChart/GraficoMetas";
import GraficoTopProductos from "examples/Charts/Recharts/LineChart/GraficoTopProductos";
import GraficoTopLocales from "examples/Charts/Recharts/LineChart/GraficoTopLocales";
import CustomLineChart from "examples/Charts/Recharts/LineChart/LineChart";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { getLocal } from "../../redux/mantenimientos/local/actions"
import { getKpis } from "../../redux/dashboards/dashboards/actions"
import { useDispatch, useSelector } from "react-redux";
import { PERMISOS, TIPO_LOCAL } from "../../services/constantes";

const Dashboard = () => {
  const dispatch = useDispatch();
  const BoxNav = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#5a7fa2',
    width: '100%',
    height: '20vh',
    padding: '1.5%'
  }));


  const {

    loadingKpis,
    kpis,
    kpisError

  } = useSelector((store) => store.dashboard);
  const { user, permissions } = useSelector((store) => store.auth);

  const esUsuarioEspecifico = permissions.includes(PERMISOS.ACCEDER_DASHBOARD_ESPECIFICO);

  useEffect(() => {
    if (!esUsuarioEspecifico) {
      dispatch(getKpis())
    }
    dispatch(getLocal({ nombre_tipo_local: TIPO_LOCAL.TIENDA }));

  }, [dispatch]);

  return (
    <DashboardLayout>
      <BoxNav>
        <DashboardNavbar absolute={false} light={true} isMini={false} />
      </BoxNav>
      <Box mt={3}>
        <Grid container spacing={3}>
          {/* Tarjetas con métricas */}
          {!esUsuarioEspecifico && (

            loadingKpis ? (
              <CircularProgress />
            ) : (
              <Grid item xs={12} sm={6} md={6}>
                <Grid container rowSpacing={4} >
                  <Grid item xs={12}>
                    <Card sx={{ p: 3, textAlign: "center", boxShadow: 3 }}>
                      <Typography variant="h6" color="text.secondary">
                        Ventas Mes Actual
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {Number(kpis?.ventas_mes_actual).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }) }  <span style={{ fontSize: "15px" }} className={kpis?.cambio_porcentual > 0 ? "text-green-800" : "text-red-800"}>{kpis?.cambio_porcentual > 0 ? "+" : "-"}({kpis?.cambio_porcentual}%) </span>
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card sx={{ p: 3, textAlign: "center", boxShadow: 3 }}>
                      <Typography variant="h6" color="text.secondary">
                        Ventas Mes Anterior
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {Number(kpis?.ventas_mes_anterior).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' }) }
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card sx={{ p: 3, textAlign: "center", boxShadow: 3 }}>
                      <Typography variant="h6" color="text.secondary">
                        Nuevos Clientes del Mes
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {kpis?.nuevos_clientes}
                      </Typography>
                    </Card>
                  </Grid>

                </Grid>

              </Grid>
            )
          )}



          {!esUsuarioEspecifico && (
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ p: 3, boxShadow: 3 }}>
                <GraficoTopLocales />
              </Card>
            </Grid>
          )}


          {/* Gráfica de ingresos */}
          <Grid container spacing={3} margin="auto">
            <Grid item xs={12} lg={6}>
              <Card sx={{ p: 3, boxShadow: 3 }}>
                <GraficoMetas />
              </Card>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Card sx={{ p: 3, boxShadow: 3 }}>
                <GraficoTopProductos />
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={3} margin="auto">

            <Grid item xs={12} lg={12}>
              <Card sx={{ p: 3, boxShadow: 3 }}>
                <CustomLineChart />
              </Card>
            </Grid>
          </Grid>

        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;
