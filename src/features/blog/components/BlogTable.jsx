import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    Box,
    Stack,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import dayjs from "dayjs";
import React from "react";
import { blogTableStyles } from "../styles/blogTable.styles";

const BlogTable = React.memo(({ rows = [], onDelete }) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    if (isSmall) {
        return (
            <Stack spacing={2}>
                {rows.length > 0 ? (
                    rows.map((r) => (
                        <Box key={r.id} sx={blogTableStyles.mobileCard}>
                            <Typography sx={blogTableStyles.mobileTitle}>{r.title}</Typography>
                            <Typography sx={blogTableStyles.mobileSubtitle}>
                                {r.subtitle || "-"}
                            </Typography>
                            <Typography sx={blogTableStyles.mobileMetadata}>
                                {r.authorFullName} —{" "}
                                {r.publicationDate
                                    ? dayjs(r.publicationDate).format("DD/MM/YYYY HH:mm")
                                    : "-"}
                            </Typography>
                            <Stack sx={blogTableStyles.mobileActions}>
                                <IconButton
                                    color="primary"
                                    href={`/blog/${r.id}/edit`}
                                    sx={blogTableStyles.actionButton}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={() => onDelete(r.id)}
                                    sx={blogTableStyles.actionButton}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                        </Box>
                    ))
                ) : (
                    <Typography sx={blogTableStyles.emptyMessage}>
                        No hay publicaciones
                    </Typography>
                )}
            </Stack>
        );
    }

    return (
        <Box sx={blogTableStyles.tableWrapper}>
            <Table size="small">
                <TableHead sx={blogTableStyles.tableHead}>
                    <TableRow>
                        <TableCell>Título</TableCell>
                        <TableCell>Autor</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Subtítulo</TableCell>
                        <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.length > 0 ? (
                        rows.map((r) => (
                            <TableRow key={r.id} hover sx={blogTableStyles.tableRow}>
                                <TableCell sx={blogTableStyles.tableCell}>
                                    <Stack spacing={0}>
                                        <Typography sx={blogTableStyles.titleCell}>{r.title}</Typography>
                                        <Typography sx={blogTableStyles.contentPreview}>
                                            {r.content.slice(0, 80)}...
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell sx={blogTableStyles.tableCell}>
                                    {r.authorFullName}
                                </TableCell>
                                <TableCell sx={blogTableStyles.tableCell}>
                                    {r.publicationDate
                                        ? dayjs(r.publicationDate).format("DD/MM/YYYY HH:mm")
                                        : "-"}
                                </TableCell>
                                <TableCell sx={blogTableStyles.tableCell}>
                                    {r.subtitle || "-"}
                                </TableCell>
                                <TableCell align="right" sx={blogTableStyles.tableCell}>
                                    <IconButton
                                        color="primary"
                                        href={`/blog/${r.id}/edit`}
                                        sx={blogTableStyles.actionButton}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => onDelete(r.id)}
                                        sx={blogTableStyles.actionButton}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5}>
                                <Typography sx={blogTableStyles.emptyMessage}>
                                    No hay publicaciones
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Box>
    );
});

export default BlogTable;