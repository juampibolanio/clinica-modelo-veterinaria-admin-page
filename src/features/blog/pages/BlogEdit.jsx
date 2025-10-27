import React, { useEffect, useRef, useState } from "react";
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

    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        content: "",
    });

    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);

    // 🟢 Cargar post
    useEffect(() => {
        const loadPost = async () => {
            try {
                setLoading(true);
                const data = await getPostById(id);
                setFormData({
                    title: data.title || "",
                    subtitle: data.subtitle || "",
                    content: data.content || "",
                });
                setExistingImages(data.images || []);
            } catch (err) {
                console.error("Error cargando publicación:", err);
                enqueueSnackbar("Error al cargar la publicación", { variant: "error" });
                navigate("/blog");
            } finally {
                setLoading(false);
            }
        };
        loadPost();
    }, [id, navigate, enqueueSnackbar]);

    // 🟢 Handlers básicos
    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // 🟢 Imagenes existentes
    const handleRemoveExisting = (id) => {
        setExistingImages((prev) => prev.filter((img) => img.id !== id));
    };

    const handleUpdateDescription = (id, description) => {
        setExistingImages((prev) =>
            prev.map((img) => (img.id === id ? { ...img, description } : img))
        );
    };

    // 🟢 Nuevas imágenes
    const handleAddImages = (e) => {
        const files = Array.from(e.target.files);
        e.target.value = null;

        const validFiles = files.filter((file) => {
            if (!ALLOWED_TYPES.includes(file.type)) {
                enqueueSnackbar(`Tipo no permitido: ${file.name}`, { variant: "warning" });
                return false;
            }
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                enqueueSnackbar(`El archivo ${file.name} excede ${MAX_SIZE_MB} MB`, { variant: "warning" });
                return false;
            }
            return true;
        });

        if (existingImages.length + newImages.length + validFiles.length > MAX_IMAGES) {
            enqueueSnackbar(`Máximo ${MAX_IMAGES} imágenes permitidas`, { variant: "warning" });
            return;
        }

        setNewImages((prev) => [...prev, ...validFiles]);
    };

    const handleRemoveNew = (index) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
    };

    // 🟢 Guardar cambios (texto + imágenes)
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

            await patchPostUnified(id, {
                post: postPayload,
                newImages,
            });

            enqueueSnackbar("Publicación actualizada correctamente", { variant: "success" });
            navigate("/blog");
        } catch (err) {
            console.error("❌ Error al guardar:", err);
            setError("Error al actualizar la publicación");
            enqueueSnackbar("Error al actualizar la publicación", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };


    const handleCancel = () => {
        navigate("/blog");
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

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

                {/* Campos de texto */}
                <TextField
                    label="Título"
                    name="title"
                    fullWidth
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Subtítulo"
                    name="subtitle"
                    fullWidth
                    value={formData.subtitle}
                    onChange={handleChange}
                />
                <TextField
                    label="Contenido"
                    name="content"
                    fullWidth
                    multiline
                    minRows={6}
                    value={formData.content}
                    onChange={handleChange}
                    required
                />

                <Divider sx={{ my: 2 }} />

                {/* Gestión de imágenes */}
                <Typography variant="h6" fontWeight={700}>
                    Imágenes del post ({existingImages.length + newImages.length} / {MAX_IMAGES})
                </Typography>

                {/* Imágenes existentes */}
                {existingImages.length > 0 && (
                    <Grid container spacing={2}>
                        {existingImages.map((img) => (
                            <Grid item xs={12} sm={6} md={4} key={img.id}>
                                <Box
                                    sx={{
                                        position: "relative",
                                        border: 1,
                                        borderColor: "grey.300",
                                        borderRadius: 2,
                                        p: 1,
                                    }}
                                >
                                    <img
                                        src={img.url}
                                        alt={img.description || `Imagen ${img.id}`}
                                        style={{
                                            width: "100%",
                                            height: 140,
                                            objectFit: "cover",
                                            borderRadius: 6,
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
                                        onChange={(e) => handleUpdateDescription(img.id, e.target.value)}
                                        sx={{ mt: 1 }}
                                    />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Nuevas imágenes */}
                {newImages.length > 0 && (
                    <Grid container spacing={2}>
                        {newImages.map((file, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Box
                                    sx={{
                                        position: "relative",
                                        border: 2,
                                        borderColor: "primary.main",
                                        borderRadius: 2,
                                        p: 1,
                                        bgcolor: "primary.50",
                                    }}
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`nueva-imagen-${index}`}
                                        style={{
                                            width: "100%",
                                            height: 140,
                                            objectFit: "cover",
                                            borderRadius: 6,
                                        }}
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemoveNew(index)}
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
                                    <Typography
                                        variant="body2"
                                        sx={{ mt: 1, textAlign: "center", fontStyle: "italic" }}
                                    >
                                        {file.name}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Botones */}
                <Stack direction="row" spacing={2} mt={3}>
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

                <Stack direction="row" spacing={2} mt={4}>
                    <Button type="submit" variant="contained" disabled={saving}>
                        {saving ? "Guardando..." : "Guardar cambios"}
                    </Button>

                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleCancel}
                        disabled={saving}
                    >
                        Cancelar
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};

export default BlogEdit;
