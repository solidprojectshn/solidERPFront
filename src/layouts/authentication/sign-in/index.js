/**
=========================================================
* Argon Dashboard 2 MUI - v3.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-material-ui
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect, useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
import { Box, Typography } from '@mui/material'

// @mui material components
import Switch from "@mui/material/Switch";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";


// Authentication layout components
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";

//imagen login
import imagenLogin from "../../../assets/images/FondoLogin.png"

//Redux
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../../redux/auth/actions";

//Form 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod';
import { Button, CircularProgress, TextField } from "@mui/material";

// Definimos el esquema de validación del formulario

const formSchema = z.object({
  username: z.string().min(1, "Este campo es requerido"),
  password: z.string().min(1, "Este campo es requerido"),
})




function Illustration() {

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [cargando, setCargando] = useState(false)
  //definicion de las variables del reducer
  const {
    loading,
    isAuthenticated,
    error
  } = useSelector((store) => store.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm(
    {
      resolver: zodResolver(formSchema)
    }
  )


  const onSubmit = (data) => {
    // Llama a la acción de login y envía los datos del formulario
    setCargando(true)
    dispatch(login(data));
    reset();
  }

  // Si está autenticado, redirecciona a la página principal
  useEffect(() => {
    // Simulamos un tiempo de carga para mostrar el spinner
    setTimeout(() => {
      if (isAuthenticated) {
        setCargando(false)
        navigate("/dashboard")
      }
      if (error) {
        setCargando(false)
      }

    }, 2000);
  }, [isAuthenticated, error])

  return (
    <Box
      gap={5}
      sx={{
        display: 'flex',
        flexDirection : "row",
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: 2,
        backgroundColor:"#ffffff",
      }}
    >
      <Box
        display={"flex"}
        sx={{
          width:"60%",
          height:"100%"
        }}  
      >
        <Box
          component="img"
          src={imagenLogin}
          alt="Imagen Login"
          margin={"5%"}
          sx={{
            width: "100%",
            height: "85%",
            objectFit: "cover",
          }}
        />
      </Box>
      <Box
        className="container"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: 400,
          padding: 4,
          borderRadius: 3,
          boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.15)',
          backgroundColor: '#ffffff',
          textAlign: 'center',
          alignItems: 'center',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
          }
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 1, marginTop:2, fontWeight: 'bold', color: '#333' }}>
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Usuario"
            variant="outlined"
            fullWidth
            margin="normal"
            id="username"
            {...register("username")}
            error={errors.username}
            helperText={errors.username?.message}
            sx={{
              margin: '2 0 2 0',
              "& .MuiInputBase-root": {
                fontSize: "1.5rem", // Tamaño de la letra en el campo de texto
                color: "#888",
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.8rem", // Tamaño de la letra en la etiqueta
                color: "#888",
                position: "static", // Fija la posición para que no se mueva
                transform: "none", // Elimina cualquier transformación aplicada
                transition: "none", // Elimina la transición
                marginRight:33,
              },
              "& .MuiInputLabel-shrink": {
                transform: "none", // Evita el movimiento al activarse el estado 'shrink'
              },
              "& .MuiInputBase-input": {
                fontSize: "1rem",   // Tamaño del texto dentro del campo
                color: "#000",        // Color del texto que escribe el usuario
                padding: 0,      // Espaciado interno
                caretColor: "#888", // Color del cursor
                borderRadius: "5px",  // Bordes redondeados del área
              },
            }}
          />
          <TextField
            id="password"
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("password")}
            error={errors.password}
            helperText={errors.password?.message}
            sx={{
              margin: '2 0 2 0',
              "& .MuiInputBase-root": {
                fontSize: "1.5rem", // Tamaño de la letra en el campo de texto
                color: "#888",
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.8rem", // Tamaño de la letra en la etiqueta
                color: "#888",
                position: "static", // Fija la posición para que no se mueva
                transform: "none", // Elimina cualquier transformación aplicada
                transition: "none", // Elimina la transición
                marginRight:33,
              },
              "& .MuiInputLabel-shrink": {
                transform: "none", // Evita el movimiento al activarse el estado 'shrink'
              },
              "& .MuiInputBase-input": {
                fontSize: "1rem",   // Tamaño del texto dentro del campo
                color: "#000",        // Color del texto que escribe el usuario
                padding: 0,      // Espaciado interno
                caretColor: "#888", // Color del cursor
                borderRadius: "5px",  // Bordes redondeados del área
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={cargando}
            sx={{
              marginTop: 2,
              paddingY: 1.5,
              borderRadius: 2,
              backgroundColor: '#6a8173',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#bea38e',
              },
            }}
          >
             {(cargando) && (
                <CircularProgress />
              )}
            Iniciar Sesión
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default Illustration;
