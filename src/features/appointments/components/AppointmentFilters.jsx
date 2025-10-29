import { Paper, Stack, TextField, MenuItem, Button } from "@mui/material";

/**
 * Filters bar for appointments list
 */
const AppointmentFilters = ({ filters, setFilters, vets, onApply }) => {
    const handleChange = (key, value) => {
        setFilters((f) => ({ ...f, [key]: value, page: 0 }));
    };

    return (
        <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} flexWrap="wrap">
                <TextField
                    select
                    label="Veterinario"
                    size="small"
                    value={filters.veterinarianId}
                    onChange={(e) => handleChange("veterinarianId", e.target.value)}
                    sx={{ minWidth: { xs: "100%", sm: 220 } }}
                >
                    <MenuItem value="">Todos</MenuItem>
                    {vets.map((v) => (
                        <MenuItem key={v.id} value={v.id}>
                            {v.name} {v.surname}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Estado"
                    size="small"
                    value={filters.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    sx={{ minWidth: { xs: "100%", sm: 180 } }}
                >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="PENDIENTE">Pendiente</MenuItem>
                    <MenuItem value="CONFIRMADO">Confirmado</MenuItem>
                    <MenuItem value="CANCELADO">Cancelado</MenuItem>
                    <MenuItem value="ATENDIDO">Atendido</MenuItem>
                </TextField>

                <TextField
                    type="date"
                    label="Desde"
                    size="small"
                    value={filters.fromDate || ""}
                    onChange={(e) => handleChange("fromDate", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    type="date"
                    label="Hasta"
                    size="small"
                    value={filters.toDate || ""}
                    onChange={(e) => handleChange("toDate", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />

                <Button variant="outlined" onClick={onApply}>
                    Aplicar
                </Button>
            </Stack>
        </Paper>
    );
};

export default AppointmentFilters;
