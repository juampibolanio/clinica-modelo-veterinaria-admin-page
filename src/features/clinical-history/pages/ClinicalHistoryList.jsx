import React, { useEffect, useState, useRef, useMemo } from "react";
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
    FormControl,
    InputLabel,
    Select,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/VisibilityRounded";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { listClinicalHistory, deleteClinicalHistory } from "../api/clinical-history.api";
import { CONSULTATION_TYPES } from "../constants/consultation-types";

/**
 * ClinicalHistoryList
 * Displays a searchable, paginated list of all clinical histories.
 * Allows filtering by consultation type, date range, and keyword.
 */
const ClinicalHistoryList = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

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

    // ==============================
    // Data Fetcher
    // ==============================
    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await listClinicalHistory({ ...filters, page: 0, size: 100 });
            if (Array.isArray(data?.content)) {
                setRows(data.content);
            } else {
                setRows([]);
            }
        } catch (err) {
            console.error("Error loading clinical histories:", err);
            enqueueSnackbar("Error al cargar historias clínicas", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    // Auto-refresh on filter changes with debounce
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(fetchData, 400);
        return () => clearTimeout(debounceRef.current);
        // eslint-disable-next-line
    }, [filters]);

    // ==============================
    // Delete handlers
    // ==============================
    const handleAskDelete = (row) => {
        setSelectedItem(row);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteClinicalHistory(selectedItem.id);
            enqueueSnackbar("Historia clínica eliminada correctamente", { variant: "success" });
            fetchData();
        } catch {
            enqueueSnackbar("Error al eliminar la historia clínica", { variant: "error" });
        } finally {
            setConfirmOpen(false);
        }
    };

    // ==============================
    // Columns for DataGrid
    // ==============================
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
            {
                field: "petName",
                headerName: "Mascota",
                flex: 1.2,
                renderCell: (params) => params.row.petName || "—",
            },
            {
                field: "veterinarianName",
                headerName: "Veterinario",
                flex: 1.2,
                renderCell: (params) => params.row.veterinarianName || "—",
            },
            {
                field: "consultationReason",
                headerName: "Motivo",
                flex: 1.6,
                renderCell: (params) => params.row.consultationReason || "—",
            },
            {
                field: "diagnosis",
                headerName: "Diagnóstico",
                flex: 1.5,
                renderCell: (params) => params.row.diagnosis || "—",
            },
            {
                field: "actions",
                headerName: "Acciones",
                sortable: false,
                width: 180,
                renderCell: (params) => (
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Ver detalle">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => navigate(`/clinical-history/${params.row.id}`)}
                            >
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                            <IconButton
                                size="small"
                                color="secondary"
                                onClick={() => navigate(`/clinical-history/${params.row.id}/edit`)}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleAskDelete(params.row)}
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
    // UI
    // ==============================
    return (
        <>
            <Stack spacing={2} sx={{ p: { xs: 1, sm: 2 } }}>
                {/* === Header === */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                    spacing={1}
                >
                    <Typography variant="h4" fontWeight={800}>
                        Historias Clínicas
                    </Typography>

                </Stack>

                {/* === Filters === */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    flexWrap="wrap"
                    alignItems="center"
                >
                    <FormControl size="small" sx={{ minWidth: 160 }}>
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
                        InputLabelProps={{ shrink: true }}
                        value={filters.fromDate}
                        onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))}
                    />

                    <TextField
                        type="date"
                        size="small"
                        label="Hasta"
                        InputLabelProps={{ shrink: true }}
                        value={filters.toDate}
                        onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))}
                    />

                    <TextField
                        label="Buscar (motivo, mascota o veterinario)"
                        size="small"
                        value={filters.keyword}
                        onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
                        sx={{ minWidth: 300 }}
                    />

                    <IconButton onClick={fetchData}>
                        <SearchIcon />
                    </IconButton>
                </Stack>

                <Divider />

                {/* === Table === */}
                <Box sx={{ height: 560, width: "100%" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        getRowId={(r) => r.id}
                        disableRowSelectionOnClick
                        density="compact"
                        sx={{
                            "& .MuiDataGrid-columnHeaders": { fontWeight: 700 },
                            "@media (max-width:600px)": {
                                "& .MuiDataGrid-cell--textLeft": { fontSize: "0.85rem" },
                            },
                        }}
                    />
                </Box>
            </Stack>

            {/* === Confirm Dialog === */}
            <ConfirmDialog
                open={confirmOpen}
                title="Eliminar historia clínica"
                message={
                    selectedItem
                        ? `¿Seguro que deseas eliminar la historia del paciente ${selectedItem.petName || "desconocido"
                        }?`
                        : "¿Confirmar eliminación?"
                }
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                confirmText="Eliminar"
                cancelText="Cancelar"
            />
        </>
    );
};

export default ClinicalHistoryList;
