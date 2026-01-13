import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useMemo, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { PERMISOS, TIPO_LOCAL } from '../../../../services/constantes';
import { getExistencias } from '../../../../redux/inventario/verExistencias/actions';
import { getLocal } from '../../../../redux/mantenimientos/local/actions';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6666'];

const StockCharts = () => {
    const dispatch = useDispatch();
    const { user, permissions } = useSelector((store) => store.auth);
    const { existencias } = useSelector((store) => store.existencias);
    const { loading: loadingLocales, locales } = useSelector((store) => store.local);

    const tienePermisoEspecifico = permissions.includes(PERMISOS.ACCEDER_DASHBOARD_ESPECIFICO);
    const localAsignado = user?.local_id || 0; // Local del usuario específico

    useEffect(() => {
        dispatch(getLocal({ nombre_tipo_local: TIPO_LOCAL.TIENDA }));
    }, [dispatch]);

    useEffect(() => {
        if (tienePermisoEspecifico) {
            dispatch(getExistencias({ tipo_local: TIPO_LOCAL.TIENDA, local: localAsignado })); 
        } else {
            dispatch(getExistencias()); // Admin puede elegir local
        }

    }, [dispatch, tienePermisoEspecifico, localAsignado]);
    
    console.log("Datos de existencias:", existencias);
    
    // Agrupar stock por local
    const pieData = useMemo(() => {
        if (!existencias) return [];
        
        const stockPorLocal = existencias.reduce((acc, { local, stock }) => {
            if (!local?.nombre || stock <= 0) return acc;
            
            acc[local.nombre] = (acc[local.nombre] || 0) + stock;
            return acc;
        }, {});

        return Object.entries(stockPorLocal).map(([nombre, stock], index) => ({
            name: nombre,
            value: stock,
            color: COLORS[index % COLORS.length],
        }));
    }, [existencias]);

    // Agrupar stock por categoría de producto
    const barData = useMemo(() => {
        if (!existencias) return [];
        
        const stockPorCategoria = existencias.reduce((acc, { categoria, stock }) => {
            if (!categoria || stock <= 0) return acc;
            
            acc[categoria] = (acc[categoria] || 0) + stock;
            return acc;
        }, {});

        return Object.entries(stockPorCategoria).map(([categoria, stock]) => ({
            categoria,
            stock
        }));
    }, [existencias]);

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {!tienePermisoEspecifico && (
                <>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        Distribución de Stock por Local
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </>
            )}
            {tienePermisoEspecifico && (
                <>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        Distribución de Stock por Categoría
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData} margin={{ top: 20, right: 20, left: 20, bottom: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="categoria" tick={{ fontSize: 14 }} />
                            <YAxis tick={{ fontSize: 14 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="stock" fill="#82ca9d" barSize={60} />
                        </BarChart>
                    </ResponsiveContainer>
                </>
            )}
        </Box>
    );
};

export default StockCharts;
