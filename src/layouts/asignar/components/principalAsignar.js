import React, { useState, useMemo } from 'react';
import { Box, Typography, Radio, FormControlLabel, RadioGroup, TextField, Button, Checkbox } from '@mui/material';
import { styled } from '@mui/system';
import { MaterialReactTable } from 'material-react-table';
import FormAsignar from './formAsignar';

const EncabezadoPrincipal = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'start',
    width: '100%',
    height: '5vh',
    backgroundColor: '#424242',
    fontFamily: '"Montserrat", sans-serif',
    fontWeight: 'bold',
}));

const BoxUno = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    width: '98%',
    height: 'auto',
    margin: '2% 2% 1% 2%',
    border: '1px solid #424242',
    borderRadius: '4px',
    padding: '1%',
    backgroundColor:'#ffffff',
    [theme.breakpoints.down('sm')]: { // Ajusta para pantallas pequeñas
        padding: '2%', // Aumenta el padding
        margin: '1%',
    },
}));

const TituloBoxUno = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    width: '95%',
    height: 'auto',
    margin: '0.5%',
    fontFamily: '"Montserrat", sans-serif',
}));

const SelectBoxUno = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '99%',
    height: 'auto',
    margin: '0.5%',
    borderRadius: '8px',
    backgroundColor: '#fff',
    border: '1px solid #424242',
    [theme.breakpoints.down('sm')]: { // Ajusta para pantallas pequeñas
        flexDirection: 'column', // Cambia a columna en pantallas pequeñas
    },
}));

const CustomRadio = styled(Radio)(({ theme }) => ({
    '&.Mui-checked': {
        color: '#FFA500',
    },
    '&.Mui-checked:hover': {
        backgroundColor: 'rgba(255, 165, 0, 0.08)',
    },
    '& .MuiSvgIcon-root': {
        borderRadius: '50%',
    },
}));

//estilos segunda sección
const BoxDos = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '98%',
    height: 'auto',
    backgroundColor: '#fff',
    border: '1px solid #424242',
    borderRadius: '4px',
    [theme.breakpoints.down('sm')]: { 
        flexDirection: 'column', 
    },
}));

const BoxSelects = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '33%',
    height: '7%',
    margin:'1%',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        width:'98%'
    },
}));

const TituloSeccionDos = styled(Box)(({theme}) => ({
    width: '98%',
    height: '30%',
    margin:'1%',
}));

const DataSeccionDos = styled(Box)(({theme}) => ({
    width: '98%',
    height: '70%',
    margin:'1%',
}));

const CustomSelect = styled('select')(({ theme }) => ({
    border: '1px solid #6a6a6a',
    borderRadius: '5px',
    width: '100%',
    height: '7.2vh',
    color: '#000000',
    fontSize: 'small',
    fontWeight: 'bold',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        width:'98%'
    },
}));

//estilos tercera seccion
const BoxTres = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems:'start',
    width: '98%',
    height: 'auto',
    margin: '1% 2% 1% 2%',
    border: '1px solid #424242',
    borderRadius: '4px',
    padding: '1%',
    backgroundColor:'#ffffff',
    [theme.breakpoints.down('sm')]: { // Ajusta para pantallas pequeñas
        padding: '2%', // Aumenta el padding
        margin: '1%',
    },
}));

const BoxProducto = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '98%',
    height: 'auto',
    margin:'-1% 0% 0% 0%',
    [theme.breakpoints.down('sm')]: { 
        flexDirection: 'column',
        padding: '2%', 
        margin: '1%',
    },
}));

const BtnBuscar = styled(Button)(({ theme }) => ({
    width: '15%',
    height: 'auto',
    backgroundColor: '#333333',
    alignContent:'center',
    color: '#ffffff',
    borderRadius: '5px',
    '&:hover': {
        backgroundColor: '#333333',
        color:'#ffffff'
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%', // Ancho completo en pantallas pequeñas
        marginTop:'1%'
    },
}));

const BoxTabla = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'start',
    width: '98%',
    marginTop: '2vh',
    marginBottom: '2vh',
}));

const BtnGuardar = styled(Button)(({ theme }) => ({
    width: '98%',
    margin: '0.5vh',
    height: '8vh',
    backgroundColor: '#000000',
    color: '#ffffff',
    borderRadius: '5px',
    '&:hover': {
        backgroundColor: '#333333',
        color: '#ffffff',
    },
}));


const PrincipalAsignar = ({ cantidad, onChange }) => {

    //radio button
    const [value, setValue] = useState('option1');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    //dialogo
    const [openDialog, setOpenDialog] = useState(false); // Estado para controlar el diálogo

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    //tabla dialogo
    const handleAgregar = ()=>{
        //logica para agregar y seleccionar productos
    };


    //tabla
    const [selectedRows, setSelectedRows] = useState([]);

    const handleSelect = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const columns = useMemo(() => [
        {
            header: 'ID',
            accessorKey: 'id',
            muiTableHeadCellProps: {
                sx: {
                    width: '40vw',
                    height: '7vh',
                    padding: '10vh',
                },
            },
            muiTableBodyCellProps: {
                sx: {
                    width: '40vw',
                    height: '7vh',
                    padding: '10vh',
                },
            },
        },
        {
            header: 'Número de serie',
            accessorKey: 'numeroSerie', 
            muiTableHeadCellProps: {
                sx: {
                    width: '40vw',
                    height: '7vh',
                    padding: '10vh',
                },
            },
            muiTableBodyCellProps: {
                sx: {
                    width: '40vw',
                    height: '7vh',
                    padding: '10vh',
                },
            },
        },
        {
            header: 'Seleccionar',
            id: 'seleccion',
            Cell: ({ row }) => (
                <Checkbox
                    checked={selectedRows.includes(row.original.id)}
                    onChange={() => handleSelect(row.original.id)}
                />
            ),
        },
    ], [selectedRows]);

    return (
        <>
            <EncabezadoPrincipal />
            <BoxUno>
                <TituloBoxUno>
                    <Typography variant='h6' sx={{ color: '#a6a6a6', fontSize: 'small' }}>
                        Tipo De Asignación
                    </Typography>
                </TituloBoxUno>
                <SelectBoxUno>
                    <RadioGroup 
                        value={value}
                        onChange={handleChange}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            paddingLeft: '2%',
                            margin: '0.5% 0.5% 0.5% 1%',
                            width: '100%',
                            // Cambia la dirección en pantallas pequeñas
                            flexDirection: {
                                xs: 'column',  // Para pantallas extra pequeñas
                                sm: 'row',     // Para pantallas pequeñas y superiores
                            },
                            justifyContent:{
                                xs:'end',
                                sm:'start'
                            }
                        }}
                    >
                        {['option1', 'option2', 'option3'].map((option) => (
                            <FormControlLabel
                                key={option}
                                value={option}
                                control={<CustomRadio />}
                                label={option === 'option1' ? 'Tienda' : option === 'option2' ? 'Supervisor' : 'Puntos Estacionario'}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'start',
                                    padding: '0.5% 0.5% 0.5% 1%',
                                    '& .MuiTypography-root': { 
                                        color: '#a0a0a0', 
                                        fontSize: 'small', 
                                        fontWeight: 'bold', 
                                    },
                                    '& .Mui-checked + .MuiTypography-root': {
                                        color: '#424242',
                                    },
                                }}
                            />
                        ))}
                    </RadioGroup>
                </SelectBoxUno>
            </BoxUno>
            <BoxDos>
                <BoxSelects>
                    <TituloSeccionDos>
                        <Typography 
                            variant='h6'
                            sx={{
                                color: '#a6a6a6',
                                fontSize: 'small',
                                marginLeft:'1%',
                                fontWeight: 'bold',
                            }}
                        >
                            Origen
                        </Typography>
                    </TituloSeccionDos>
                    <DataSeccionDos>
                        <TextField
                            disabled
                            variant='outlined'
                            defaultValue='Tienda origen'
                            inputProps={{
                                sx:{
                                    color: '#000000',
                                    fontSize: 'small',
                                    fontWeight:'bold',
                                }
                            }}
                            sx={{
                                width:'100%',
                                border: '1px solid #6a6a6a',
                                borderRadius: '5px',
                            }}
                        />
                    </DataSeccionDos>
                </BoxSelects>
                <BoxSelects>
                    <TituloSeccionDos>
                        <Typography
                            variant='h6'
                            sx={{
                                color: '#a6a6a6',
                                fontSize: 'small',
                                marginLeft:'1%',
                                fontWeight: 'bold',
                            }}
                        >
                            Destino
                        </Typography>
                    </TituloSeccionDos>
                    <DataSeccionDos>
                        <CustomSelect>
                            <option></option>
                            <option>producto uno</option>
                            <option>producto dos</option>
                        </CustomSelect>
                    </DataSeccionDos>
                </BoxSelects>
                <BoxSelects>
                    <TituloSeccionDos>
                        <Typography
                            variant='h6'
                            sx={{
                                color: '#a6a6a6',
                                fontSize: 'small',
                                marginLeft:'1%',
                                fontWeight: 'bold',
                            }}
                        >
                            Supervisor
                        </Typography>
                    </TituloSeccionDos>
                    <DataSeccionDos>
                        <CustomSelect>
                            <option></option>
                            <option>supervisor uno</option>
                            <option>supervisor dos</option>
                        </CustomSelect>
                    </DataSeccionDos>
                </BoxSelects>
            </BoxDos>
            <BoxTres>
                <TituloSeccionDos>
                    <Typography
                        variant='h6'
                        sx={{
                            color: '#a6a6a6',
                            fontSize: 'small',
                            marginLeft:'1%',
                            fontWeight: 'bold',
                        }}
                    >
                        Producto
                    </Typography>
                </TituloSeccionDos>
                <DataSeccionDos>
                    <BoxProducto>
                        <TextField
                            disabled
                            variant='outlined'
                            defaultValue=''
                            inputProps={{
                                sx:{
                                    color: '#000000',
                                    fontSize: 'small',
                                    fontWeight:'bold',
                                }
                            }}
                            sx={{
                                width: {
                                    xs: '100%', // Pantallas extra pequeñas (teléfonos móviles)
                                    sm: '80%',  // Pantallas pequeñas (tabletas)
                                    md: '60%',  // Pantallas medianas (tabletas más grandes, laptops pequeñas)
                                    lg: '80%',  // Pantallas grandes (laptops)
                                    xl: '40%',  // Pantallas extra grandes (monitores grandes)
                                },
                                border: '1px solid #6a6a6a',
                                borderRadius: '5px',
                            }}
                        />
                        <BtnBuscar onClick={handleOpenDialog}>Seleccionar</BtnBuscar>
                    </BoxProducto>
                </DataSeccionDos>
                <TituloSeccionDos>
                    <Typography
                        variant='h6'
                        sx={{
                            color: '#a6a6a6',
                            fontSize: 'small',
                            marginLeft:'1%',
                            fontWeight: 'bold',
                        }}
                    >
                        Cantidad
                    </Typography>
                </TituloSeccionDos>
                <DataSeccionDos>
                    <TextField
                        type="number"
                        onChange={onChange}
                        value={cantidad}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        fullWidth
                        inputProps={{
                            min: 0,
                        }}
                        sx={{
                            width:'95%',
                            margin:'-1% 0% 0% 1.1%',
                            borderRadius: '5px',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#6a6a6a',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#000',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#000',
                                },
                            },
                            '& .MuiInputBase-input': {
                                color: '#6a6a6a',
                                fontWeight: 'bold',
                                fontSize: 'small',
                            },
                        }}
                    />
                </DataSeccionDos>
            </BoxTres>
            <FormAsignar open={openDialog} onClose={handleCloseDialog} handleAgregar={handleAgregar} />
            <BoxTabla>
                <MaterialReactTable columns={columns} data={[]} enableRowSelection={false} />
            </BoxTabla>
            <BtnGuardar>Guardar</BtnGuardar>
        </>
    );
};

export default PrincipalAsignar;
