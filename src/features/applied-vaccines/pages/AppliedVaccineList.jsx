import React, { useEffect, useState, useRef, useMemo } from "react";
import {
    Box,
    Stack,
    Typography,
    TextField,
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
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/VisibilityRounded";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/VaccinesRounded";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import {
    listAppliedVaccines,
    deleteAppliedVaccine,
} from "../api/applied-vaccines.api";
import { appliedVaccineListStyles } from "../styles/appliedVaccineList.styles";

/**
 * AppliedVaccineList — styled + responsive version
 */
const AppliedVaccineList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const params = new URLSearchParams(location.search);
    const petIdFromQuery = params.get("petId");

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [filters, setFilters] = useState({
        petId: petIdFromQuery || "",
        veterinarianId: "",
        productId: "",
        fromDate: "",
        toDate: "",
    });

    const debounceRef = useRef(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await listAppliedVaccines({ ...filters, page: 0, size: 100 });
            setRows(Array.isArray(data?.content) ? data.content : []);
        } catch {
            enqueueSnackbar("Error al cargar vacunas aplicadas", { variant: "error" });
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
            await deleteAppliedVaccine(selectedItem.id);
            enqueueSnackbar("Vacuna eliminada correctamente ✅", { variant: "success" });
            fetchData();
        } catch {
            enqueueSnackbar("Error al eliminar la vacuna aplicada", { variant: "error" });
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
            { field: "petName", headerName: "Mascota", flex: 1.2 },
            { field: "productName", headerName: "Producto (vacuna)", flex: 1.4 },
            { field: "veterinarianName", headerName: "Veterinario", flex: 1.3 },
            { field: "observations", headerName: "Observaciones", flex: 1.8 },
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
                                onClick={() => navigate(`/applied-vaccines/${params.row.id}`)}
                            >
                                <VisibilityIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar" arrow>
                            <IconButton
                                size="small"
                                color="secondary"
                                onClick={() =>
                                    navigate(`/applied-vaccines/${params.row.id}/edit`)
                                }
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
                {/* === Header === */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    sx={appliedVaccineListStyles.header}
                >
                    <Typography variant="h4" sx={appliedVaccineListStyles.title}>
                        Vacunas aplicadas
                    </Typography>

                </Stack>

                {/* === Filters === */}
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                    sx={appliedVaccineListStyles.filtersContainer}
                >
                    <TextField
                        label="ID Mascota"
                        size="small"
                        value={filters.petId}
                        onChange={(e) =>
                            setFilters((f) => ({ ...f, petId: e.target.value }))
                        }
                        disabled={!!petIdFromQuery}
                        sx={appliedVaccineListStyles.filterField}
                    />

                    <TextField
                        label="ID Veterinario"
                        size="small"
                        value={filters.veterinarianId}
                        onChange={(e) =>
                            setFilters((f) => ({ ...f, veterinarianId: e.target.value }))
                        }
                        sx={appliedVaccineListStyles.filterField}
                    />

                    <TextField
                        label="ID Producto"
                        size="small"
                        value={filters.productId}
                        onChange={(e) =>
                            setFilters((f) => ({ ...f, productId: e.target.value }))
                        }
                        sx={appliedVaccineListStyles.filterField}
                    />

                    <TextField
                        type="date"
                        size="small"
                        label="Desde"
                        InputLabelProps={{ shrink: true }}
                        value={filters.fromDate}
                        onChange={(e) =>
                            setFilters((f) => ({ ...f, fromDate: e.target.value }))
                        }
                        sx={appliedVaccineListStyles.filterField}
                    />

                    <TextField
                        type="date"
                        size="small"
                        label="Hasta"
                        InputLabelProps={{ shrink: true }}
                        value={filters.toDate}
                        onChange={(e) =>
                            setFilters((f) => ({ ...f, toDate: e.target.value }))
                        }
                        sx={appliedVaccineListStyles.filterField}
                    />

                    <Tooltip title="Buscar" arrow>
                        <IconButton
                            color="primary"
                            onClick={fetchData}
                            sx={appliedVaccineListStyles.searchButton}
                        >
                            <SearchIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>

                <Divider sx={appliedVaccineListStyles.divider} />

                {/* === Responsive Section === */}
                {isSmall ? (
                    <Stack spacing={2}>
                        {rows.length > 0 ? (
                            rows.map((r) => (
                                <Card key={r.id} sx={appliedVaccineListStyles.mobileCard}>
                                    <Typography sx={appliedVaccineListStyles.mobileTitle}>
                                        {r.productName} — {r.petName}
                                    </Typography>
                                    <Typography sx={appliedVaccineListStyles.mobileSubtitle}>
                                        {r.date ? dayjs(r.date).format("DD/MM/YYYY") : "Sin fecha"}
                                    </Typography>
                                    <Typography sx={appliedVaccineListStyles.mobileMetadata}>
                                        Veterinario: {r.veterinarianName || "—"}
                                    </Typography>
                                    <Typography sx={appliedVaccineListStyles.mobileMetadata}>
                                        Observaciones: {r.observations || "—"}
                                    </Typography>
                                    <Stack direction="row" spacing={1} mt={1}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => navigate(`/applied-vaccines/${r.id}`)}
                                            sx={appliedVaccineListStyles.actionButton}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() =>
                                                navigate(`/applied-vaccines/${r.id}/edit`)
                                            }
                                            sx={appliedVaccineListStyles.actionButton}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleAskDelete(r)}
                                            sx={appliedVaccineListStyles.actionButton}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                </Card>
                            ))
                        ) : (
                            <Typography sx={appliedVaccineListStyles.emptyMessage}>
                                No hay registros
                            </Typography>
                        )}
                    </Stack>
                ) : (
                    <Box sx={appliedVaccineListStyles.dataGridContainer}>
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
                            sx={appliedVaccineListStyles.dataGrid}
                        />
                    </Box>
                )}
            </Stack>

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={confirmOpen}
                title="Eliminar vacuna aplicada"
                message={
                    selectedItem
                        ? `¿Seguro que deseas eliminar la vacuna aplicada a ${selectedItem.petName || "la mascota seleccionada"}?`
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

export default AppliedVaccineList;
