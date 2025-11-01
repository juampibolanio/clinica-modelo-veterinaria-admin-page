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
    Card,
    useMediaQuery,
} from "@mui/material";
import { esES } from "@mui/x-data-grid/locales";
import { useTheme } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { getProducts, deleteProduct } from "../api/products.api";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import ProductFilters from "../components/ProductFilters";
import { productListStyles } from "../styles/productList.styles";

/**
 * Responsive product list with DataGrid for desktop and card layout for mobile.
 */
const ProductList = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [filters, setFilters] = useState({});
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Fetch products from backend
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

    useEffect(() => {
        fetchProducts(page, pageSize, filters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(0);
        fetchProducts(0, pageSize, newFilters);
    };

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

    const columns = useMemo(
        () => [
            { field: "id", headerName: "ID", width: 80, align: "center", headerAlign: "center" },
            { field: "name", headerName: "Nombre", flex: 1, minWidth: 180 },
            { field: "type", headerName: "Tipo", flex: 0.8, minWidth: 120 },
            {
                field: "stock",
                headerName: "Stock",
                width: 120,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => {
                    const stock = params.value;
                    return (
                        <Box sx={{ ...productListStyles.stockCell(stock), width: "100%" }}>
                            {stock === 0 && <ErrorOutlineIcon fontSize="small" />}
                            {stock > 0 && stock < 5 && <WarningAmberIcon fontSize="small" />}
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: stock < 5 ? 700 : 500,
                                    lineHeight: 1,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                {stock}
                            </Typography>
                        </Box>
                    );
                },
            },
            { field: "categoryName", headerName: "Categoría", flex: 1, minWidth: 150 },
            {
                field: "actions",
                headerName: "Acciones",
                sortable: false,
                width: 120,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                        alignItems="center"
                        sx={{ height: "100%" }}
                    >
                        <Tooltip title="Editar" arrow>
                            <IconButton
                                size="small"
                                color="secondary"
                                onClick={() => navigate(`/products/edit/${params.row.id}`)}
                                sx={productListStyles.actionButton}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar" arrow>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                    setSelectedProduct(params.row);
                                    setConfirmOpen(true);
                                }}
                                sx={productListStyles.actionButton}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                ),
            },
        ],
        [navigate]
    );

    return (
        <Stack spacing={3}>
            {/* Header */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                sx={{ mb: 2 }}
            >
                <Typography variant="h4" sx={productListStyles.title}>
                    Productos
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/products/create")}
                    sx={productListStyles.addButton}
                >
                    Nuevo producto
                </Button>
            </Stack>

            <Divider sx={productListStyles.divider} />

            {/* Filters */}
            <ProductFilters onApply={handleFilterChange} />

            {/* Low-stock alert */}
            {lowStockProducts.length > 0 && (
                <Alert severity="warning" sx={productListStyles.lowStockAlert}>
                    <Typography variant="body2">
                        Hay <strong>{lowStockProducts.length}</strong> producto(s) con bajo stock:{" "}
                        <strong>{lowStockProducts.map((p) => p.name).join(", ")}</strong>
                    </Typography>
                </Alert>
            )}

            {/* ✅ Responsive Table / Cards */}
            {isSmall ? (
                <Stack spacing={2}>
                    {rows.map((p) => (
                        <Card key={p.id} sx={productListStyles.mobileCard}>
                            <Typography sx={productListStyles.mobileTitle}>{p.name}</Typography>
                            <Typography sx={productListStyles.mobileSubtitle}>
                                {p.categoryName} — Tipo: {p.type}
                            </Typography>
                            <Typography sx={productListStyles.mobileMetadata}>
                                Stock:{" "}
                                <strong style={{ color: p.stock < 5 ? "red" : "inherit" }}>
                                    {p.stock}
                                </strong>
                            </Typography>
                            <Stack direction="row" spacing={1} mt={1}>
                                <IconButton
                                    color="secondary"
                                    onClick={() => navigate(`/products/edit/${p.id}`)}
                                    sx={productListStyles.actionButton}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={() => {
                                        setSelectedProduct(p);
                                        setConfirmOpen(true);
                                    }}
                                    sx={productListStyles.actionButton}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                        </Card>
                    ))}
                    {rows.length === 0 && (
                        <Typography sx={productListStyles.emptyMessage}>
                            No hay productos
                        </Typography>
                    )}
                </Stack>
            ) : (
                <Box sx={productListStyles.dataGridContainer}>
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
                        pageSizeOptions={[5, 10, 20, 50]}
                        loading={loading}
                        disableRowSelectionOnClick
                        density="comfortable"
                        getRowId={(r) => r.id}
                        localeText={{
                            ...esES.components.MuiDataGrid.defaultProps.localeText,
                            noRowsLabel: "No hay registros",
                            MuiTablePagination: {
                                labelRowsPerPage: "Filas por página:",
                                labelDisplayedRows: ({ from, to, count }) =>
                                    `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`,
                            },
                        }}
                    />
                </Box>
            )}

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
                confirmColor="error"
            />
        </Stack>
    );
};

export default ProductList;
