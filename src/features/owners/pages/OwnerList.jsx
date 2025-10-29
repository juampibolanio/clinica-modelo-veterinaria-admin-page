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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/PersonAddAlt";
import VisibilityIcon from "@mui/icons-material/VisibilityRounded";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { useOwnersList } from "../hooks/useOwnersList";

const OwnerList = () => {
    const navigate = useNavigate();
    const {
        rows,
        loading,
        search,
        setSearch,
        confirmOpen,
        setConfirmOpen,
        selectedOwner,
        setSelectedOwner,
        handleConfirmDelete,
        fetchOwners,
    } = useOwnersList();

    const columns = useMemo(
        () => [
            { field: "id", headerName: "ID", width: 80 },
            { field: "name", headerName: "Nombre", flex: 1 },
            { field: "surname", headerName: "Apellido", flex: 1 },
            { field: "email", headerName: "Email", flex: 1.3 },
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
                                onClick={() => {
                                    setSelectedOwner(params.row);
                                    setConfirmOpen(true);
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                ),
            },
        ],
        [navigate, setConfirmOpen, setSelectedOwner]
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

                {/* Filters */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
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

                {/* Table */}
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

            {/* Confirm Dialog */}
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

export default OwnerList;
