import { useEffect, useState } from "react";
import {
    Box,
    Stack,
    Typography,
    Button,
    TextField,
    MenuItem,
    Paper,
    Pagination,
    Divider,
} from "@mui/material";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
    listAppliedVaccines,
    deleteAppliedVaccine,
} from "../api/applied-vaccines.api";
import ConfirmDialog from "../../../components/common/ConfirmDialog";

const AppliedVaccineList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();

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

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await listAppliedVaccines(filters);
            setPageData(data);
        } catch {
            enqueueSnackbar("Error al cargar vacunas aplicadas", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [filters.page, filters.size, filters.sortBy, filters.direction]);

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
            enqueueSnackbar("Vacuna eliminada correctamente", { variant: "success" });
            fetchData();
        } catch {
            enqueueSnackbar("Error al eliminar la vacuna", { variant: "error" });
        } finally {
            setConfirmOpen(false);
        }
    };

    return (
        <Stack spacing={2}>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h4" fontWeight={800}>
                    Vacunas Aplicadas
                </Typography>
            </Stack>

            {/* Filtros */}
            <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction="row" gap={2} flexWrap="wrap">
                    <TextField
                        label="ID Mascota"
                        name="petId"
                        value={filters.petId}
                        onChange={handleFilterChange}
                        disabled={!!petIdFromQuery}
                    />
                    <TextField
                        label="ID Veterinario"
                        name="veterinarianId"
                        value={filters.veterinarianId}
                        onChange={handleFilterChange}
                    />
                    <TextField
                        label="ID Producto"
                        name="productId"
                        value={filters.productId}
                        onChange={handleFilterChange}
                    />
                    <TextField
                        type="date"
                        label="Desde"
                        name="fromDate"
                        value={filters.fromDate}
                        onChange={handleFilterChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        type="date"
                        label="Hasta"
                        name="toDate"
                        value={filters.toDate}
                        onChange={handleFilterChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <Button variant="outlined" onClick={handleSearch}>
                        Aplicar
                    </Button>
                </Stack>
            </Paper>

            {/* Tabla */}
            <Paper sx={{ p: 0, borderRadius: 2, overflow: "hidden" }}>
                <Box sx={{ p: 2 }}>
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

                {loading && <Box p={2}>Cargando...</Box>}
                {!loading && pageData?.content?.length === 0 && (
                    <Box p={2}>Sin resultados</Box>
                )}

                {!loading &&
                    pageData?.content?.map((row) => (
                        <Box key={row.id}>
                            <Box
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Box flex={1}>
                                    {row.date ? dayjs(row.date).format("DD/MM/YYYY") : "-"}
                                </Box>
                                <Box flex={1}>{row.petName}</Box>
                                <Box flex={1.5}>{row.productName}</Box>
                                <Box flex={1.5}>{row.veterinarianName}</Box>
                                <Box flex={2}>{row.observations || "-"}</Box>
                                <Box width={180} textAlign="right">
                                    <Button
                                        size="small"
                                        onClick={() => navigate(`/applied-vaccines/${row.id}`)}
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

                {pageData && (
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

            {/* ConfirmDialog */}
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
