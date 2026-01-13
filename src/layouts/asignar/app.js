import React from 'react';
import { Box, CssBaseline, Container } from '@mui/material';
import DashboardNavbar from '../../examples/Navbars/DashboardNavbar'; // Importa el DashboardNavbar
import PrincipalAsignar from './components/principalAsignar';

function App() {
    return (
        <>
            <CssBaseline /> 
            <DashboardNavbar absolute={false} light={false} isMini={false} />
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection:'column',
                        justifyContent: 'start',
                        alignItems: 'center',
                    }}
                >
                    <PrincipalAsignar />
                </Box>
        </>
    );
}

export default App;
