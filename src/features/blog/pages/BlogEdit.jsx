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
import { blogEditStyles } from "../styles/blogEdit.styles";
import { blogFormStyles } from "../styles/blogForm.styles";

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

    // --- Load post data ---
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
    }, [id, enqueueSnackbar, navigate]);

    useEffect(() => {
        loadPost();
    }, [loadPost]);

    // --- Handle save ---
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

    // --- Handle image logic ---
    const handleAddImages = (e) => {
        const files = Array.from(e.target.files);
        e.target.value = null;
        const valid = files.filter(
            (f) => ALLOWED_TYPES.includes(f.type) && f.size <= MAX_SIZE_MB * 1024 * 1024
        );
        if (existingImages.length + newImages.length + valid.length > MAX_IMAGES) {
            enqueueSnackbar(`Máximo ${MAX_IMAGES} imágenes`, { variant: "warning" });
            return;
        }
        setNewImages((prev) => [...prev, ...valid]);
    };

    const handleRemoveExisting = (imageId) =>
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));

    const handleRemoveNew = (i) => setNewImages((prev) => prev.filter((_, idx) => idx !== i));

    // --- Loading state ---
    if (loading)
        return (
            <Box sx={blogEditStyles.loadingBox}>
                <CircularProgress />
            </Box>
        );

    return (
        <Box component="form" onSubmit={handleSave} noValidate sx={blogEditStyles.container}>
            <Stack spacing={4}>
                {/* Header */}
                <Typography variant="h4" sx={blogEditStyles.title}>
                    Editar Publicación
                </Typography>

                {error && (
                    <Alert severity="error" onClose={() => setError(null)} sx={blogEditStyles.alert}>
                        {error}
                    </Alert>
                )}

                {/* Form fields */}
                <TextField
                    label="Título *"
                    name="title"
                    fullWidth
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    sx={blogFormStyles.textField}
                />
                <TextField
                    label="Subtítulo"
                    name="subtitle"
                    fullWidth
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    sx={blogFormStyles.textField}
                />
                <TextField
                    label="Contenido *"
                    name="content"
                    fullWidth
                    multiline
                    minRows={10}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    sx={blogFormStyles.contentField}
                />

                {/* Divider */}
                <Divider sx={blogEditStyles.divider} />

                {/* Image Section */}
                <Stack spacing={3}>
                    <Stack sx={blogEditStyles.sectionHeader}>
                        <Typography sx={blogEditStyles.sectionTitle}>
                            Imágenes del artículo
                        </Typography>
                        <Typography sx={blogEditStyles.imageCounter}>
                            {existingImages.length + newImages.length} / {MAX_IMAGES}
                        </Typography>
                    </Stack>

                    <Grid container spacing={2}>
                        {existingImages.map((img) => (
                            <Grid item xs={12} sm={6} md={4} key={img.id}>
                                <Box sx={blogFormStyles.imageBox}>
                                    <img src={img.url} alt="" style={blogFormStyles.imagePreview} />
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemoveExisting(img.id)}
                                        sx={blogFormStyles.deleteImageButton}
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
                                        sx={blogFormStyles.imageDescriptionField}
                                    />
                                </Box>
                            </Grid>
                        ))}

                        {newImages.map((f, i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Box sx={blogFormStyles.imageBox}>
                                    <img
                                        src={URL.createObjectURL(f)}
                                        alt=""
                                        style={blogFormStyles.imagePreview}
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemoveNew(i)}
                                        sx={blogFormStyles.deleteImageButton}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            startIcon={<AddPhotoAlternateIcon />}
                            onClick={() => fileRef.current?.click()}
                            disabled={saving || existingImages.length + newImages.length >= MAX_IMAGES}
                            sx={blogFormStyles.addImageButton}
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
                </Stack>

                {/* Action Buttons */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    mt={4}
                    justifyContent="flex-end"
                >
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={saving}
                        fullWidth
                        sx={blogFormStyles.submitButton}
                    >
                        {saving ? "Guardando..." : "Guardar cambios"}
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate("/blog")}
                        fullWidth
                        sx={blogFormStyles.cancelButton}
                    >
                        Cancelar
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};

export default React.memo(BlogEdit);
