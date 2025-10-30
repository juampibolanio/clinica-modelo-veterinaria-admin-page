import React, { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import BlogForm from "../components/BlogForm";
import axios from "../../../libs/axios";
import { blogCreateStyles } from "../styles/blogCreate.styles";

const BlogCreate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await axios.post("/api/posts", formData);
      enqueueSnackbar("Publicación creada correctamente", { variant: "success" });
      navigate("/blog");
    } catch {
      enqueueSnackbar("Error al crear la publicación", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack sx={blogCreateStyles.container}>
      <Typography variant="h4" sx={blogCreateStyles.title}>
        Nueva Publicación
      </Typography>
      <Typography sx={blogCreateStyles.subtitle}>
        Crea una nueva entrada para el blog de la clínica
      </Typography>
      <BlogForm onSubmit={handleSubmit} submitting={loading} mode="create" />
    </Stack>
  );
};

export default React.memo(BlogCreate);
