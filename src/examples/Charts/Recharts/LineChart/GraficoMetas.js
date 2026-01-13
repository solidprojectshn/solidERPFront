import Card from "@mui/material/Card";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getCumpMetas } from "../../../../redux/dashboards/dashboards/actions";
import { getLocal } from "../../../../redux/mantenimientos/local/actions";
import moment from "moment";
import { CircularProgress } from "@mui/material";
import { TIPO_LOCAL, PERMISOS } from "../../../../services/constantes";

function GraficoMetas() {
    const dispatch = useDispatch();

    const { loadingCumpMetas, cumpMetas } = useSelector((store) => store.dashboard);
    const { loading: loadingLocales, locales } = useSelector((store) => store.local);
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
        label: 'General (Supervisor)'
    });

    const [selectedMes, setSelectedMes] = useState(months[0]?.value)
    const [selectedLocal, setSelectedLocal] = useState(esUsuarioEspecifico ? localAsignado : "")


    useEffect(() => {
        if (locales) {
            if (esUsuarioEspecifico) {
                dispatch(getCumpMetas({ mes: currentMonth.format("YYYY-MM"), local: localAsignado }));
            }
            else {
                setSelectedLocal(locales?.[0]?.id_local)
                if(locales?.[0]?.id_local === "general"){
                    dispatch(getCumpMetas({ mes: selectedMes })); 
                } else{
                    dispatch(getCumpMetas({ mes: selectedMes, local: locales?.[0]?.id_local })); // Admin puede elegir local
                }            }
        }

    }, [locales])

    useEffect(() => {
        if ((selectedMes || selectedLocal)) {
            if (esUsuarioEspecifico) {
                dispatch(getCumpMetas({ mes: selectedMes, local: localAsignado }));
            } else {
                if(selectedLocal === "general"){
                    dispatch(getCumpMetas({ mes: selectedMes })); 
                } else{
                    dispatch(getCumpMetas({ mes: selectedMes, local: selectedLocal })); // Admin puede elegir local
                }
            }
        }
    }, [selectedMes, selectedLocal]);



    return (
        <ArgonBox py={2} px={2}>
            <ArgonTypography variant="h6" fontWeight="medium" gutterBottom>
                Cumplimiento de Metas por Local
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
                        setSelectedLocal(selectedOption.value)}}
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


            {loadingCumpMetas ? (
                <CircularProgress />
            ) : (
                <ResponsiveContainer width="100%" height={450}>
                    <ComposedChart
                        data={cumpMetas || []}
                        margin={{ top: 20, right: 20, left: 20, bottom: 30 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="tipo_producto_nombre"
                            label={{
                                value: "Tipo de Producto",
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
                        <Bar dataKey="total_vendido" name="Total Vendido" fill="#8884d8" barSize={60} />
                        <Line type="monotone" dataKey="meta" name="Meta" stroke="#82ca9d" strokeWidth={2} />
                    </ComposedChart>
                </ResponsiveContainer>
            )}
        </ArgonBox>
    );
}

export default GraficoMetas;
