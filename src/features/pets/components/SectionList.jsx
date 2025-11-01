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
import AddIcon from "@mui/icons-material/Add";

/**
 * This component renders a section list with a header, optional create button,
 * and a list of items. It handles loading and empty states.
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
    <Paper
        elevation={0}
        sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            border: "1px solid rgba(55,129,227,0.12)",
            bgcolor: "background.paper",
            boxShadow: "0 2px 10px rgba(55,129,227,0.08)",
            width: "100%",
        }}
    >
        {/* Header */}
        <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            flexWrap="wrap"
            mb={2}
            gap={1}
        >
            <Stack direction="row" alignItems="center" spacing={1}>
                {icon}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: "#212121",
                        background: "linear-gradient(135deg, #3781E3 0%, #7027A0 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {title}
                </Typography>
            </Stack>

            {onCreate && (
                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    onClick={onCreate}
                    sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        alignSelf: { xs: "flex-end", sm: "center" },
                        background: "linear-gradient(135deg, #3781E3 0%, #5a9aeb 100%)",
                        boxShadow: "0 3px 10px rgba(55,129,227,0.25)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #2970d2 0%, #4989da 100%)",
                            transform: "translateY(-2px)",
                        },
                    }}
                >
                    {createLabel}
                </Button>
            )}
        </Stack>

        <Divider sx={{ mb: 2, borderColor: "rgba(55,129,227,0.15)" }} />

        {/* Content */}
        {loading ? (
            <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress size={28} />
            </Box>
        ) : items.length === 0 ? (
            <Typography color="text.secondary" fontStyle="italic">
                {emptyText}
            </Typography>
        ) : (
            items.map((item) => (
                <Box key={item.id || Math.random()} sx={{ py: 1 }}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        flexWrap="wrap"
                    >
                        {renderItem(item)}
                    </Stack>
                    <Divider sx={{ mt: 1, borderColor: "rgba(55,129,227,0.1)" }} />
                </Box>
            ))
        )}
    </Paper>
);
