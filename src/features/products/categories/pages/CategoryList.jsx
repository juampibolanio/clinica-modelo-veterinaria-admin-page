import { useEffect, useState } from "react";
import {
    Box,
    Stack,
    Typography,
    IconButton,
    Tooltip,
    Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { getCategories, deleteCategory } from "../api/categories.api";
import ConfirmDialog from "../../../../components/common/ConfirmDialog";

const CategoryList = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setRows(data.content || []);
        } catch {
            enqueueSnackbar("Error al cargar categorías", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteCategory(selectedId);
            enqueueSnackbar("Categoría eliminada correctamente ✅", { variant: "success" });
            fetchCategories();
        } catch (error) {
            // 💡 Manejo específico del error de integridad referencial
            const backendMessage = error.response?.data?.message?.toLowerCase?.() || "";

            if (
                error.response?.status === 409 ||
                backendMessage.includes("foreign key") ||
                backendMessage.includes("llave foránea") ||
                backendMessage.includes("referida desde la tabla")
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

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "name", headerName: "Nombre", flex: 1 },
        { field: "description", headerName: "Descripción", flex: 2 },
        {
            field: "actions",
            headerName: "Acciones",
            width: 140,
            sortable: false,
            renderCell: (params) => (
                <>
                    <Tooltip title="Editar">
                        <IconButton onClick={() => navigate(`/products/categories/edit/${params.row.id}`)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                        <IconButton
                            color="error"
                            onClick={() => {
                                setSelectedId(params.row.id);
                                setConfirmOpen(true);
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
                    Categorías de Productos
                </Typography>
                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    onClick={() => navigate("/products/categories/create")}
                >
                    Nueva categoría
                </Button>
            </Stack>

            <DataGrid
                rows={rows}
                columns={columns}
                autoHeight
                loading={loading}
                disableRowSelectionOnClick
                pageSizeOptions={[10]}
                getRowId={(row) => row.id}
            />

            <ConfirmDialog
                open={confirmOpen}
                title="Confirmar eliminación"
                message="¿Deseas eliminar esta categoría?"
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />
        </Box>
    );
};

export default CategoryList;
