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


import { getTopLocales } from "../../../../redux/dashboards/dashboards/actions";

import moment from "moment";
import { TIPO_LOCAL } from "services/constantes";
import { CircularProgress } from "@mui/material";
import { PERMISOS } from "../../../../services/constantes";

function GraficoTopProductos() {
    const dispatch = useDispatch()

    const {


        loadingTopLocales,
        topLocales,
        topLocalesError,

    } = useSelector((store) => store.dashboard);


    /////////////////////////////////////////////////
    const { user, permissions } = useSelector((store) => store.auth);

    const esUsuarioEspecifico = permissions.includes(PERMISOS.ACCEDER_DASHBOARD_ESPECIFICO);


    const currentMonth = moment();

    const startMonth = moment();
    const months = Array.from({ length: 6 }, (_, i) => ({
        value: startMonth.clone().subtract(i, "months").format("YYYY-MM"),
        label: startMonth.clone().subtract(i, "months").format("MM-YYYY")
    }));


    const [selectedMes, setSelectedMes] = useState(months[0]?.value)

    useEffect(() => {
        if (months) {
            if (!esUsuarioEspecifico) {

                dispatch(getTopLocales({ mes: currentMonth.format("YYYY-MM") }));
            }
        }

    }, [])

    useEffect(() => {
        if ((selectedMes)) {
            if (esUsuarioEspecifico) {

            } else {
                dispatch(getTopLocales({ mes: selectedMes }))
            }
        }
    }, [selectedMes]);

    return (
        <Card>
            <ArgonBox py={2} px={2}>
                <ArgonTypography variant="h6" fontWeight="medium" gutterBottom>
                    Locales con más Ventas
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


                {loadingTopLocales ? (
                    <CircularProgress />
                ) :
                    (
                        <ResponsiveContainer width="100%" height={250}>
                            <ComposedChart data={topLocales || []} margin={{ top: 20, right: 20, left: 20, bottom: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="local_nombre" label={{ value: "Local", position: "insideBottom", offset: -10, fontSize: "14px" }} tick={{ fontSize: 14 }} />
                                <YAxis label={{ value: "Cantidad", angle: -90, position: "insideLeft", fontSize: "14px", offset: 5 }} tick={{ fontSize: 14 }} />
                                <Tooltip />
                                <Legend verticalAlign="top" wrapperStyle={{ fontSize: "14px", color: "#333" }} />
                                {/* Barras para total vendido */}
                                <Bar dataKey="total_ventas" name="Total Vendido" fill="#8884d8" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}


            </ArgonBox>
        </Card>
    );
}

export default GraficoTopProductos;