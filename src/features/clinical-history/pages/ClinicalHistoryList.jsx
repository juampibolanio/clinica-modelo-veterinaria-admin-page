import React, { useEffect, useState, useMemo, useRef } from "react";
import {
    Box,
    Stack,
    Typography,
    TextField,
    IconButton,
    Tooltip,
    MenuItem,
    Button,
    Divider,
    Card,
    FormControl,
    InputLabel,
    Select,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/VisibilityRounded";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/NoteAddRounded";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import {
    listClinicalHistory,
    deleteClinicalHistory,
} from "../api/clinical-history.api";
import { CONSULTATION_TYPES } from "../constants/consultation-types";
import { clinicalHistoryListStyles } from "../styles/clinicalHistoryList.styles";

const ClinicalHistoryList = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [filters, setFilters] = useState({
        consultationType: "",
        fromDate: "",
        toDate: "",
        keyword: "",
    });

    const debounceRef = useRef(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await listClinicalHistory({ ...filters, page: 0, size: 100 });
            setRows(Array.isArray(data?.content) ? data.content : []);
        } catch {
            enqueueSnackbar("Error al cargar historias clínicas", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(fetchData, 400);
        return () => clearTimeout(debounceRef.current);
    }, [filters]);

    const handleAskDelete = (row) => {
        setSelectedItem(row);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteClinicalHistory(selectedItem.id);
            enqueueSnackbar("Historia clínica eliminada correctamente ✅", {
                variant: "success",
            });
            fetchData();
        } catch {
            enqueueSnackbar("Error al eliminar la historia clínica", { variant: "error" });
        } finally {
            setConfirmOpen(false);
        }
    };

    const columns = useMemo(
        () => [
            {
                field: "date",
                headerName: "Fecha",
                flex: 1,
                renderCell: (params) =>
                    params.row.date ? dayjs(params.row.date).format("DD/MM/YYYY") : "—",
            },
            { field: "consultationType", headerName: "Tipo", flex: 1 },
            { field: "petName", headerName: "Mascota", flex: 1.2 },
            { field: "veterinarianName", headerName: "Veterinario", flex: 1.2 },
            { field: "consultationReason", headerName: "Motivo", flex: 1.6 },
            { field: "diagnosis", headerName: "Diagnóstico", flex: 1.5 },
            {
                field: "actions",
                headerName: "Acciones",
                sortable: false,
                width: 180,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Ver detalle" arrow>
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => navigate(`/clinical-history/${params.row.id}`)}
                            >
                                <VisibilityIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar" arrow>
                            <IconButton
                                size="small"
                                color="secondary"
                                onClick={() => navigate(`/clinical-history/${params.row.id}/edit`)}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar" arrow>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleAskDelete(params.row)}
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
        <>
            <Stack spacing={3}>
                {/* Header */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    sx={clinicalHistoryListStyles.header}
                >
                    <Typography variant="h4" sx={clinicalHistoryListStyles.title}>
                        Historias Clínicas
                    </Typography>

                </Stack>

                {/* Filters */}
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                    sx={clinicalHistoryListStyles.filtersContainer}
                >
                    <FormControl size="small" sx={clinicalHistoryListStyles.filterField}>
                        <InputLabel>Tipo</InputLabel>
                        <Select
                            value={filters.consultationType}
                            label="Tipo"
                            onChange={(e) =>
                                setFilters((f) => ({ ...f, consultationType: e.target.value }))
                            }
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {CONSULTATION_TYPES.map((t) => (
                                <MenuItem key={t} value={t}>
                                    {t}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        type="date"
                        size="small"
                        label="Desde"
                        slotProps={{ inputLabel: { shrink: true } }}
                        value={filters.fromDate}
                        onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))}
                        sx={clinicalHistoryListStyles.filterField}
                    />

                    <TextField
                        type="date"
                        size="small"
                        label="Hasta"
                        slotProps={{ inputLabel: { shrink: true } }}
                        value={filters.toDate}
                        onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))}
                        sx={clinicalHistoryListStyles.filterField}
                    />

                    <TextField
                        label="Buscar (motivo, mascota o veterinario)"
                        size="small"
                        value={filters.keyword}
                        onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
                        sx={{ ...clinicalHistoryListStyles.filterField, minWidth: 280 }}
                    />

                    <Tooltip title="Buscar" arrow>
                        <IconButton
                            color="primary"
                            onClick={fetchData}
                            sx={clinicalHistoryListStyles.searchButton}
                        >
                            <SearchIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>

                <Divider sx={clinicalHistoryListStyles.divider} />

                {/* ✅ Responsive section */}
                {isSmall ? (
                    <Stack spacing={2}>
                        {rows.length > 0 ? (
                            rows.map((r) => (
                                <Card key={r.id} sx={clinicalHistoryListStyles.mobileCard}>
                                    <Typography sx={clinicalHistoryListStyles.mobileTitle}>
                                        {r.petName} — {r.consultationType}
                                    </Typography>
                                    <Typography sx={clinicalHistoryListStyles.mobileSubtitle}>
                                        {r.date ? dayjs(r.date).format("DD/MM/YYYY") : "Sin fecha"}
                                    </Typography>
                                    <Typography sx={clinicalHistoryListStyles.mobileMetadata}>
                                        Veterinario: {r.veterinarianName || "—"}
                                    </Typography>
                                    <Typography sx={clinicalHistoryListStyles.mobileMetadata}>
                                        Diagnóstico: {r.diagnosis || "—"}
                                    </Typography>
                                    <Stack direction="row" spacing={1} mt={1}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => navigate(`/clinical-history/${r.id}`)}
                                            sx={clinicalHistoryListStyles.actionButton}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() => navigate(`/clinical-history/${r.id}/edit`)}
                                            sx={clinicalHistoryListStyles.actionButton}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleAskDelete(r)}
                                            sx={clinicalHistoryListStyles.actionButton}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                </Card>
                            ))
                        ) : (
                            <Typography sx={clinicalHistoryListStyles.emptyMessage}>
                                No hay registros
                            </Typography>
                        )}
                    </Stack>
                ) : (
                    <Box sx={clinicalHistoryListStyles.dataGridContainer}>
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
                                        `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`,
                                },
                            }}
                            sx={clinicalHistoryListStyles.dataGrid}
                        />
                    </Box>
                )}
            </Stack>

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={confirmOpen}
                title="Eliminar historia clínica"
                message={
                    selectedItem
                        ? `¿Seguro que deseas eliminar la historia clínica de ${selectedItem.petName || "la mascota seleccionada"}? Se eliminarán todos los registros asociados a esta historia clínica (turnos, vacunas, etc).`
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

export default ClinicalHistoryList;
