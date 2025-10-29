import { useEffect, useState } from "react";
import {
    Box,
    Stack,
    Typography,
    IconButton,
    Tooltip,
    Button,
    Alert,
} from "@mui/material";
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
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [lowStockProducts, setLowStockProducts] = useState([]);

    // 🔹 Cargar productos desde el backend
    const fetchData = async (currentPage = page, currentSize = pageSize) => {
        try {
            setLoading(true);
            const data = await getProducts({
                page: currentPage,
                size: currentSize,
                sortBy: "name",
                direction: "asc",
            });

            const products = data.content || data;
            setRows(products);
            setTotalElements(data.totalElements || products.length);

            // Filtrar productos con stock bajo
            const lowStock = products.filter((p) => p.stock < 5);
            setLowStockProducts(lowStock);
        } catch (err) {
            console.error(err);
            enqueueSnackbar("Error al cargar los productos", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    // 🔁 Recargar al cambiar página o tamaño
    useEffect(() => {
        fetchData(page, pageSize);
    }, [page, pageSize]);

    const handleDelete = async () => {
        try {
            await deleteProduct(selectedId);
            enqueueSnackbar("Producto eliminado correctamente", { variant: "success" });
            fetchData(0, pageSize);
            setPage(0);
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
        {
            field: "stock",
            headerName: "Stock",
            width: 100,
            renderCell: (params) => {
                const stock = params.value;
                const color =
                    stock === 0 ? "red" : stock < 5 ? "orange" : "inherit";
                const fontWeight = stock < 5 ? 700 : 400;

                return (
                    <Typography color={color} fontWeight={fontWeight}>
                        {stock}
                    </Typography>
                );
            },
        },
        { field: "categoryName", headerName: "Categoría", flex: 1 },
        {
            field: "actions",
            headerName: "Acciones",
            width: 150,
            sortable: false,
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
            {/* Header */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Typography variant="h4" fontWeight={700}>
                    Productos
                </Typography>
                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    onClick={() => navigate("/products/create")}
                >
                    Nuevo Producto
                </Button>
            </Stack>

            {/* 🔔 Alerta de bajo stock */}
            {lowStockProducts.length > 0 && (
                <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                    Hay {lowStockProducts.length} producto(s) con bajo stock:{" "}
                    {lowStockProducts.map((p) => p.name).join(", ")}.
                </Alert>
            )}

            {/* Tabla con paginación de backend */}
            <DataGrid
                rows={rows}
                columns={columns}
                rowCount={totalElements}
                paginationMode="server"
                paginationModel={{ page, pageSize }}
                onPaginationModelChange={(model) => {
                    // MUI usa base 0 igual que Spring, así que es directo
                    setPage(model.page);
                    setPageSize(model.pageSize);
                }}
                pageSizeOptions={[5, 10, 20]}
                loading={loading}
                disableRowSelectionOnClick
                autoHeight
                getRowId={(row) => row.id}
            />

            {/* Confirmar eliminación */}
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
