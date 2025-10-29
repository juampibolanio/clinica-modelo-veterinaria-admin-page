import { useState, useMemo } from "react";
import {
    Box,
    Paper,
    Typography,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon from "@mui/icons-material/VisibilityRounded";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { useNavigate } from "react-router-dom";

/**
 * PetTable - Displays a list of pets for a given owner.
 * Supports deletion, responsive layout, and consistent UI style.
 */
const PetTable = ({ pets = [], onDeletePet }) => {
    const navigate = useNavigate();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);

    // Columns config (memoized to avoid re-render)
    const columns = useMemo(
        () => [
            { field: "name", header: "Nombre" },
            { field: "species", header: "Especie" },
            { field: "breed", header: "Raza" },
            { field: "gender", header: "Sexo" },
            { field: "age", header: "Edad" },
            { field: "weight", header: "Peso" },
            { field: "actions", header: "Acciones" },
        ],
        []
    );

    const handleDeleteClick = (pet) => {
        setSelectedPet(pet);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (onDeletePet && selectedPet) onDeletePet(selectedPet.id);
        setConfirmOpen(false);
        setSelectedPet(null);
    };

    // 🔹 Función auxiliar para traducir el género
    const renderGender = (gender) => {
        if (gender === "MALE") return "Macho";
        if (gender === "FEMALE") return "Hembra";
        return "-";
    };

    return (
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
            {/* Header */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
                mb={2}
                spacing={1}
            >
                <Typography variant="h6" fontWeight={700}>
                    Mascotas registradas
                </Typography>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            {/* Empty state */}
            {pets.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                    Este cliente no tiene mascotas registradas.
                </Typography>
            ) : (
                <Box sx={{ overflowX: "auto" }}>
                    <TableContainer>
                        <Table stickyHeader size="small" aria-label="tabla de mascotas">
                            <TableHead>
                                <TableRow>
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.field}
                                            align={col.field === "actions" ? "center" : "left"}
                                            sx={{
                                                fontWeight: 700,
                                                backgroundColor: "rgba(55,129,227,0.08)",
                                            }}
                                        >
                                            {col.header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {pets.map((pet) => (
                                    <TableRow
                                        key={pet.id}
                                        hover
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "rgba(55, 129, 227, 0.04)",
                                            },
                                        }}
                                    >
                                        <TableCell>{pet.name}</TableCell>
                                        <TableCell>{pet.species}</TableCell>
                                        <TableCell>{pet.breed || "-"}</TableCell>
                                        <TableCell>{renderGender(pet.gender)}</TableCell>
                                        <TableCell>
                                            {pet.age
                                                ? `${pet.age} años`
                                                : pet.birthDate
                                                    ? `Nacido ${pet.birthDate}`
                                                    : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {pet.weight ? `${pet.weight} kg` : "-"}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" justifyContent="center" spacing={1}>
                                                <Tooltip title="Ver detalle">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => navigate(`/pets/${pet.id}`)}
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Eliminar mascota">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDeleteClick(pet)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

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
        </Paper>
    );
};

export default PetTable;
