import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    Stack,
    Pagination,
    CircularProgress,
    Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "notistack";
import { getAllPosts, deletePost } from "../api/blog.api";
import BlogTable from "../components/BlogTable";
import BlogFilters from "../components/BlogFilters";
import ConfirmDialog from "../../../components/common/ConfirmDialog";

const BlogList = () => {
    const { enqueueSnackbar } = useSnackbar();

    // 📊 Estado de datos y control
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(1); // MUI es 1-based, backend 0-based
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(false);

    const [confirm, setConfirm] = useState({ open: false, id: null });

    // 📥 Cargar publicaciones del backend
    const loadPosts = async () => {
        try {
            setLoading(true);
            const res = await getAllPosts({ ...filters, page: page - 1, size: 10 });
            setPosts(res.content || []);
            setTotalPages(res.totalPages);
            setTotalElements(res.totalElements);
        } catch (err) {
            enqueueSnackbar("Error al cargar publicaciones", { variant: "error" }, err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, [page, filters]);

    // 🗑️ Eliminar publicación
    const handleDelete = async () => {
        try {
            await deletePost(confirm.id);
            enqueueSnackbar("Publicación eliminada", { variant: "success" });
            setConfirm({ open: false, id: null });
            loadPosts();
        } catch (err) {
            enqueueSnackbar("Error al eliminar", { variant: "error" }, err);
        }
    };

    return (
        <Stack spacing={3}>
            {/* Header */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                spacing={2}
            >
                <Typography variant="h4" fontWeight={800}>
                    Publicaciones del Blog
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    href="/blog/new"
                >
                    Nueva Publicación
                </Button>
            </Stack>

            {/* Filtros */}
            <BlogFilters onChange={setFilters} />
            <Divider />

            {/* Tabla */}
            {loading ? (
                <Box sx={{ textAlign: "center", py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <BlogTable rows={posts} onDelete={(id) => setConfirm({ open: true, id })} />
            )}

            {/* Paginación */}
            {!loading && totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        color="primary"
                        shape="rounded"
                    />
                </Box>
            )}

            {/* Contador total */}
            {!loading && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ mt: 1 }}
                >
                    {totalElements} publicaciones en total
                </Typography>
            )}

            {/* Diálogo de confirmación */}
            <ConfirmDialog
                open={confirm.open}
                onClose={() => setConfirm({ open: false, id: null })}
                onConfirm={handleDelete}
                title="Eliminar publicación"
                message="¿Seguro que deseas eliminar esta publicación?"
            />
        </Stack>
    );
};

export default BlogList;
