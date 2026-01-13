// @mui material components
import { CircularProgress, FormControl, Grid, InputLabel, MenuItem } from "@mui/material";
import Card from "@mui/material/Card";
import Select from "react-select";


// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

import lineChartData from "layouts/dashboard/data/gradientLineChartData";
import { useEffect, useState } from "react";
import { getVentasMensuales } from "../../../../redux/dashboards/dashboards/actions";
import { useDispatch, useSelector } from "react-redux";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { PERMISOS } from "../../../../services/constantes";
import moment from "moment";
import { Legend } from "chart.js";

function CustomLineChart() {
    const dispatch = useDispatch()

    const {
        loadingCumpMetas,
        cumpMetas,
        cumpMetasError,

        loadingVentasMens,
        ventasMens,
        ventasMensError,

        loadingTopProds,
        topProds,
        topProdsError

    } = useSelector((store) => store.dashboard);

    const {
        loading: loadingLocales,
        locales,
        localError
    } = useSelector((store) => store.local);

    /////////////////////////////////////////////////
    const { user, permissions } = useSelector((store) => store.auth);

    const esUsuarioEspecifico = permissions.includes(PERMISOS.ACCEDER_DASHBOARD_ESPECIFICO);
    const localAsignado = user?.local_id || 0; // Local del usuario específico


    const currentYear = moment();

    const startYear = moment();
    const years = Array.from({ length: 6 }, (_, i) => ({
        value: startYear.clone().subtract(i, "years").format("YYYY"),
        label: startYear.clone().subtract(i, "years").format("YYYY")
    }));

    const localOptions = locales?.map((local) => ({
        value: local.id_local,
        label: local.nombre
    })) || [];

    // Agregar la opción "general"
    localOptions.unshift({
        value: 'general', // o cualquier valor que desees
        label: 'General'
    });

    const [selectedAnio, setSelectedAnio] = useState(years[0]?.value)
    const [selectedLocal, setSelectedLocal] = useState(esUsuarioEspecifico ? localAsignado : "")

    useEffect(() => {
        if (locales) {
            if (esUsuarioEspecifico) {
                dispatch(getVentasMensuales({ anio: currentYear.format("YYYY"), local: localAsignado }));
            }
            else {
                dispatch(getVentasMensuales({ anio: currentYear.format("YYYY") }));
            }
        }

    }, [locales])

    useEffect(() => {
        if ((selectedAnio || selectedLocal)) {
            if (esUsuarioEspecifico) {
                dispatch(getVentasMensuales({ anio: selectedAnio, local: localAsignado }));
            } else {
                console.log(selectedAnio, selectedLocal);
                if (selectedLocal === "general") {
                    dispatch(getVentasMensuales({ anio: selectedAnio }));
                } else {
                    dispatch(getVentasMensuales({ anio: selectedAnio, local: selectedLocal })); // Admin puede elegir local
                }
            }
        }
    }, [selectedAnio, selectedLocal]);
    return (
        <Card>
            <ArgonBox py={3} px={3}>
                <ArgonTypography variant="h6" fontWeight="medium" gutterBottom>
                    Ventas Mensuales (Cantidad y Montos Totales)
                </ArgonTypography>

                {/* Filtro de año (visible para todos) */}

                <Select
                    options={years}
                    value={years.find(m => m.value === selectedAnio)}
                    placeholder="Selecciona un año"
                    onChange={(selectedOption) => setSelectedAnio(selectedOption.value)}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                    menuPortalTarget={document.body}
                    isSearchable
                />


                {/* Filtro de local (solo visible para administradores) */}
                {!esUsuarioEspecifico && (
                    <Select
                        options={localOptions}
                        value={localOptions.find(o => o.value === selectedLocal)}
                        placeholder="Selecciona un local"
                        onChange={(selectedOption) => {
                            console.log(selectedOption)
                            setSelectedLocal(selectedOption.value)
                        }}
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            container: (provided) => ({
                                ...provided,
                                margin: "5% 0% 5% 0%",
                            }),
                        }}
                        menuPortalTarget={document.body}
                        isSearchable
                        isLoading={loadingLocales}
                    />
                )}
                {loadingVentasMens ? (
                    <CircularProgress />
                ) : (
                    <Grid container rowSpacing={2} columnSpacing={2} >
                        <Grid item xs={12} md={12} lg={6} >
                            <ResponsiveContainer width="90%" height={350}>
                                <LineChart
                                    data={ventasMens || []}
                                    margin={{ top: 20, right: 20, left: 20, bottom: 30 }}
                                >
                                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                    <XAxis
                                        dataKey="mes"
                                        label={{
                                            value: "Mes",
                                            position: "insideBottom",
                                            offset: -10, fontSize: "14px"
                                        }}
                                        tick={{ fontSize: 14 }}
                                    />
                                    <YAxis
                                        label={{
                                            value: "Cantidad",
                                            angle: -90, position: "insideLeft",
                                            fontSize: "14px",
                                            offset: 5
                                        }}
                                        tick={{ fontSize: 14 }}
                                    />
                                    <Tooltip />
                                    <Legend verticalAlign="top" wrapperStyle={{ fontSize: "14px", color: "#333" }} />

                                    <Line type="monotone" dataKey="total_ventas" name="Número de ventas" stroke="#8884d8" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Grid>
                        <Grid item xs={12} md={12} lg={6} >
                            <ResponsiveContainer width="90%" height={350}>
                                <LineChart
                                    data={ventasMens || []}
                                    margin={{ top: 20, right: 20, left: 20, bottom: 30 }}
                                >
                                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                    <XAxis
                                        dataKey="mes"
                                        label={{
                                            value: "Mes",
                                            position: "insideBottom",
                                            offset: -10, fontSize: "14px"
                                        }}
                                        tick={{ fontSize: 14 }}
                                    />
                                    <YAxis
                                        label={{
                                            value: "Monto",
                                            angle: -90, position: "insideLeft",
                                            fontSize: "14px",
                                            offset: 5
                                        }}
                                        tick={{ fontSize: 14 }}
                                    />
                                    <Tooltip />
                                    <Legend verticalAlign="top" wrapperStyle={{ fontSize: "14px", color: "#333" }} />

                                    <Line type="monotone" dataKey="total_monto_dursan" name="Total Ventas (Lps)" stroke="#8884d8" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Grid>


                    </Grid>

                )}

            </ArgonBox>
        </Card>
    );
}

export default CustomLineChart;
