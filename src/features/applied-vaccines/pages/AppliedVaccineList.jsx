import { useEffect, useState } from "react";
import {
    Box,
    Stack,
    Typography,
    Button,
    TextField,
    Paper,
    Pagination,
    Divider,
    CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
    listAppliedVaccines,
    deleteAppliedVaccine,
} from "../api/applied-vaccines.api";
import ConfirmDialog from "../../../components/common/ConfirmDialog";

/**
 * AppliedVaccineList
 * Displays all applied vaccines with filtering and pagination.
 */
const AppliedVaccineList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();

    // ==============================
    // State
    // ==============================
    const params = new URLSearchParams(location.search);
    const petIdFromQuery = params.get("petId");

    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [filters, setFilters] = useState({
        petId: petIdFromQuery || "",
        veterinarianId: "",
        productId: "",
        fromDate: "",
        toDate: "",
        page: 0,
        size: 10,
        sortBy: "date",
        direction: "desc",
    });

    // ==============================
    // Fetch data
    // ==============================
    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await listAppliedVaccines(filters);
            setPageData(data);
        } catch (err) {
            console.error("Error loading applied vaccines:", err);
            enqueueSnackbar("Error al cargar vacunas aplicadas", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [filters.page, filters.size, filters.sortBy, filters.direction]);

    // ==============================
    // Handlers
    // ==============================
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((f) => ({ ...f, [name]: value, page: 0 }));
    };

    const handleSearch = () => fetchData();

    const handleAskDelete = (id) => {
        setSelectedId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteAppliedVaccine(selectedId);
            enqueueSnackbar("Vacuna eliminada correctamente ✅", { variant: "success" });
            fetchData();
        } catch (err) {
            console.error("Error deleting applied vaccine:", err);
            enqueueSnackbar("Error al eliminar la vacuna", { variant: "error" });
        } finally {
            setConfirmOpen(false);
        }
    };

    // ==============================
    // Render
    // ==============================
    return (
        <Stack spacing={2}>
            {/* Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap">
                <Typography variant="h4" fontWeight={800}>
                    Vacunas aplicadas
                </Typography>

            </Stack>

            {/* Filters */}
            <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction="row" gap={2} flexWrap="wrap" alignItems="center">
                    <TextField
                        label="ID Mascota"
                        name="petId"
                        value={filters.petId}
                        onChange={handleFilterChange}
                        disabled={!!petIdFromQuery}
                        size="small"
                    />
                    <TextField
                        label="ID Veterinario"
                        name="veterinarianId"
                        value={filters.veterinarianId}
                        onChange={handleFilterChange}
                        size="small"
                    />
                    <TextField
                        label="ID Producto"
                        name="productId"
                        value={filters.productId}
                        onChange={handleFilterChange}
                        size="small"
                    />
                    <TextField
                        type="date"
                        label="Desde"
                        name="fromDate"
                        value={filters.fromDate}
                        onChange={handleFilterChange}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                    <TextField
                        type="date"
                        label="Hasta"
                        name="toDate"
                        value={filters.toDate}
                        onChange={handleFilterChange}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                    <Button variant="outlined" onClick={handleSearch}>
                        Aplicar
                    </Button>
                </Stack>
            </Paper>

            {/* Table */}
            <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Box sx={{ p: 2 }}>
                    {/* Table header */}
                    <Stack direction="row" sx={{ fontWeight: 700 }}>
                        <Box flex={1}>Fecha</Box>
                        <Box flex={1}>Mascota</Box>
                        <Box flex={1.5}>Producto (vacuna)</Box>
                        <Box flex={1.5}>Veterinario</Box>
                        <Box flex={2}>Observaciones</Box>
                        <Box width={180} textAlign="right">
                            Acciones
                        </Box>
                    </Stack>
                </Box>
                <Divider />

                {/* Table body */}
                {loading && (
                    <Box p={3} textAlign="center">
                        <CircularProgress size={28} />
                    </Box>
                )}

                {!loading && pageData?.content?.length === 0 && (
                    <Box p={2} textAlign="center" color="text.secondary">
                        No hay resultados disponibles.
                    </Box>
                )}

                {!loading &&
                    pageData?.content?.map((row) => (
                        <Box key={row.id}>
                            <Box
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    "&:hover": { backgroundColor: "action.hover" },
                                }}
                            >
                                <Box flex={1}>
                                    {row.date ? dayjs(row.date).format("DD/MM/YYYY") : "-"}
                                </Box>
                                <Box flex={1}>{row.petName || "—"}</Box>
                                <Box flex={1.5}>{row.productName || "—"}</Box>
                                <Box flex={1.5}>{row.veterinarianName || "—"}</Box>
                                <Box flex={2}>{row.observations || "—"}</Box>
                                <Box width={180} textAlign="right">
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            navigate(`/applied-vaccines/${row.id}`)
                                        }
                                    >
                                        Ver
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            navigate(`/applied-vaccines/${row.id}/edit`)
                                        }
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleAskDelete(row.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </Box>
                            </Box>
                            <Divider />
                        </Box>
                    ))}

                {/* Pagination */}
                {pageData && pageData.totalPages > 1 && (
                    <Stack alignItems="center" p={2}>
                        <Pagination
                            page={pageData.number + 1}
                            count={pageData.totalPages || 1}
                            onChange={(_, p) =>
                                setFilters((f) => ({ ...f, page: p - 1 }))
                            }
                        />
                    </Stack>
                )}
            </Paper>

            {/* Confirm delete dialog */}
            <ConfirmDialog
                open={confirmOpen}
                title="Eliminar vacuna aplicada"
                message="¿Estás seguro de eliminar esta vacuna aplicada? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </Stack>
    );
};

export default AppliedVaccineList;
