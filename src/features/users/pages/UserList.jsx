import { useState } from "react";
import {
    Box,
    Stack,
    Typography,
    TextField,
    IconButton,
    Button,
    Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/SearchRounded";
import AddIcon from "@mui/icons-material/AddRounded";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import UserTable from "../components/UserTable";
import { useUsersData } from "../hooks/userUsersData";

/**
 * This component displays a list of users with search and delete functionalities.
 * It uses the useUsersData hook to manage user data and state.
 */
const UserList = () => {
    const navigate = useNavigate();
    const {
        rows,
        loading,
        keyword,
        setKeyword,
        handleDeleteUser,
    } = useUsersData();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedUser) return;
        handleDeleteUser(selectedUser.id);
        setConfirmOpen(false);
    };

    return (
        <>
            <Stack spacing={2}>
                {/* Header */}
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

                {/* Search bar */}
                <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                        size="small"
                        label="Buscar usuario"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <IconButton>
                        <SearchIcon />
                    </IconButton>
                </Stack>

                <Divider />

                {/* Table */}
                <Box sx={{ width: "100%" }}>
                    <UserTable
                        rows={rows}
                        loading={loading}
                        onDelete={handleDeleteClick}
                    />
                </Box>
            </Stack>

            {/* Confirm Dialog */}
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

export default UserList;
