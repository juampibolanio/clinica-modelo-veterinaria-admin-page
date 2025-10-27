import React, { useEffect, useState } from "react";
import {
    Stack,
    TextField,
    InputAdornment,
    Button,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";

const BlogFilters = React.memo(({ onChange }) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const [filters, setFilters] = useState({ keyword: "", fromDate: "", toDate: "" });

    useEffect(() => {
        const timeout = setTimeout(() => onChange?.(filters), 350);
        return () => clearTimeout(timeout);
    }, [filters]);

    const clearFilters = () => {
        const reset = { keyword: "", fromDate: "", toDate: "" };
        setFilters(reset);
        onChange?.(reset);
    };

    return (
        <Stack
            direction={isSmall ? "column" : "row"}
            spacing={2}
            alignItems={isSmall ? "stretch" : "center"}
            sx={{ width: "100%" }}
        >
            <TextField
                placeholder="Buscar por título o subtítulo..."
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                fullWidth
                size="small"
            />
            <TextField
                type="date"
                label="Desde"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={filters.fromDate}
                onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            />
            <TextField
                type="date"
                label="Hasta"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={filters.toDate}
                onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            />
            <Button
                variant="outlined"
                color="secondary"
                onClick={clearFilters}
                size="small"
                fullWidth={isSmall}
            >
                Limpiar
            </Button>
        </Stack>
    );
});

export default BlogFilters;
