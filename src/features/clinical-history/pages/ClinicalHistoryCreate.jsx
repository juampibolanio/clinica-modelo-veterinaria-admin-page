import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import ClinicalHistoryForm from "../components/ClinicalHistoryForm";
import { createClinicalHistory } from "../api/clinical-history.api";
import { CONSULTATION_TYPES } from "../constants/consultation-types";

const ClinicalHistoryCreate = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    // Permite precargar petId via query (?petId=123)
    const [searchParams] = useSearchParams();
    const presetPetId = searchParams.get("petId");

    const handleSubmit = async (form) => {
        try {
            setSaving(true);
            const payload = { ...form, petId: form.petId || Number(presetPetId) || undefined };
            await createClinicalHistory(payload);
            enqueueSnackbar("Historia clínica creada", { variant: "success" });
            navigate("/clinical-history");
        } catch {
            enqueueSnackbar("No se pudo crear la historia", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>Nueva historia clínica</Typography>
            <ClinicalHistoryForm
                initialValues={{ petId: presetPetId ? Number(presetPetId) : "", consultationType: CONSULTATION_TYPES[0] }}
                onSubmit={handleSubmit}
                saving={saving}
            />
        </Stack>
    );
};

export default ClinicalHistoryCreate;
