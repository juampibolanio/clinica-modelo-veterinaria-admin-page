import React, { useState, useRef, useCallback } from "react";
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
import { blogFormStyles } from "../styles/blogForm.styles";

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

    const handleChange = (e) =>
        setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleAddImages = useCallback(
        (e) => {
            const files = Array.from(e.target.files);
            e.target.value = null;

            const valid = files.filter((file) => {
                if (!ALLOWED_TYPES.includes(file.type)) {
                    enqueueSnackbar(`Tipo no permitido: ${file.name}`, { variant: "warning" });
                    return false;
                }
                if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                    enqueueSnackbar(`El archivo ${file.name} excede ${MAX_SIZE_MB} MB`, {
                        variant: "warning",
                    });
                    return false;
                }
                return true;
            });

            if (images.length + valid.length > MAX_IMAGES) {
                enqueueSnackbar(`Máximo ${MAX_IMAGES} imágenes`, { variant: "warning" });
                return;
            }
            setImages((prev) => [...prev, ...valid]);
        },
        [images, enqueueSnackbar]
    );

    const handleRemoveImage = (index) =>
        setImages((prev) => prev.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) {
            enqueueSnackbar("Título y contenido son obligatorios", { variant: "warning" });
            return;
        }

        try {
            const data = new FormData();
            data.append(
                "post",
                new Blob([JSON.stringify(formData)], { type: "application/json" })
            );
            images.forEach((f) => data.append("images", f));
            await onSubmit(data);
        } finally {
            setUploadProgress(0);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={blogFormStyles.form}>
            <Stack spacing={4}>
                {/* Title */}
                <TextField
                    label="Título *"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="Escribe un título atractivo para tu publicación"
                    sx={blogFormStyles.textField}
                />

                {/* Subtitle */}
                <TextField
                    label="Subtítulo"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    fullWidth
                    placeholder="Añade un subtítulo descriptivo (opcional)"
                    sx={blogFormStyles.textField}
                />

                {/* Content */}
                <TextField
                    label="Contenido *"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    minRows={10}
                    required
                    placeholder="Escribe el contenido de tu publicación..."
                    sx={blogFormStyles.contentField}
                />

                {/* Images (only for create mode) */}
                {mode === "create" && (
                    <>
                        <Stack sx={blogFormStyles.imagesHeader}>
                            <Typography sx={blogFormStyles.imagesTitle}>
                                Imágenes del artículo
                            </Typography>
                            <Typography sx={blogFormStyles.imageCounter}>
                                {images.length} / {MAX_IMAGES}
                            </Typography>
                        </Stack>

                        <Button
                            variant="outlined"
                            startIcon={<AddPhotoAlternateIcon />}
                            onClick={() => fileRef.current?.click()}
                            disabled={images.length >= MAX_IMAGES}
                            sx={blogFormStyles.addImageButton}
                        >
                            {images.length === 0 ? "Agregar imágenes" : "Agregar más imágenes"}
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
                                {images.map((file, i) => (
                                    <Grid item xs={12} sm={6} md={4} key={i}>
                                        <Box sx={blogFormStyles.imageBox}>
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Preview ${i + 1}`}
                                                style={blogFormStyles.imagePreview}
                                            />
                                            <IconButton
                                                size="small"
                                                onClick={() => handleRemoveImage(i)}
                                                sx={blogFormStyles.deleteImageButton}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </>
                )}

                {uploadProgress > 0 && (
                    <LinearProgress
                        variant="determinate"
                        value={uploadProgress}
                        sx={blogFormStyles.progressBar}
                    />
                )}

                {/* Action buttons */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    mt={4}
                    justifyContent="flex-end"
                >
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={submitting}
                        sx={blogFormStyles.submitButton}
                    >
                        {submitting
                            ? "Guardando..."
                            : mode === "edit"
                                ? "Guardar cambios"
                                : "Publicar artículo"}
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

export default React.memo(BlogForm);
