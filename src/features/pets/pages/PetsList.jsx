import React, { useEffect, useState, useMemo, useRef } from "react";
import {
    Box,
    Stack,
    Typography,
    TextField,
    IconButton,
    Button,
    Divider,
    Tooltip,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/VisibilityRounded";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { getPets, deletePet } from "../api/pets.api";
import ConfirmDialog from "../../../components/common/ConfirmDialog";

const PetsList = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        name: "",
        species: "",
        breed: "",
        gender: "",
        ownerId: "",
    });
    const debounceRef = useRef(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);

    const fetchPets = async () => {
        try {
            setLoading(true);
            const result = await getPets(filters);
            setRows(result.content || []);
        } catch {
            enqueueSnackbar("Error al cargar mascotas", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchPets();
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [filters]);

    const handleDeleteClick = (pet) => {
        setSelectedPet(pet);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedPet) return;
        try {
            await deletePet(selectedPet.id);
            enqueueSnackbar("Mascota eliminada correctamente", { variant: "success" });
            fetchPets();
        } catch {
            enqueueSnackbar("Error al eliminar mascota", { variant: "error" });
        } finally {
            setConfirmOpen(false);
        }
    };

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
                renderCell: (params) => {
                    const value = params?.row?.gender;
                    if (value === "MALE") return "Macho";
                    if (value === "FEMALE") return "Hembra";
                    return "-";
                },
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
                width: 180,
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
            <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" fontWeight={800}>
                        Mascotas
                    </Typography>

                </Stack>

                {/* Filtros */}
                <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
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

                    <TextField
                        label="ID del Dueño"
                        size="small"
                        value={filters.ownerId}
                        onChange={(e) => setFilters((f) => ({ ...f, ownerId: e.target.value }))}
                        sx={{ width: 130 }}
                    />

                    <IconButton onClick={fetchPets}>
                        <SearchIcon />
                    </IconButton>
                </Stack>

                <Divider />

                {/* Tabla */}
                <Box sx={{ height: 560, width: "100%" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        disableRowSelectionOnClick
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

            {/* ConfirmDialog */}
            <ConfirmDialog
                open={confirmOpen}
                title="Eliminar Mascota"
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
