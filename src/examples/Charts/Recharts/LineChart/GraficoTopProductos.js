// @mui material components
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";


import { getTopProductos } from "../../../../redux/dashboards/dashboards/actions";
import { getLocal } from "../../../../redux/mantenimientos/local/actions";

import moment from "moment";
import { TIPO_LOCAL } from "services/constantes";
import { CircularProgress } from "@mui/material";
import { PERMISOS } from "../../../../services/constantes";

function GraficoTopProductos() {
    const dispatch = useDispatch()

    const {


        loadingTopProds,
        topProds,

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


    const currentMonth = moment();

    const startMonth = moment();
    const months = Array.from({ length: 6 }, (_, i) => ({
        value: startMonth.clone().subtract(i, "months").format("YYYY-MM"),
        label: startMonth.clone().subtract(i, "months").format("MM-YYYY")
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

    const [selectedMes, setSelectedMes] = useState(months[0]?.value)
    const [selectedLocal, setSelectedLocal] = useState(esUsuarioEspecifico ? localAsignado : "")

    useEffect(() => {
        if (locales) {
            if (esUsuarioEspecifico) {
                dispatch(getTopProductos({ mes: currentMonth.format("YYYY-MM"), local: localAsignado }));
            }
            else {
                dispatch(getTopProductos({ mes: currentMonth.format("YYYY-MM") }));
            }
        }

    }, [locales])

    useEffect(() => {
        if ((selectedMes || selectedLocal)) {
            if (esUsuarioEspecifico) {
                dispatch(getTopProductos({ mes: selectedMes, local: localAsignado }));
            } else {
                console.log(selectedMes, selectedLocal);
                if(selectedLocal === "general"){
                    dispatch(getTopProductos({ mes: selectedMes }));
                } else {
                    dispatch(getTopProductos({ mes: selectedMes, local: selectedLocal })); // Admin puede elegir local
                }
            }
        }
    }, [selectedMes, selectedLocal]);

    return (
        <Card>
            <ArgonBox py={2} px={2}>
                <ArgonTypography variant="h6" fontWeight="medium" gutterBottom>
                    Productos más vendidos
                </ArgonTypography>

                {/* Filtro de mes (visible para todos) */}

                <Select
                    options={months}
                    value={months.find(m => m.value === selectedMes)}
                    placeholder="Selecciona un mes"
                    onChange={(selectedOption) => setSelectedMes(selectedOption.value)}
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



                {loadingTopProds ? (
                    <CircularProgress />
                ) :
                    (
                        <ResponsiveContainer width="100%" height={450}>
                            <ComposedChart data={topProds || []} margin={{ top: 20, right: 20, left: 20, bottom: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="producto" label={{ value: "Producto", position: "insideBottom", offset: -10, fontSize: "14px" }} tick={{ fontSize: 14 }} />
                                <YAxis label={{ value: "Cantidad", angle: -90, position: "insideLeft", fontSize: "14px", offset: 5 }} tick={{ fontSize: 14 }} />
                                <Tooltip />
                                <Legend verticalAlign="top" wrapperStyle={{ fontSize: "14px", color: "#333" }} />
                                {/* Barras para total vendido */}
                                <Bar dataKey="total_vendido" name="Total Vendido" fill="#8884d8" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}


            </ArgonBox>
        </Card>
    );
}

export default GraficoTopProductos;