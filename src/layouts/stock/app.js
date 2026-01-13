import React from 'react';
import { Box, styled } from '@mui/material';
import PrincipalStock from './components/principalStock';
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const Fondo = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: 'auto',
    justifyContent: 'start'
  }));

function App() {
    return (
        <DashboardLayout>
            <Fondo>
                <DashboardNavbar />
                <PrincipalStock />
            </Fondo>
        </DashboardLayout>
    );
}

export default App;
