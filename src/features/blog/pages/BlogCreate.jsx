// src/features/blog/pages/BlogCreate.jsx
import React, { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import BlogForm from "../components/BlogForm";
import axios from "../../../libs/axios";

const BlogCreate = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData, config) => {
        try {
            setLoading(true);
            await axios.post("/api/posts", formData, config);
            enqueueSnackbar("Publicación creada correctamente", { variant: "success" });
            navigate("/blog");
        } catch (err) {
            console.error("❌ Error al crear publicación:", err);
            enqueueSnackbar("Error al crear la publicación", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>
                Nueva Publicación
            </Typography>
            <BlogForm onSubmit={handleSubmit} submitting={loading} mode="create" />
        </Stack>
    );
};

export default BlogCreate;
