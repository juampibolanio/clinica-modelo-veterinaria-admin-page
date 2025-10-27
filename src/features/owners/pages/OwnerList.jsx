import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    Stack,
    Typography,
    TextField,
    IconButton,
    Tooltip,
    Button,
    Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/PersonAddAlt";
import VisibilityIcon from "@mui/icons-material/VisibilityRounded";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { deleteOwner, getOwners } from "../api/owners.api";
import ConfirmDialog from "../../../components/common/ConfirmDialog";

const OwnersList = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState({ name: "", surname: "", documentNumber: "" });
    const debounceRef = useRef(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState(null);

    const fetchOwners = async () => {
        try {
            setLoading(true);
            const data = await getOwners(search);
            setRows(data);
        } catch {
            enqueueSnackbar("Error al cargar dueños", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchOwners();
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [search]);

    const handleDeleteClick = (owner) => {
        setSelectedOwner(owner);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedOwner) return;
        try {
            await deleteOwner(selectedOwner.id);
            enqueueSnackbar("Dueño eliminado correctamente", { variant: "success" });
            fetchOwners();
        } catch {
            enqueueSnackbar("Error al eliminar", { variant: "error" });
        } finally {
            setConfirmOpen(false);
            setSelectedOwner(null);
        }
    };

    const columns = useMemo(
        () => [
            { field: "id", headerName: "ID", width: 80 },
            { field: "name", headerName: "Nombre", flex: 1 },
            { field: "surname", headerName: "Apellido", flex: 1 },
            { field: "email", headerName: "Email", flex: 1.2 },
            { field: "phoneNumber", headerName: "Teléfono", flex: 1 },
            { field: "documentNumber", headerName: "Documento", flex: 1 },
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
                                onClick={() => navigate(`/owners/${params.row.id}`)}
                            >
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                            <IconButton
                                size="small"
                                color="secondary"
                                onClick={() => navigate(`/owners/${params.row.id}/edit`)}
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
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                    spacing={1}
                >
                    <Typography variant="h4" fontWeight={800}>
                        Dueños / Clientes
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/owners/create")}
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                        Nuevo dueño
                    </Button>
                </Stack>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    flexWrap="wrap"
                    alignItems="center"
                >
                    <TextField
                        size="small"
                        label="Nombre"
                        value={search.name}
                        onChange={(e) => setSearch((s) => ({ ...s, name: e.target.value }))}
                        fullWidth={!!window.matchMedia("(max-width:600px)").matches}
                    />
                    <TextField
                        size="small"
                        label="Apellido"
                        value={search.surname}
                        onChange={(e) => setSearch((s) => ({ ...s, surname: e.target.value }))}
                        fullWidth={!!window.matchMedia("(max-width:600px)").matches}
                    />
                    <TextField
                        size="small"
                        label="Documento"
                        value={search.documentNumber}
                        onChange={(e) =>
                            setSearch((s) => ({ ...s, documentNumber: e.target.value }))
                        }
                        fullWidth={!!window.matchMedia("(max-width:600px)").matches}
                    />
                    <IconButton onClick={fetchOwners}>
                        <SearchIcon />
                    </IconButton>
                </Stack>

                <Divider />

                <Box sx={{ height: { xs: 400, sm: 560 }, width: "100%" }}>
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

            <ConfirmDialog
                open={confirmOpen}
                title="Eliminar dueño"
                message={
                    selectedOwner
                        ? `¿Seguro que deseas eliminar a ${selectedOwner.name} ${selectedOwner.surname}?`
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

export default OwnersList;
