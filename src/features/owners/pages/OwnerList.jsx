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
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/PersonAddAlt";
import VisibilityIcon from "@mui/icons-material/VisibilityRounded";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { useOwnersList } from "../hooks/useOwnersList";
import { ownerListStyles } from "../styles/ownerList.styles";

/**
 * Responsive Owner List:
 * - DataGrid on desktop (with pagination & filters)
 * - Card layout on mobile (simple & fast)
 */
const OwnerList = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

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

    // DataGrid columns for desktop
    const columns = useMemo(
        () => [
            { field: "id", headerName: "ID", width: 70, align: "center", headerAlign: "center" },
            { field: "name", headerName: "Nombre", flex: 1, minWidth: 120 },
            { field: "surname", headerName: "Apellido", flex: 1, minWidth: 120 },
            { field: "email", headerName: "Correo electrónico", flex: 1.3, minWidth: 200 },
            { field: "phoneNumber", headerName: "Teléfono", flex: 0.9, minWidth: 100 },
            { field: "documentNumber", headerName: "Documento", flex: 0.9, minWidth: 100 },
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
                                onClick={() => navigate(`/owners/${params.row.id}`)}
                            >
                                <VisibilityIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar" arrow>
                            <IconButton
                                size="small"
                                color="secondary"
                                onClick={() => navigate(`/owners/${params.row.id}/edit`)}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar" arrow>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                    setSelectedOwner(params.row);
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
        [navigate, setConfirmOpen, setSelectedOwner]
    );

    return (
        <>
            <Stack spacing={3}>
                {/* Header */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    sx={ownerListStyles.header}
                >
                    <Typography variant="h4" sx={ownerListStyles.title}>
                        Dueños / Clientes
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/owners/create")}
                        sx={ownerListStyles.addButton}
                    >
                        Nuevo dueño
                    </Button>
                </Stack>

                {/* Filtros */}
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                    sx={ownerListStyles.filtersContainer}
                >
                    <TextField
                        size="small"
                        label="Nombre"
                        value={search.name}
                        onChange={(e) => setSearch((s) => ({ ...s, name: e.target.value }))}
                        sx={ownerListStyles.filterField}
                    />
                    <TextField
                        size="small"
                        label="Apellido"
                        value={search.surname}
                        onChange={(e) => setSearch((s) => ({ ...s, surname: e.target.value }))}
                        sx={ownerListStyles.filterField}
                    />
                    <TextField
                        size="small"
                        label="Documento"
                        value={search.documentNumber}
                        onChange={(e) => setSearch((s) => ({ ...s, documentNumber: e.target.value }))}
                        sx={ownerListStyles.filterField}
                    />
                    <Tooltip title="Buscar" arrow>
                        <IconButton
                            onClick={fetchOwners}
                            color="primary"
                            sx={ownerListStyles.searchButton}
                        >
                            <SearchIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>

                <Divider sx={ownerListStyles.divider} />

                {/* ✅ Responsive section */}
                {isSmall ? (
                    <Stack spacing={2}>
                        {rows.length > 0 ? (
                            rows.map((o) => (
                                <Card key={o.id} sx={ownerListStyles.mobileCard}>
                                    <Typography sx={ownerListStyles.mobileTitle}>
                                        {o.name} {o.surname}
                                    </Typography>
                                    <Typography sx={ownerListStyles.mobileSubtitle}>
                                        {o.email || "Sin correo"} — {o.phoneNumber || "Sin teléfono"}
                                    </Typography>
                                    <Typography sx={ownerListStyles.mobileMetadata}>
                                        Documento: {o.documentNumber || "-"}
                                    </Typography>
                                    <Stack direction="row" spacing={1} mt={1}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => navigate(`/owners/${o.id}`)}
                                            sx={ownerListStyles.actionButton}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() => navigate(`/owners/${o.id}/edit`)}
                                            sx={ownerListStyles.actionButton}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => {
                                                setSelectedOwner(o);
                                                setConfirmOpen(true);
                                            }}
                                            sx={ownerListStyles.actionButton}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                </Card>
                            ))
                        ) : (
                            <Typography sx={ownerListStyles.emptyMessage}>
                                No hay registros
                            </Typography>
                        )}
                    </Stack>
                ) : (
                    <Box sx={ownerListStyles.dataGridContainer}>
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
                            sx={ownerListStyles.dataGrid}
                        />
                    </Box>
                )}
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
                confirmColor="error"
            />
        </>
    );
};

export default OwnerList;
