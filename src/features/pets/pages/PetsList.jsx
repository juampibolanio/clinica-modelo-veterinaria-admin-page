import React, { useMemo } from "react";
import {
    Box,
    Stack,
    Typography,
    TextField,
    IconButton,
    Tooltip,
    Button,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon from "@mui/icons-material/VisibilityRounded";
import AddIcon from "@mui/icons-material/Pets";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { usePetsList } from "../hooks/usePetsList";

const PetsList = () => {
    const navigate = useNavigate();
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
        handleDeleteClick,
        fetchPets,
    } = usePetsList();

    const columns = useMemo(
        () => [
            { field: "id", headerName: "ID", width: 80 },
            { field: "name", headerName: "Nombre", flex: 1 },
            { field: "species", headerName: "Especie", flex: 1 },
            { field: "breed", headerName: "Raza", flex: 1 },
            {
                field: "gender",
                headerName: "Género",
                flex: 1,
                renderCell: (params) =>
                    params.row.gender === "MALE"
                        ? "Macho"
                        : params.row.gender === "FEMALE"
                            ? "Hembra"
                            : "-",
            },
            { field: "weight", headerName: "Peso (kg)", flex: 1 },
            {
                field: "ownerId",
                headerName: "Dueño",
                flex: 1,
                renderCell: (params) => (
                    <Button
                        variant="text"
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/owners/${params.row.ownerId}`)}
                    >
                        Ver dueño
                    </Button>
                ),
            },
            {
                field: "actions",
                headerName: "Acciones",
                sortable: false,
                width: 160,
                renderCell: (params) => (
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Ver detalle">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => navigate(`/pets/${params.row.id}`)}
                            >
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                            <IconButton
                                size="small"
                                color="secondary"
                                onClick={() => navigate(`/pets/${params.row.id}/edit`)}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteClick(params.row)}
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

    return (
        <>
            <Stack spacing={2} sx={{ p: { xs: 1, sm: 2 } }}>
                {/* Header */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                    spacing={1}
                >
                    <Typography variant="h4" fontWeight={800}>
                        Mascotas
                    </Typography>
                </Stack>

                {/* Filters */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    flexWrap="wrap"
                    alignItems="center"
                >
                    <TextField
                        label="Nombre"
                        size="small"
                        value={filters.name}
                        onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
                    />

                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel>Especie</InputLabel>
                        <Select
                            value={filters.species}
                            label="Especie"
                            onChange={(e) => setFilters((f) => ({ ...f, species: e.target.value }))}
                        >
                            <MenuItem value="">Todas</MenuItem>
                            <MenuItem value="perro">Perro</MenuItem>
                            <MenuItem value="gato">Gato</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Raza"
                        size="small"
                        value={filters.breed}
                        onChange={(e) => setFilters((f) => ({ ...f, breed: e.target.value }))}
                    />

                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel>Género</InputLabel>
                        <Select
                            value={filters.gender}
                            label="Género"
                            onChange={(e) => setFilters((f) => ({ ...f, gender: e.target.value }))}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="MALE">Macho</MenuItem>
                            <MenuItem value="FEMALE">Hembra</MenuItem>
                        </Select>
                    </FormControl>

                    <IconButton onClick={fetchPets}>
                        <SearchIcon />
                    </IconButton>
                </Stack>

                <Divider />

                {/* Table */}
                <Box sx={{ height: { xs: 400, sm: 560 }, width: "100%" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
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
            </Stack>

            {/* Confirm dialog */}
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
            />
        </>
    );
};

export default PetsList;
