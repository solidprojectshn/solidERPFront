import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { useMemo, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { PERMISOS, TIPO_LOCAL } from '../../../../services/constantes';
import { getExistencias } from '../../../../redux/inventario/verExistencias/actions';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6666'];

const StockPieChart = () => {
    const dispatch = useDispatch();
    const { permissions } = useSelector((store) => store.auth);
    const { existencias } = useSelector((store) => store.existencias);

    useEffect(() => {
        dispatch(getExistencias({ tipo_local: TIPO_LOCAL.TIENDA}));
    }, [dispatch]);

    const tienePermisoEspecifico = permissions.includes(PERMISOS.ACCEDER_DASHBOARD_ESPECIFICO);
    
    if (tienePermisoEspecifico) return null;
    
    console.log("Datos de existencias:", existencias);
    
    // Agrupar stock por local
    const data = useMemo(() => {
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

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Distribución de Stock por Local
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default StockPieChart;
