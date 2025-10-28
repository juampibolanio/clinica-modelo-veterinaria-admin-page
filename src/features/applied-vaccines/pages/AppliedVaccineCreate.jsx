import React, { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createAppliedVaccine } from "../api/applied-vaccines.api";
import AppliedVaccineForm from "../components/AppliedVaccineForm";

const AppliedVaccineCreate = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const petId = searchParams.get("petId");

    const [saving, setSaving] = useState(false);

    const handleSubmit = async (formData) => {
        try {
            setSaving(true);
            await createAppliedVaccine(formData);
            enqueueSnackbar("Vacuna registrada correctamente", { variant: "success" });
            if (petId) navigate(`/pets/${petId}`);
            else navigate("/applied-vaccines");
        } catch {
            enqueueSnackbar("Error al registrar la vacuna", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>
                Nueva Vacuna Aplicada
            </Typography>
            <AppliedVaccineForm onSubmit={handleSubmit} saving={saving} petId={petId} />
        </Stack>
    );
};

export default AppliedVaccineCreate;
