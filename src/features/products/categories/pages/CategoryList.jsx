import { useEffect, useState, useMemo } from "react";
import {
    Box,
    Stack,
    Typography,
    IconButton,
    Tooltip,
    Button,
    Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { getCategories, deleteCategory } from "../api/categories.api";
import ConfirmDialog from "../../../../components/common/ConfirmDialog";

/**
 * CategoryList
 * Displays all product categories with edit and delete actions.
 */
const CategoryList = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // ==============================
    // Fetch categories
    // ==============================
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories();
            setRows(data.content || data || []);
        } catch (err) {
            console.error(err);
            enqueueSnackbar("Error al cargar categorías", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // ==============================
    // Handle category deletion
    // ==============================
    const handleConfirmDelete = async () => {
        if (!selectedCategory) return;

        try {
            await deleteCategory(selectedCategory.id);
            enqueueSnackbar("Categoría eliminada correctamente ✅", { variant: "success" });
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);

            // Detect referential integrity or constraint error
            const message = error.response?.data?.message?.toLowerCase?.() || "";
            if (
                error.response?.status === 409 ||
                message.includes("foreign key") ||
                message.includes("llave foránea") ||
                message.includes("referida desde la tabla")
            ) {
                enqueueSnackbar(
                    "No se puede eliminar esta categoría porque tiene productos asociados 🧩",
                    { variant: "warning" }
                );
            } else {
                enqueueSnackbar("Error al eliminar la categoría", { variant: "error" });
            }
        } finally {
            setConfirmOpen(false);
        }
    };

    // ==============================
    // DataGrid columns
    // ==============================
    const columns = useMemo(
        () => [
            { field: "id", headerName: "ID", width: 80 },
            { field: "name", headerName: "Nombre", flex: 1 },
            {
                field: "description",
                headerName: "Descripción",
                flex: 2,
                renderCell: (params) => params.value || "—",
            },
            {
                field: "actions",
                headerName: "Acciones",
                sortable: false,
                width: 140,
                renderCell: (params) => (
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Editar">
                            <IconButton
                                size="small"
                                color="secondary"
                                onClick={() =>
                                    navigate(`/products/categories/edit/${params.row.id}`)
                                }
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Eliminar">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                    setSelectedCategory(params.row);
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
                    Categorías de productos
                </Typography>

                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    onClick={() => navigate("/products/categories/create")}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                    Nueva categoría
                </Button>
            </Stack>

            <Divider />

            {/* Table */}
            <Box sx={{ width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    autoHeight
                    loading={loading}
                    disableRowSelectionOnClick
                    disableColumnMenu
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

            {/* Confirm dialog */}
            <ConfirmDialog
                open={confirmOpen}
                title="Confirmar eliminación"
                message={
                    selectedCategory
                        ? `¿Deseas eliminar la categoría "${selectedCategory.name}"?`
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

export default CategoryList;
