import React, { useEffect, useState, useMemo, useRef } from "react";
import {
    Box,
    Stack,
    Typography,
    TextField,
    IconButton,
    Tooltip,
    Divider,
    Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/SearchRounded";
import EditIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddIcon from "@mui/icons-material/AddRounded";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { getAllUsers, deleteUser } from "../api/users.api";
import ConfirmDialog from "../../../components/common/ConfirmDialog";

const UsersList = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const debounceRef = useRef(null);

    // 🔹 Cargar usuarios
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setRows(data || []);
        } catch {
            enqueueSnackbar("Error al cargar usuarios", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 🔍 Filtro con debounce
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchUsers();
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [keyword]);

    // 🗑️ Confirmar eliminación
    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedUser) return;
        try {
            await deleteUser(selectedUser.id);
            enqueueSnackbar("Usuario eliminado correctamente", { variant: "success" });
            fetchUsers();
        } catch {
            enqueueSnackbar("Error al eliminar usuario", { variant: "error" });
        } finally {
            setConfirmOpen(false);
        }
    };

    // 🧩 Columnas del DataGrid
    const columns = useMemo(
        () => [
            { field: "id", headerName: "ID", width: 80 },
            { field: "username", headerName: "Usuario", flex: 1 },
            { field: "name", headerName: "Nombre", flex: 1 },
            { field: "surname", headerName: "Apellido", flex: 1 },
            { field: "email", headerName: "Email", flex: 1.5 },
            { field: "phoneNumber", headerName: "Teléfono", flex: 1 },
            {
                field: "role",
                headerName: "Rol",
                flex: 1,
                renderCell: (params) =>
                    params.row.role === "ADMIN" ? "Administrador" : "Usuario",
            },
            {
                field: "actions",
                headerName: "Acciones",
                width: 160,
                sortable: false,
                renderCell: (params) => (
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Editar">
                            <IconButton
                                size="small"
                                color="secondary"
                                onClick={() => navigate(`/security/${params.row.id}/edit`)}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteClick(params.row)}
                                disabled={params.row.role === "ADMIN"} // ✅ No borrar admin principal
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
                        Usuarios del Sistema
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/security/create")}
                    >
                        Nuevo Usuario
                    </Button>
                </Stack>

                {/* Buscador */}
                <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                        size="small"
                        label="Buscar usuario"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <IconButton onClick={fetchUsers}>
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
                        sx={{
                            "& .MuiDataGrid-columnHeaders": { fontWeight: 700 },
                        }}
                    />
                </Box>
            </Stack>

            {/* ConfirmDialog */}
            <ConfirmDialog
                open={confirmOpen}
                title="Eliminar usuario"
                message={
                    selectedUser
                        ? `¿Seguro que deseas eliminar a ${selectedUser.name} ${selectedUser.surname}?`
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

export default UsersList;
