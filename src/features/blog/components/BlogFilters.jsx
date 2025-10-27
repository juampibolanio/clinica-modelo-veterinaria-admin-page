import React, { useEffect, useState } from "react";
import {
    Box, TextField, Stack, InputAdornment, Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";

const BlogFilters = ({ onChange }) => {
    const [keyword, setKeyword] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange?.({ keyword, fromDate, toDate });
        }, 400);
        return () => clearTimeout(timeout);
    }, [keyword, fromDate, toDate]);

    const clearFilters = () => {
        setKeyword("");
        setFromDate("");
        setToDate("");
        onChange?.({});
    };

    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
        >
            <TextField
                placeholder="Buscar por título o subtítulo..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                fullWidth
            />
            <TextField
                type="date"
                label="Desde"
                InputLabelProps={{ shrink: true }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
            />
            <TextField
                type="date"
                label="Hasta"
                InputLabelProps={{ shrink: true }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
            />
            <Button color="secondary" variant="outlined" onClick={clearFilters}>
                Limpiar
            </Button>
        </Stack>
    );
};

export default BlogFilters;
