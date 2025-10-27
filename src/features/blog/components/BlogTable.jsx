import {
    Table, TableBody, TableCell, TableHead, TableRow,
    IconButton, Typography, Box, Stack
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import dayjs from "dayjs";

const BlogTable = ({ rows = [], onDelete }) => {
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
                                    <Stack direction="column" spacing={0}>
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
                                    <IconButton
                                        color="primary"
                                        href={`/blog/${r.id}/edit`}
                                        aria-label="Editar"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => onDelete(r.id)}
                                        aria-label="Eliminar"
                                    >
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
};

export default BlogTable;
