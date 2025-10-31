import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Stack,
    Typography,
    IconButton,
    Tooltip,
    Button,
    Divider,
    Card,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import CategoryIcon from "@mui/icons-material/CategoryRounded";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import ConfirmDialog from "../../../../components/common/ConfirmDialog";
import { getCategories, deleteCategory } from "../api/categories.api";
import { categoryListStyles } from "../styles/categoryList.styles";

/**
 * Responsive Category List:
 * - DataGrid for desktop
 * - Card layout for mobile
 */
const CategoryList = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

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
    // Columns for DataGrid
    // ==============================
    const columns = useMemo(
        () => [
            { field: "id", headerName: "ID", width: 80, align: "center", headerAlign: "center" },
            { field: "name", headerName: "Nombre", flex: 1, minWidth: 160 },
            {
                field: "description",
                headerName: "Descripción",
                flex: 2,
                minWidth: 200,
                renderCell: (params) => params.value || "—",
            },
            {
                field: "actions",
                headerName: "Acciones",
                sortable: false,
                width: 150,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Editar" arrow>
                            <IconButton
                                size="small"
                                color="secondary"
                                onClick={() =>
                                    navigate(`/products/categories/edit/${params.row.id}`)
                                }
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Eliminar" arrow>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                    setSelectedCategory(params.row);
                                    setConfirmOpen(true);
                                }}
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

    // ==============================
    // Render
    // ==============================
    return (
        <>
            <Stack spacing={3} sx={categoryListStyles.container}>
                {/* === Header === */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    sx={categoryListStyles.header}
                >
                    <Typography variant="h4" sx={categoryListStyles.title}>
                        Categorías de productos
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/products/categories/create")}
                        sx={categoryListStyles.addButton}
                    >
                        Nueva categoría
                    </Button>
                </Stack>

                <Divider sx={categoryListStyles.divider} />

                {/* === Responsive layout === */}
                {isSmall ? (
                    <Stack spacing={2}>
                        {rows.length > 0 ? (
                            rows.map((c) => (
                                <Card key={c.id} sx={categoryListStyles.mobileCard}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <CategoryIcon color="primary" />
                                        <Typography sx={categoryListStyles.mobileTitle}>
                                            {c.name}
                                        </Typography>
                                    </Stack>
                                    <Typography sx={categoryListStyles.mobileSubtitle}>
                                        {c.description || "Sin descripción"}
                                    </Typography>
                                    <Stack direction="row" spacing={1} mt={1}>
                                        <IconButton
                                            color="secondary"
                                            onClick={() =>
                                                navigate(`/products/categories/edit/${c.id}`)
                                            }
                                            sx={categoryListStyles.actionButton}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => {
                                                setSelectedCategory(c);
                                                setConfirmOpen(true);
                                            }}
                                            sx={categoryListStyles.actionButton}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                </Card>
                            ))
                        ) : (
                            <Typography sx={categoryListStyles.emptyMessage}>
                                No hay categorías registradas.
                            </Typography>
                        )}
                    </Stack>
                ) : (
                    <Box sx={categoryListStyles.dataGridContainer}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            loading={loading}
                            disableRowSelectionOnClick
                            disableColumnMenu
                            density="comfortable"
                            getRowId={(r) => r.id}
                            autoHeight
                            pageSizeOptions={[10, 25, 50, 100]}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 25 } },
                            }}
                            localeText={{
                                ...esES.components.MuiDataGrid.defaultProps.localeText,
                                noRowsLabel: "No hay registros",
                                MuiTablePagination: {
                                    labelRowsPerPage: "Filas por página:",
                                    labelDisplayedRows: ({ from, to, count }) =>
                                        `${from}–${to} de ${count !== -1 ? count : `más de ${to}`
                                        }`,
                                },
                            }}
                            sx={categoryListStyles.dataGrid}
                        />
                    </Box>
                )}
            </Stack>

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={confirmOpen}
                title="Eliminar categoría"
                message={
                    selectedCategory
                        ? `¿Seguro que deseas eliminar "${selectedCategory.name}"?`
                        : "¿Confirmar eliminación?"
                }
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                confirmText="Eliminar"
                cancelText="Cancelar"
                confirmColor="error"
            />
        </>
    );
};

export default CategoryList;
