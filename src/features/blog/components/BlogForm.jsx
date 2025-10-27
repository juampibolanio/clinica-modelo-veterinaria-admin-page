import React, { useState, useRef } from "react";
import {
    Box,
    TextField,
    Button,
    Stack,
    Typography,
    Grid,
    IconButton,
    LinearProgress,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const MAX_IMAGES = 5;
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const BlogForm = ({ onSubmit, defaultValues = {}, submitting, mode }) => {
    const { enqueueSnackbar } = useSnackbar();
    const fileRef = useRef(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: defaultValues.title || "",
        subtitle: defaultValues.subtitle || "",
        content: defaultValues.content || "",
    });

    const [images, setImages] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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

        if (images.length + validFiles.length > MAX_IMAGES) {
            enqueueSnackbar(`Máximo ${MAX_IMAGES} imágenes permitidas`, { variant: "warning" });
            return;
        }

        setImages((prev) => [...prev, ...validFiles]);
    };

    const handleRemoveImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            enqueueSnackbar("El título y contenido son obligatorios", { variant: "warning" });
            return;
        }

        try {
            const data = new FormData();
            data.append("post", new Blob([JSON.stringify(formData)], { type: "application/json" }));
            images.forEach((file) => data.append("images", file));

            await onSubmit(data);
            setUploadProgress(0);
        } catch (error) {
            setUploadProgress(0);
        }
    };

    const handleCancel = () => {
        navigate("/blog"); // 🔙 volver al listado de posts
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
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

                {mode === "create" && (
                    <Box>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                            <Typography variant="h6" fontWeight={700}>
                                Imágenes del post
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {images.length} / {MAX_IMAGES}
                            </Typography>
                        </Stack>

                        <Button
                            variant="outlined"
                            startIcon={<AddPhotoAlternateIcon />}
                            onClick={() => fileRef.current?.click()}
                            sx={{ mb: 2 }}
                            disabled={images.length >= MAX_IMAGES}
                        >
                            {images.length >= MAX_IMAGES ? "Límite alcanzado" : "Seleccionar imágenes"}
                        </Button>

                        <input
                            type="file"
                            ref={fileRef}
                            multiple
                            hidden
                            accept={ALLOWED_TYPES.join(",")}
                            onChange={handleAddImages}
                        />

                        {images.length > 0 && (
                            <Grid container spacing={2}>
                                {images.map((file, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Box sx={{ position: "relative" }}>
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`preview-${index}`}
                                                style={{
                                                    width: "100%",
                                                    height: 150,
                                                    objectFit: "cover",
                                                    borderRadius: 8,
                                                }}
                                            />
                                            <IconButton
                                                size="small"
                                                onClick={() => handleRemoveImage(index)}
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
                        )}
                    </Box>
                )}

                {uploadProgress > 0 && uploadProgress < 100 && (
                    <Box sx={{ width: "100%", mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" mb={0.5}>
                            Subiendo imágenes... {uploadProgress}%
                        </Typography>
                        <LinearProgress variant="determinate" value={uploadProgress} />
                    </Box>
                )}

                {/* 🟢 Botones de acción */}
                <Stack direction="row" spacing={2} mt={2}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={submitting}
                    >
                        {submitting
                            ? "Guardando..."
                            : mode === "edit"
                                ? "Guardar cambios"
                                : "Crear publicación"}
                    </Button>

                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleCancel}
                    >
                        Cancelar
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};

export default BlogForm;
