import React, { useEffect, useState } from "react";
import { Stack, Typography, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import {
    getAppliedVaccineById,
    patchAppliedVaccine,
} from "../api/applied-vaccines.api";
import AppliedVaccineForm from "../components/AppliedVaccineForm";

const AppliedVaccineEdit = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { id } = useParams();

    const [vaccine, setVaccine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        try {
            const data = await getAppliedVaccineById(id);
            setVaccine(data);
        } catch {
            enqueueSnackbar("Error al cargar los datos de la vacuna", {
                variant: "error",
            });
            navigate("/applied-vaccines");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleSubmit = async (formData) => {
        try {
            setSaving(true);
            await patchAppliedVaccine(id, formData);
            enqueueSnackbar("Vacuna actualizada correctamente", {
                variant: "success",
            });
            navigate("/applied-vaccines");
        } catch {
            enqueueSnackbar("Error al actualizar la vacuna", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return (
            <Stack alignItems="center" mt={4}>
                <CircularProgress />
            </Stack>
        );

    return (
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>
                Editar Vacuna Aplicada
            </Typography>
            <AppliedVaccineForm
                initialValues={vaccine}
                onSubmit={handleSubmit}
                saving={saving}
                petId={vaccine?.petId}
            />
        </Stack>
    );
};

export default AppliedVaccineEdit;
