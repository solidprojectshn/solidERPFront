import React from "react";
import HomeCarousel from "./component/home";
import DashboardNavbar from '../../examples/Navbars/DashboardNavbarCopy';
import styled from "@emotion/styled";
import { CssBaseline, Box,Typography, TextField} from "@mui/material";

//estilos nav
const BoxNav = styled(Box)(({theme}) => ({
  display:'flex',
  flexDirection:'row',
  backgroundColor:'#6a8173', 
  width:'100%',
  height:'20vh',
  padding:'1.5%'
}));

const BoxContenido = styled(Box)(({theme}) => ({
  display:'flex',
  flexDirection:'column',
  backgroundColor:'#ffffff', 
  width:'80%',
  height:'80vh',
  padding:'1.5%',
  justifyContent:'start',
  alignItems:'center'
}));

function App() {
  return (
    <div>
      <CssBaseline/>
      <BoxNav>
          <DashboardNavbar/> 
      </BoxNav>
      <BoxContenido>
          <HomeCarousel />
      </BoxContenido>
    </div>
  );
}

export default App;
