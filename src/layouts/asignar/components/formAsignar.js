import {Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, TextField} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { useMemo } from 'react';

const FormAsignar = ({ open, onClose, handleAgregar })=>{

    const columns = useMemo(() => [
        {
            header:'ID',
            accessorKey: 'id',
        },
        {
            header:'Producto',
            accessorKey: 'producto',
        },
        {
            header:'Stock',
            accessorKey: 'stock',
        },
        {
            header:'Cantidad',
            accessorKey: 'cant',
            Cell: ({row}) => (
                <TextField
                    type="number"
                    variant="outlined"
                    size="small"
                    defaultValue={row.original.cant || 1}
                    inputProps={{ min: 0 }}
                    onChange={(e) => row.original.cant = e.target.value}
                />
            )
        },
        {
            header:'Accion',
            accessorKey: 'acciones',
            Cell: ({row}) => (
                <Button
                    variant="contained" 
                    onClick={() => handleAgregar(row.original)}
                    sx={{
                        backgroundColor:'#333333'
                    }}
                >
                    Agregar
                </Button>
            )
        },

    ],[handleAgregar]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle margin={1}> {'Seleccionar Producto'} </DialogTitle>
            <DialogContent>
                <Typography variant="h6" gutterBottom marginLeft={1}>
                    {'Selecciona el producto que deseas asignar'}
                </Typography>
                <MaterialReactTable columns={columns} data={[]} />

            </DialogContent>
        </Dialog>
    );    
}

export default FormAsignar;