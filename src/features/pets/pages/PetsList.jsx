import React, { useMemo } from "react";
import {
    Box,
    Stack,
    Typography,
    TextField,
    IconButton,
    Button,
    Divider,
    Tooltip,
    Card,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon from "@mui/icons-material/VisibilityRounded";
import AddIcon from "@mui/icons-material/Pets";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { usePetsList } from "../hooks/usePetsList";
import { petsListStyles } from "../styles/petsList.styles";

/**
 * Responsive Pets List:
 * - DataGrid en escritorio (paginado y filtros)
 * - Cards en móvil (layout compacto)
 */
const PetsList = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const {
        rows,
        loading,
        filters,
        setFilters,
        confirmOpen,
        setConfirmOpen,
        selectedPet,
        setSelectedPet,
        handleConfirmDelete,
        fetchPets,
    } = usePetsList();

    const columns = useMemo(
        () => [
            { field: "id", headerName: "ID", width: 70, align: "center", headerAlign: "center" },
            { field: "name", headerName: "Nombre", flex: 1, minWidth: 120 },
            { field: "species", headerName: "Especie", flex: 1, minWidth: 120 },
            { field: "breed", headerName: "Raza", flex: 1, minWidth: 120 },
            {
                field: "gender",
                headerName: "Sexo",
                flex: 0.8,
                minWidth: 100,
                renderCell: (params) =>
                    params.row.gender === "MALE"
                        ? "Macho"
                        : params.row.gender === "FEMALE"
                            ? "Hembra"
                            : "-",
            },
            {
                field: "weight",
                headerName: "Peso (kg)",
                flex: 0.8,
                minWidth: 100,
                renderCell: (params) => params.row.weight || "-",
            },
            {
                field: "actions",
                headerName: "Acciones",
                sortable: false,
                width: 180,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Ver" arrow>
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => navigate(`/pets/${params.row.id}`)}
                            >
                                <VisibilityIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar" arrow>
                            <IconButton
                                size="small"
                                color="secondary"
                                onClick={() => navigate(`/pets/${params.row.id}/edit`)}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar" arrow>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                    setSelectedPet(params.row);
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
        [navigate, setConfirmOpen, setSelectedPet]
    );

    return (
        <>
            <Stack spacing={3}>
                {/* Header */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    sx={petsListStyles.header}
                >
                    <Typography variant="h4" sx={petsListStyles.title}>
                        Mascotas
                    </Typography>
                </Stack>

                {/* Filtros */}
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                    sx={petsListStyles.filtersContainer}
                >
                    <TextField
                        size="small"
                        label="Nombre"
                        value={filters.name}
                        onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
                        sx={petsListStyles.filterField}
                    />
                    <TextField
                        size="small"
                        label="Especie"
                        value={filters.species}
                        onChange={(e) => setFilters((f) => ({ ...f, species: e.target.value }))}
                        sx={petsListStyles.filterField}
                    />
                    <TextField
                        size="small"
                        label="Raza"
                        value={filters.breed}
                        onChange={(e) => setFilters((f) => ({ ...f, breed: e.target.value }))}
                        sx={petsListStyles.filterField}
                    />
                    <Tooltip title="Buscar" arrow>
                        <IconButton onClick={fetchPets} color="primary" sx={petsListStyles.searchButton}>
                            <SearchIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>

                <Divider sx={petsListStyles.divider} />

                {/* Responsive layout */}
                {isSmall ? (
                    <Stack spacing={2}>
                        {rows.length > 0 ? (
                            rows.map((p) => (
                                <Card key={p.id} sx={petsListStyles.mobileCard}>
                                    <Typography sx={petsListStyles.mobileTitle}>{p.name}</Typography>
                                    <Typography sx={petsListStyles.mobileSubtitle}>
                                        {p.species} {p.breed ? `• ${p.breed}` : ""}
                                    </Typography>
                                    <Typography sx={petsListStyles.mobileMetadata}>
                                        Sexo:{" "}
                                        {p.gender === "MALE" ? "Macho" : p.gender === "FEMALE" ? "Hembra" : "-"} —{" "}
                                        Peso: {p.weight ? `${p.weight} kg` : "-"}
                                    </Typography>
                                    <Stack direction="row" spacing={1} mt={1}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => navigate(`/pets/${p.id}`)}
                                            sx={petsListStyles.actionButton}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() => navigate(`/pets/${p.id}/edit`)}
                                            sx={petsListStyles.actionButton}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => {
                                                setSelectedPet(p);
                                                setConfirmOpen(true);
                                            }}
                                            sx={petsListStyles.actionButton}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                </Card>
                            ))
                        ) : (
                            <Typography sx={petsListStyles.emptyMessage}>No hay registros</Typography>
                        )}
                    </Stack>
                ) : (
                    <Box sx={petsListStyles.dataGridContainer}>
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
                            sx={petsListStyles.dataGrid}
                        />
                    </Box>
                )}
            </Stack>

            {/* Confirmación de eliminación */}
            <ConfirmDialog
                open={confirmOpen}
                title="Eliminar mascota"
                message={
                    selectedPet
                        ? `¿Seguro que deseas eliminar a ${selectedPet.name}?`
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

export default PetsList;
