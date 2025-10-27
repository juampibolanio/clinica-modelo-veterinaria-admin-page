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

const BlogTable = React.memo(({ rows = [], onDelete }) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    if (isSmall) {
        return (
            <Stack spacing={2}>
                {rows.length > 0 ? (
                    rows.map((r) => (
                        <Box
                            key={r.id}
                            sx={{
                                p: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2,
                                boxShadow: 1,
                            }}
                        >
                            <Typography fontWeight={700}>{r.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {r.subtitle || "-"}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                {r.authorFullName} —{" "}
                                {r.publicationDate
                                    ? dayjs(r.publicationDate).format("DD/MM/YYYY HH:mm")
                                    : "-"}
                            </Typography>
                            <Stack direction="row" spacing={1} mt={1}>
                                <IconButton color="primary" href={`/blog/${r.id}/edit`}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => onDelete(r.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                        </Box>
                    ))
                ) : (
                    <Typography color="text.secondary" align="center">
                        No hay publicaciones
                    </Typography>
                )}
            </Stack>
        );
    }

    return (
        <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
                <TableHead>
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
                            <TableRow key={r.id} hover>
                                <TableCell>
                                    <Stack spacing={0}>
                                        <Typography fontWeight={700}>{r.title}</Typography>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {r.content.slice(0, 80)}...
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>{r.authorFullName}</TableCell>
                                <TableCell>
                                    {r.publicationDate
                                        ? dayjs(r.publicationDate).format("DD/MM/YYYY HH:mm")
                                        : "-"}
                                </TableCell>
                                <TableCell>{r.subtitle || "-"}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" href={`/blog/${r.id}/edit`}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => onDelete(r.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5}>
                                <Typography color="text.secondary" align="center">
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
