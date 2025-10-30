import React from "react";
import {
    Box,
    Stack,
    Typography,
    Divider,
    Button,
    CircularProgress,
    Paper as MuiPaper,
} from "@mui/material";

/**
 * This component renders a section list with a header, optional create button, and a list of items.
 * 
 */
export const SectionList = ({
    icon,
    title,
    items = [],
    loading = false,
    emptyText = "",
    createLabel,
    onCreate,
    renderItem,
    Paper = MuiPaper, 
}) => (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, width: "100%" }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            {icon}
            <Typography variant="h6" fontWeight={700}>
                {title}
            </Typography>
            {onCreate && (
                <Button
                    variant="contained"
                    sx={{ ml: "auto" }}
                    onClick={onCreate}
                >
                    {createLabel}
                </Button>
            )}
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Content */}
        {loading ? (
            <CircularProgress />
        ) : items.length === 0 ? (
            <Typography color="text.secondary">{emptyText}</Typography>
        ) : (
            items.map((item) => (
                <Box key={item.id} sx={{ py: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        {renderItem(item)}
                    </Stack>
                    <Divider sx={{ mt: 1 }} />
                </Box>
            ))
        )}
    </Paper>
);
