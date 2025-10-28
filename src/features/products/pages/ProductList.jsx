// src/modules/products/pages/ProductList.jsx
import { useEffect, useState } from "react";
import { Box, Stack, Typography, IconButton, Tooltip, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { getProducts, deleteProduct } from "../api/products.api";
import ConfirmDialog from "../../../components/common/ConfirmDialog";

const ProductList = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const fetchData = async () => {
        try {
            const data = await getProducts();
            setRows(data.content || []);
        } catch {
            enqueueSnackbar("Error al cargar los productos", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async () => {
        try {
            await deleteProduct(selectedId);
            enqueueSnackbar("Producto eliminado correctamente", { variant: "success" });
            fetchData();
        } catch {
            enqueueSnackbar("Error al eliminar el producto", { variant: "error" });
        } finally {
            setOpenConfirm(false);
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "name", headerName: "Nombre", flex: 1 },
        { field: "type", headerName: "Tipo", flex: 1 },
        { field: "stock", headerName: "Stock", width: 100 },
        { field: "categoryName", headerName: "Categoría", flex: 1 },
        {
            field: "actions",
            headerName: "Acciones",
            width: 150,
            renderCell: (params) => (
                <>
                    <Tooltip title="Editar">
                        <IconButton onClick={() => navigate(`/products/edit/${params.row.id}`)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                        <IconButton
                            color="error"
                            onClick={() => {
                                setSelectedId(params.row.id);
                                setOpenConfirm(true);
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </>
            ),
        },
    ];

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" fontWeight={700}>
                    Productos
                </Typography>
                <Button startIcon={<AddIcon />} variant="contained" onClick={() => navigate("/products/create")}>
                    Nuevo Producto
                </Button>
            </Stack>

            <DataGrid
                rows={rows}
                columns={columns}
                autoHeight
                loading={loading}
                pageSizeOptions={[10]}
                disableRowSelectionOnClick
                getRowId={(row) => row.id}
            />

            <ConfirmDialog
                open={openConfirm}
                title="Eliminar producto"
                message="¿Seguro que deseas eliminar este producto?"
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleDelete}
            />
        </Box>
    );
};

export default ProductList;
