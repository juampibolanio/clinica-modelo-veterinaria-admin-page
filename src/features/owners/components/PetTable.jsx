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
    Card,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon from "@mui/icons-material/VisibilityRounded";
import PetsIcon from "@mui/icons-material/Pets";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import { petTableStyles } from "../styles/petTable.styles";

/**
 * PetTable - Responsive version
 * 💻 Desktop: Data Table
 * 📱 Mobile: Clean cards
 */
const PetTable = ({ pets = [], onDeletePet }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);

    const columns = useMemo(
        () => [
            { field: "name", header: "Nombre" },
            { field: "species", header: "Especie" },
            { field: "breed", header: "Raza" },
            { field: "gender", header: "Sexo" },
            { field: "age", header: "Edad" },
            { field: "weight", header: "Peso" },
            { field: "actions", header: "Acciones", align: "center" },
        ],
        []
    );

    const renderGender = (g) =>
        g === "MALE" ? "Macho" : g === "FEMALE" ? "Hembra" : "-";

    const handleDelete = () => {
        if (onDeletePet && selectedPet) onDeletePet(selectedPet.id);
        setConfirmOpen(false);
        setSelectedPet(null);
    };

    return (
        <Paper elevation={0} sx={petTableStyles.paper}>
            {/* Header */}
            <Stack sx={petTableStyles.header}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <PetsIcon sx={{ color: "primary.main", fontSize: "1.5rem" }} />
                    <Typography variant="h6" sx={petTableStyles.title}>
                        Mascotas registradas
                    </Typography>
                </Stack>
            </Stack>

            <Divider sx={petTableStyles.divider} />

            {/* Empty State */}
            {pets.length === 0 ? (
                <Box sx={petTableStyles.emptyState}>
                    <Typography sx={petTableStyles.emptyText}>
                        Este cliente no tiene mascotas registradas
                    </Typography>
                </Box>
            ) : isMobile ? (
                /* 📱 Mobile: Card layout */
                <Stack spacing={2}>
                    {pets.map((p) => (
                        <Card key={p.id} sx={petTableStyles.mobileCard}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <PetsIcon sx={{ color: "primary.main", fontSize: "1.4rem" }} />
                                <Typography sx={petTableStyles.mobileTitle}>
                                    {p.name}
                                </Typography>
                            </Stack>

                            <Typography sx={petTableStyles.mobileSubtitle}>
                                {p.species} {p.breed ? `• ${p.breed}` : ""}
                            </Typography>

                            <Typography sx={petTableStyles.mobileMetadata}>
                                Sexo: {renderGender(p.gender)} — Edad:{" "}
                                {p.age ? `${p.age} años` : "-"} — Peso:{" "}
                                {p.weight ? `${p.weight} kg` : "-"}
                            </Typography>

                            <Stack direction="row" spacing={1} mt={1.5}>
                                <IconButton
                                    color="primary"
                                    onClick={() => navigate(`/pets/${p.id}`)}
                                    sx={petTableStyles.actionButton}
                                >
                                    <VisibilityIcon />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={() => {
                                        setSelectedPet(p);
                                        setConfirmOpen(true);
                                    }}
                                    sx={petTableStyles.actionButton}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                        </Card>
                    ))}
                </Stack>
            ) : (
                /* 💻 Desktop: Table layout */
                <Box sx={petTableStyles.tableWrapper}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead sx={petTableStyles.tableHead}>
                                <TableRow>
                                    {columns.map((c) => (
                                        <TableCell key={c.field} align={c.align || "left"}>
                                            {c.header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {pets.map((p) => (
                                    <TableRow key={p.id} hover sx={petTableStyles.tableRow}>
                                        <TableCell sx={petTableStyles.tableCell}>{p.name}</TableCell>
                                        <TableCell sx={petTableStyles.tableCell}>
                                            {p.species}
                                        </TableCell>
                                        <TableCell sx={petTableStyles.tableCell}>
                                            {p.breed || "-"}
                                        </TableCell>
                                        <TableCell sx={petTableStyles.tableCell}>
                                            {renderGender(p.gender)}
                                        </TableCell>
                                        <TableCell sx={petTableStyles.tableCell}>
                                            {p.age ? `${p.age} años` : "-"}
                                        </TableCell>
                                        <TableCell sx={petTableStyles.tableCell}>
                                            {p.weight ? `${p.weight} kg` : "-"}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" justifyContent="center" spacing={0.5}>
                                                <Tooltip title="Ver detalle" arrow>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => navigate(`/pets/${p.id}`)}
                                                        sx={petTableStyles.actionButton}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Eliminar" arrow>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => {
                                                            setSelectedPet(p);
                                                            setConfirmOpen(true);
                                                        }}
                                                        sx={petTableStyles.actionButton}
                                                    >
                                                        <DeleteIcon fontSize="small" />
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

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={confirmOpen}
                title="Eliminar mascota"
                message={
                    selectedPet
                        ? `¿Seguro que deseas eliminar a ${selectedPet.name}?`
                        : "¿Confirmar eliminación?"
                }
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
                confirmText="Eliminar"
                cancelText="Cancelar"
                confirmColor="error"
            />
        </Paper>
    );
};

export default PetTable;
