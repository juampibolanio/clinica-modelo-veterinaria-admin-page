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
import { blogListStyles } from "../styles/blogList.styles";
import { useNavigate } from "react-router-dom";

const BlogList = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(false);
    const [confirm, setConfirm] = useState({ open: false, id: null });
    const [meta, setMeta] = useState({ totalPages: 0, totalElements: 0 });

    // Load posts with filters and pagination
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
    }, [page, filters, enqueueSnackbar]);

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    // Delete a post
    const handleDelete = async () => {
        try {
            await deletePost(confirm.id);
            enqueueSnackbar("Publicación eliminada correctamente ✅", {
                variant: "success",
            });
            setConfirm({ open: false, id: null });
            loadPosts();
        } catch {
            enqueueSnackbar("Error al eliminar la publicación", { variant: "error" });
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
                sx={{ mb: { xs: 2, sm: 3 }, px: 0.5 }}
            >
                <Typography variant="h4" sx={blogListStyles.title}>
                    Publicaciones del Blog
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/blog/new")}
                    sx={blogListStyles.addButton}
                >
                    Nueva Publicación
                </Button>
            </Stack>

            {/* Filters */}
            <BlogFilters onChange={setFilters} />

            <Divider sx={blogListStyles.divider} />

            {/* Content */}
            {loading ? (
                <Box sx={blogListStyles.loadingBox}>
                    <CircularProgress />
                </Box>
            ) : (
                <BlogTable
                    rows={posts}
                    onDelete={(id) => setConfirm({ open: true, id })}
                />
            )}

            {/* Pagination */}
            {!loading && meta.totalPages > 1 && (
                <Box sx={blogListStyles.paginationBox}>
                    <Pagination
                        count={meta.totalPages}
                        page={page}
                        onChange={(e, val) => setPage(val)}
                        color="primary"
                        shape="rounded"
                        sx={blogListStyles.pagination}
                    />
                </Box>
            )}

            {/* Total count */}
            {!loading && (
                <Typography variant="body2" sx={blogListStyles.totalText}>
                    {meta.totalElements} publicaciones en total
                </Typography>
            )}

            {/* Delete confirmation dialog */}
            <ConfirmDialog
                open={confirm.open}
                onClose={() => setConfirm({ open: false, id: null })}
                onConfirm={handleDelete}
                title="Eliminar publicación"
                message="¿Seguro que deseas eliminar esta publicación? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
            />
        </Stack>
    );
};

export default React.memo(BlogList);
