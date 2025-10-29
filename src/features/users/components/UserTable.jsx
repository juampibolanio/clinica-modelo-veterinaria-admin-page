import { DataGrid } from "@mui/x-data-grid";
import {
    Stack,
    IconButton,
    Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Reusable table for displaying system users
 */
const UserTable = ({ rows, loading, onDelete }) => {
    const navigate = useNavigate();

    // DataGrid columns (memoized)
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
                                onClick={() => onDelete(params.row)}
                                disabled={params.row.role === "ADMIN"}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                ),
            },
        ],
        [navigate, onDelete]
    );

    return (
        <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            density="compact"
            sx={{
                height: 560,
                "& .MuiDataGrid-columnHeaders": { fontWeight: 700 },
            }}
        />
    );
};

export default UserTable;
