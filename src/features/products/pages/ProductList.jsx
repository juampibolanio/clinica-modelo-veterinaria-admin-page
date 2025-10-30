import { useEffect, useState, useMemo } from "react";
import {
    Box,
    Stack,
    Typography,
    IconButton,
    Tooltip,
    Button,
    Alert,
    Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { getProducts, deleteProduct } from "../api/products.api";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import ProductFilters from "../components/ProductFilters";

const ProductList = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [filters, setFilters] = useState({});
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // ==============================
    // Fetch products from backend
    // ==============================
    const fetchProducts = async (
        currentPage = page,
        currentSize = pageSize,
        currentFilters = filters
    ) => {
        try {
            setLoading(true);
            const data = await getProducts({
                page: currentPage,
                size: currentSize,
                sortBy: "name",
                direction: "asc",
                ...currentFilters,
            });

            const products = data?.content || [];
            setRows(products);
            setTotalElements(data?.totalElements || 0);

            const lowStock = products.filter((p) => p.stock < 5);
            setLowStockProducts(lowStock);
        } catch (err) {
            console.error(err);
            enqueueSnackbar("Error al cargar los productos", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    // Updated filters
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(0);
        fetchProducts(0, pageSize, newFilters);
    };

    // Delete product
    const handleConfirmDelete = async () => {
        if (!selectedProduct) return;
        try {
            await deleteProduct(selectedProduct.id);
            enqueueSnackbar("Producto eliminado correctamente", { variant: "success" });
            fetchProducts(0, pageSize, filters);
        } catch {
            enqueueSnackbar("Error al eliminar el producto", { variant: "error" });
        } finally {
            setConfirmOpen(false);
        }
    };

    // Load initial data
    useEffect(() => {
        fetchProducts(page, pageSize, filters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize]);

    // Table columns
    const columns = useMemo(
        () => [
            { field: "id", headerName: "ID", width: 80 },
            { field: "name", headerName: "Nombre", flex: 1 },
            { field: "type", headerName: "Tipo", flex: 1 },
            {
                field: "stock",
                headerName: "Stock",
                width: 110,
                renderCell: (params) => {
                    const stock = params.value;
                    const color =
                        stock === 0
                            ? "error.main"
                            : stock < 5
                                ? "warning.main"
                                : "text.primary";
                    const fontWeight = stock < 5 ? 700 : 400;
                    return <Typography sx={{ color, fontWeight }}>{stock}</Typography>;
                },
            },
            { field: "categoryName", headerName: "Categoría", flex: 1 },
            {
                field: "actions",
                headerName: "Acciones",
                sortable: false,
                width: 150,
                renderCell: (params) => (
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Editar">
                            <IconButton
                                size="small"
                                color="secondary"
                                onClick={() => navigate(`/products/edit/${params.row.id}`)}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                    setSelectedProduct(params.row);
                                    setConfirmOpen(true);
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                ),
            },
        ],
        [navigate]
    );

    // ==============================
    // Render
    // ==============================
    return (
        <Stack spacing={2}>
            {/* Header */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={1}
            >
                <Typography variant="h4" fontWeight={800}>
                    Productos
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/products/create")}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                    Nuevo producto
                </Button>
            </Stack>

            <Divider />

            {/* Filters */}
            <ProductFilters onApply={handleFilterChange} />

            {/* Low-stock alert */}
            {lowStockProducts.length > 0 && (
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                    Hay <b>{lowStockProducts.length}</b> producto(s) con bajo stock:{" "}
                    {lowStockProducts.map((p) => p.name).join(", ")}.
                </Alert>
            )}

            {/* DataGrid */}
            <Box sx={{ width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    rowCount={totalElements}
                    disableColumnMenu
                    paginationMode="server"
                    paginationModel={{ page, pageSize }}
                    onPaginationModelChange={(model) => {
                        setPage(model.page);
                        setPageSize(model.pageSize);
                    }}
                    pageSizeOptions={[5, 10, 20]}
                    loading={loading}
                    disableRowSelectionOnClick
                    density="compact"
                    getRowId={(r) => r.id}
                    sx={{
                        "& .MuiDataGrid-columnHeaders": { fontWeight: 700 },
                        "@media (max-width:600px)": {
                            "& .MuiDataGrid-cell--textLeft": { fontSize: "0.85rem" },
                        },
                    }}
                />
            </Box>

            {/* Confirm delete */}
            <ConfirmDialog
                open={confirmOpen}
                title="Eliminar producto"
                message={
                    selectedProduct
                        ? `¿Seguro que deseas eliminar el producto "${selectedProduct.name}"?`
                        : "¿Confirmar eliminación?"
                }
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                confirmText="Eliminar"
                cancelText="Cancelar"
            />
        </Stack>
    );
};

export default ProductList;
