import React, { useState } from "react";
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
    Chip,
    IconButton,
    Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import ConfirmDialog from "../../../components/common/ConfirmDialog";

const PetTable = ({ pets = [], onDeletePet }) => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);

    const handleDeleteClick = (pet) => {
        setSelectedPet(pet);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (onDeletePet && selectedPet) onDeletePet(selectedPet.id);
        setConfirmOpen(false);
        setSelectedPet(null);
    };

    return (
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
                Mascotas Registradas
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {pets.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                    Este cliente no tiene mascotas registradas.
                </Typography>
            ) : (
                <Box sx={{ overflowX: "auto" }}>
                    <TableContainer sx={{ minWidth: 650 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    {[
                                        "Nombre",
                                        "Especie",
                                        "Raza",
                                        "Sexo",
                                        "Edad",
                                        "Peso",
                                        "Estado",
                                        "Acciones",
                                    ].map((h) => (
                                        <TableCell key={h} align={h === "Acciones" ? "center" : "left"}>
                                            {h}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pets.map((pet) => (
                                    <TableRow key={pet.id} hover>
                                        <TableCell>{pet.name}</TableCell>
                                        <TableCell>{pet.species}</TableCell>
                                        <TableCell>{pet.breed || "-"}</TableCell>
                                        <TableCell>{pet.gender}</TableCell>
                                        <TableCell>
                                            {pet.age
                                                ? `${pet.age} años`
                                                : pet.birthDate
                                                    ? `Nacido ${pet.birthDate}`
                                                    : "-"}
                                        </TableCell>
                                        <TableCell>{pet.weight ? `${pet.weight} kg` : "-"}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={pet.isActive ? "Activo" : "Inactivo"}
                                                color={pet.isActive ? "success" : "default"}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Eliminar mascota">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteClick(pet)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

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
