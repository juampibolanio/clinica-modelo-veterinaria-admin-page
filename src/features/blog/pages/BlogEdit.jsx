import React, { useEffect, useRef, useState, useCallback } from "react";
import {
    Box,
    Stack,
    Typography,
    TextField,
    Grid,
    IconButton,
    Button,
    CircularProgress,
    Divider,
    Alert,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, patchPostUnified } from "../api/blog.api";

const MAX_IMAGES = 5;
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const BlogEdit = () => {
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const fileRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ title: "", subtitle: "", content: "" });
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);

    const loadPost = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getPostById(id);
            setFormData({
                title: data.title || "",
                subtitle: data.subtitle || "",
                content: data.content || "",
            });
            setExistingImages(data.images || []);
        } catch {
            enqueueSnackbar("Error al cargar la publicación", { variant: "error" });
            navigate("/blog");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadPost();
    }, [loadPost]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) {
            enqueueSnackbar("El título y contenido son obligatorios", { variant: "warning" });
            return;
        }
        try {
            setSaving(true);
            setError(null);
            const postPayload = {
                title: formData.title,
                subtitle: formData.subtitle,
                content: formData.content,
                keepImageIds: existingImages.map((img) => img.id),
                imageDescriptions: existingImages.map((img) => img.description || ""),
            };
            await patchPostUnified(id, { post: postPayload, newImages });
            enqueueSnackbar("Publicación actualizada correctamente", { variant: "success" });
            navigate("/blog");
        } catch {
            enqueueSnackbar("Error al actualizar la publicación", { variant: "error" });
            setError("Error al actualizar la publicación");
        } finally {
            setSaving(false);
        }
    };

    const handleAddImages = (e) => {
        const files = Array.from(e.target.files);
        e.target.value = null;
        const valid = files.filter(
            (f) =>
                ALLOWED_TYPES.includes(f.type) &&
                f.size <= MAX_SIZE_MB * 1024 * 1024
        );
        if (existingImages.length + newImages.length + valid.length > MAX_IMAGES) {
            enqueueSnackbar(`Máximo ${MAX_IMAGES} imágenes`, { variant: "warning" });
            return;
        }
        setNewImages((prev) => [...prev, ...valid]);
    };

    const handleRemoveExisting = (id) =>
        setExistingImages((prev) => prev.filter((img) => img.id !== id));

    const handleRemoveNew = (i) =>
        setNewImages((prev) => prev.filter((_, idx) => idx !== i));

    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );

    return (
        <Box component="form" onSubmit={handleSave} noValidate>
            <Stack spacing={4}>
                <Typography variant="h4" fontWeight={800}>
                    Editar Publicación
                </Typography>

                {error && (
                    <Alert severity="error" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <TextField
                    label="Título"
                    name="title"
                    fullWidth
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />
                <TextField
                    label="Subtítulo"
                    name="subtitle"
                    fullWidth
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
                <TextField
                    label="Contenido"
                    name="content"
                    fullWidth
                    multiline
                    minRows={6}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                />

                <Divider />

                <Typography variant="h6" fontWeight={700}>
                    Imágenes del post ({existingImages.length + newImages.length}/{MAX_IMAGES})
                </Typography>

                <Grid container spacing={2}>
                    {existingImages.map((img) => (
                        <Grid item xs={12} sm={6} md={4} key={img.id}>
                            <Box sx={{ position: "relative" }}>
                                <img
                                    src={img.url}
                                    alt=""
                                    style={{
                                        width: "100%",
                                        height: 140,
                                        objectFit: "cover",
                                        borderRadius: 8,
                                    }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={() => handleRemoveExisting(img.id)}
                                    sx={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        bgcolor: "error.main",
                                        color: "white",
                                        "&:hover": { bgcolor: "error.dark" },
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Descripción"
                                    value={img.description || ""}
                                    onChange={(e) =>
                                        setExistingImages((prev) =>
                                            prev.map((im) =>
                                                im.id === img.id ? { ...im, description: e.target.value } : im
                                            )
                                        )
                                    }
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                        </Grid>
                    ))}

                    {newImages.map((f, i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                            <Box sx={{ position: "relative" }}>
                                <img
                                    src={URL.createObjectURL(f)}
                                    alt=""
                                    style={{
                                        width: "100%",
                                        height: 140,
                                        objectFit: "cover",
                                        borderRadius: 8,
                                    }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={() => handleRemoveNew(i)}
                                    sx={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        bgcolor: "error.main",
                                        color: "white",
                                        "&:hover": { bgcolor: "error.dark" },
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                <Stack direction="row" spacing={2} mt={2}>
                    <Button
                        variant="outlined"
                        startIcon={<AddPhotoAlternateIcon />}
                        onClick={() => fileRef.current?.click()}
                        disabled={saving || existingImages.length + newImages.length >= MAX_IMAGES}
                    >
                        Agregar imágenes
                    </Button>
                    <input
                        ref={fileRef}
                        type="file"
                        multiple
                        hidden
                        accept={ALLOWED_TYPES.join(",")}
                        onChange={handleAddImages}
                    />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={4}>
                    <Button type="submit" variant="contained" disabled={saving} fullWidth>
                        {saving ? "Guardando..." : "Guardar cambios"}
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate("/blog")}
                        fullWidth
                    >
                        Cancelar
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};

export default React.memo(BlogEdit);
