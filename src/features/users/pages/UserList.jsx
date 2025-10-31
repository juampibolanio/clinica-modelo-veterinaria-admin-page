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
import SearchIcon from "@mui/icons-material/SearchRounded";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import PersonAddIcon from "@mui/icons-material/PersonAddAlt1";
import VisibilityIcon from "@mui/icons-material/VisibilityRounded";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { useUsersData } from "../hooks/userUsersData";
import { usersListStyles } from "../styles/userList.styles";

const UserList = () => {
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
        selectedUser,
        setSelectedUser,
        handleConfirmDelete,
        fetchUsers,
    } = useUsersData();

    const columns = useMemo(
        () => [
            { field: "id", headerName: "ID", width: 70, align: "center", headerAlign: "center" },
            { field: "name", headerName: "Nombre", flex: 1, minWidth: 120 },
            { field: "surname", headerName: "Apellido", flex: 1, minWidth: 120 },
            { field: "email", headerName: "Correo electrónico", flex: 1.3, minWidth: 200 },
            { field: "role", headerName: "Rol", flex: 0.8, minWidth: 100 },
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
                                onClick={() => navigate(`/security/${params.row.id}`)}
                            >
                                <VisibilityIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar" arrow>
                            <IconButton
                                size="small"
                                color="secondary"
                                onClick={() => navigate(`/security/edit/${params.row.id}`)}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar" arrow>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                    setSelectedUser(params.row);
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
        [navigate, setConfirmOpen, setSelectedUser]
    );

    return (
        <>
            <Stack spacing={3}>
                {/* Encabezado */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    sx={usersListStyles.header}
                >
                    <Typography variant="h4" sx={usersListStyles.title}>
                        Usuarios del Sistema
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={() => navigate("/security/create")}
                        sx={usersListStyles.addButton}
                    >
                        Nuevo usuario
                    </Button>
                </Stack>

                {/* Filtros */}
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                    sx={usersListStyles.filtersContainer}
                >
                    <TextField
                        size="small"
                        label="Nombre"
                        value={filters.name}
                        onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
                        sx={usersListStyles.filterField}
                    />
                    <TextField
                        size="small"
                        label="Correo electrónico"
                        value={filters.email}
                        onChange={(e) => setFilters((f) => ({ ...f, email: e.target.value }))}
                        sx={usersListStyles.filterField}
                    />
                    <TextField
                        size="small"
                        label="Rol"
                        value={filters.role}
                        onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}
                        sx={usersListStyles.filterField}
                    />
                    <Tooltip title="Buscar" arrow>
                        <IconButton onClick={fetchUsers} color="primary" sx={usersListStyles.searchButton}>
                            <SearchIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>

                <Divider sx={usersListStyles.divider} />

                {/* Tabla / Cards Responsivas */}
                {isSmall ? (
                    <Stack spacing={2}>
                        {rows.length > 0 ? (
                            rows.map((u) => (
                                <Card key={u.id} sx={usersListStyles.mobileCard}>
                                    <Typography sx={usersListStyles.mobileTitle}>
                                        {u.name} {u.surname}
                                    </Typography>
                                    <Typography sx={usersListStyles.mobileSubtitle}>
                                        {u.email || "Sin correo"}
                                    </Typography>
                                    <Typography sx={usersListStyles.mobileMetadata}>
                                        Rol: {u.role || "—"}
                                    </Typography>
                                    <Stack direction="row" spacing={1} mt={1}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => navigate(`/security/${u.id}`)}
                                            sx={usersListStyles.actionButton}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() => navigate(`/security/edit/${u.id}`)}
                                            sx={usersListStyles.actionButton}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => {
                                                setSelectedUser(u);
                                                setConfirmOpen(true);
                                            }}
                                            sx={usersListStyles.actionButton}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                </Card>
                            ))
                        ) : (
                            <Typography sx={usersListStyles.emptyMessage}>No hay registros</Typography>
                        )}
                    </Stack>
                ) : (
                    <Box sx={usersListStyles.dataGridContainer}>
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
                            sx={usersListStyles.dataGrid}
                        />
                    </Box>
                )}
            </Stack>

            {/* Confirmación de eliminación */}
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
                confirmColor="error"
            />
        </>
    );
};

export default UserList;
