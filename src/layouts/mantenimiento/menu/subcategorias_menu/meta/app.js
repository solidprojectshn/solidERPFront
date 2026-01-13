import { React, Suspense, useMemo, useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayoutFb";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Typography, Box, Button, CircularProgress, IconButton, Alert } from "@mui/material";
import styled from "@emotion/styled";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { PERMISOS } from "../../../../../services/constantes";


//iconos
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


//api
import { getMeta, deleteMeta } from "../../../../../redux/mantenimientos/meta/actions";
import { deleteLocal } from "../../../../../redux/mantenimientos/local/actions";
import { deleteProducto } from "../../../../../redux/mantenimientos/producto/actions";
import { useDispatch, useSelector } from "react-redux";

// alertas
import swal from "sweetalert";

//import complementos
import MetaForm from "./components/metaForm";

const Fondo = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundImage: 'linear-gradient(to bottom, #43b399 50%, #ffffff 50%)',
    width: '100%',
    height: 'auto',
    justifyContent: 'start'
}));

const BoxNav = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#43b399',
    width: '100%',
    height: '20vh',
    padding: '1.5%'
}));

const BoxButton = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#43b399',
    width: '100%',
    height: '15vh',
    padding: '1.5%',
    justifyContent: 'end',
    alignItems: 'center'
}));

const ButtonAdd = styled(Button)(({ theme }) => ({
    width: '10%',
    height: '7vh',
    backgroundColor: '#43b399',
    border: '1px solid #ffffff'
}));

const BoxTabla = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    backgroundColor: '#ffffff',
    padding: '2%',
    boxShadow: theme.shadows[3]
}));

const app = () => {

    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editItem, setEditItem] = useState({});

    const {
        permissions: userPermissions
    } = useSelector((store) => store.auth);

    const {
        loading,
        saveLoading,
        metas,
        metaError,
    } = useSelector((store) => store.metas);

    useEffect(() => {
        dispatch(getMeta());
        console.log("Datos de metas:", metas);
    }, [])

    const handleAdd = () => {
        setShowModal(true);
        setIsEdit(false);
        setEditItem(null)
    }

    const handleEdit = (data, index) => {
        console.log(data, index)
        setEditItem({ data, index })
        setIsEdit(true);
        setShowModal(true);
    }

    const handleDelete = (data, index) => {
        console.log('Eliminar producto con ID:', data, index);
        const idAEliminar = data; // Aquí obtienes el id_meta
        console.log("ID a eliminar:", idAEliminar)
        swal({
            title: "¿Está seguro de eliminar este registro?",
            text: "Una vez que lo elimine no podrá recuperarlo.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    data.estado = false
                    data.tipo_producto_id = data.tipo_producto.id_tipo_producto
                    data.local_id = data.local.id_local
                    dispatch(deleteMeta(data, data.id_meta, index))
                }
            });
    };

    //table
    const columns = useMemo(() => [
        {
            header: 'Tipo Producto',
            accessorKey: 'tipo_producto.nombre',
        },
        {
            header: 'Local',
            accessorKey: 'local.nombre',
        },
        {
            header: 'Cantidad',
            accessorKey: 'cantidad',
        },
        {
            header: 'Acciones',
            accessorKey: 'acciones',
            Cell: ({ row }) => (
                <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                    {userPermissions.includes(PERMISOS.PERMISO_EDITAR) && (
                        <IconButton
                            color="primary"
                            onClick={() => handleEdit(row.original, row.index)}
                        >
                            <EditIcon />
                        </IconButton>
                    )}
                    {userPermissions.includes(PERMISOS.PERMISO_ELIMINAR) && (
                        <IconButton
                            color="secondary"
                            onClick={() => handleDelete(row.original, row.index)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    )}

                </Box>
            )
        },
    ]);

    // Configuración de la tabla
    const table = useMaterialReactTable({
        columns,
        data: metas,
        initialState: { density: "compact", pagination: { index: 0, pageSize: 5 } },
        paginationDisplayMode: "pages",
        enableColumnResizing: true,
        enableGrouping: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        positionToolbarAlertBanner: 'bottom',
        localization: MRT_Localization_ES,
        muiTableHeadProps: {
            sx: {
                padding: "0"
            }
        },

        muiTableContainerProps: {
            className: "mrt-container table-style",

        },
        muiBottomToolbarProps: {
            className: "table-bottom"
        },
        muiToolbarAlertBannerChipProps: { color: "primary" },
        muiSearchTextFieldProps: {
            size: "small",
            variant: "outlined",
        },
        muiPaginationProps: {
            color: "primary",
            rowsPerPageOptions: [5, 10, 15, 20],
            shape: "rounded",
            variant: "outlined",
            className: "pagination-selector"
        },
        muiTableBodyRowProps: {
            className: "filasTablaDark"
        },
        muiTopToolbarProps: {
            sx: {
                backgroundColor: "transparent"
            }
        },
        muiColumnActionsButtonProps: {
            className: "table-column-buttons"
        },
        muiTableFooterProps: {
            className: "table-footer-line"
        },
        state: {
            isLoading: loading,
            isSaving: saveLoading,
            showProgressBars: loading,
        },
    });

    return (
        <DashboardLayout>
            <Fondo>

                <BoxNav>
                    <DashboardNavbar absolute={false} light={true} isMini={false} />
                </BoxNav>
                <BoxButton onClick={handleAdd}>
                    {metaError && <Alert severity="error">{metaError}</Alert>}
                    <ButtonAdd>
                        <Typography
                            sx={{
                                fontSize: 'small',
                                color: '#ffffff'
                            }}
                        >
                            Agregar
                        </Typography>
                    </ButtonAdd>
                </BoxButton>
                <MetaForm initialData={editItem} isEdit={isEdit} setShowModal={setShowModal} showModal={showModal}></MetaForm>
                <BoxTabla>
                    <Box sx={{ maxHeight: '500px', overflowY: 'auto', width: '100%' }}>
                        <Suspense fallback={<CircularProgress />}>
                            <MaterialReactTable table={table} />
                        </Suspense>
                    </Box>
                </BoxTabla>
            </Fondo>
        </DashboardLayout>
    )
}

export default app;