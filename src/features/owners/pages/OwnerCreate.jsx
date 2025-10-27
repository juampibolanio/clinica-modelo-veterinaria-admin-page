import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import OwnerForm from "../components/OwnerForm";
import { createOwner } from "../api/owners.api";

const OwnerCreate = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData) => {
        try {
            setLoading(true);
            await createOwner(formData);
            enqueueSnackbar("Dueño creado correctamente", { variant: "success" });
            navigate("/owners");
        } catch {
            enqueueSnackbar("Error al crear el dueño", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack spacing={2} sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography variant="h4" fontWeight={800}>
                Nuevo Dueño
            </Typography>
            <OwnerForm onSubmit={handleSubmit} submitting={loading} />
        </Stack>
    );
};

export default OwnerCreate;
