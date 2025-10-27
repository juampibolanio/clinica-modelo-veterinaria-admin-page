import React, { useEffect, useState, useCallback } from "react";
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
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(false);
    const [confirm, setConfirm] = useState({ open: false, id: null });
    const [meta, setMeta] = useState({ totalPages: 0, totalElements: 0 });

    const loadPosts = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getAllPosts({ ...filters, page: page - 1, size: 10 });
            setPosts(res.content || []);
            setMeta({ totalPages: res.totalPages, totalElements: res.totalElements });
        } catch {
            enqueueSnackbar("Error al cargar publicaciones", { variant: "error" });
        } finally {
            setLoading(false);
        }
    }, [page, filters]);

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    const handleDelete = async () => {
        try {
            await deletePost(confirm.id);
            enqueueSnackbar("Publicación eliminada", { variant: "success" });
            setConfirm({ open: false, id: null });
            loadPosts();
        } catch {
            enqueueSnackbar("Error al eliminar", { variant: "error" });
        }
    };

    return (
        <Stack spacing={3}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                spacing={2}
            >
                <Typography variant="h4" fontWeight={800}>
                    Publicaciones del Blog
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} href="/blog/new">
                    Nueva Publicación
                </Button>
            </Stack>

            <BlogFilters onChange={setFilters} />
            <Divider />

            {loading ? (
                <Box textAlign="center" py={6}>
                    <CircularProgress />
                </Box>
            ) : (
                <BlogTable rows={posts} onDelete={(id) => setConfirm({ open: true, id })} />
            )}

            {!loading && meta.totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Pagination
                        count={meta.totalPages}
                        page={page}
                        onChange={(e, val) => setPage(val)}
                        color="primary"
                        shape="rounded"
                    />
                </Box>
            )}

            {!loading && (
                <Typography variant="body2" color="text.secondary" align="center">
                    {meta.totalElements} publicaciones en total
                </Typography>
            )}

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

export default React.memo(BlogList);
