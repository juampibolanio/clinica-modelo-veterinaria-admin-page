import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import ClinicalHistoryForm from "../components/ClinicalHistoryForm";
import { createClinicalHistory } from "../api/clinical-history.api";
import { CONSULTATION_TYPES } from "../constants/consultation-types";
import { getProductById, patchProduct } from "../../products/api/products.api"; // 🆕 import necesarios

const ClinicalHistoryCreate = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [searchParams] = useSearchParams();
    const presetPetId = searchParams.get("petId");

    const handleSubmit = async (form) => {
        try {
            setSaving(true);

            // 🔹 Armamos el payload final
            const payload = {
                ...form,
                petId: form.petId || Number(presetPetId) || undefined,
            };

            // 1️⃣ Crear la historia clínica
            const created = await createClinicalHistory(payload);

            // 2️⃣ Descontar stock de productos utilizados (si existen)
            if (payload.usedProductIds?.length) {
                for (const id of payload.usedProductIds) {
                    try {
                        const product = await getProductById(id);
                        if (product.stock > 0) {
                            await patchProduct(id, { stock: product.stock - 1 });
                        } else {
                            enqueueSnackbar(
                                `⚠️ El producto "${product.name}" no tiene stock suficiente.`,
                                { variant: "warning" }
                            );
                        }
                    } catch {
                        enqueueSnackbar(
                            `Error al actualizar el stock de un producto (ID ${id}).`,
                            { variant: "error" }
                        );
                    }
                }
            }

            enqueueSnackbar("Historia clínica creada correctamente", { variant: "success" });

            // 3️⃣ Redirigir: si venís desde una mascota, volver a su detalle
            if (presetPetId) navigate(`/pets/${presetPetId}`);
            else navigate("/clinical-history");
        } catch (err) {
            console.error(err);
            enqueueSnackbar("No se pudo crear la historia clínica", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>
                Nueva historia clínica
            </Typography>
            <ClinicalHistoryForm
                initialValues={{
                    petId: presetPetId ? Number(presetPetId) : "",
                    consultationType: CONSULTATION_TYPES[0],
                }}
                onSubmit={handleSubmit}
                saving={saving}
            />
        </Stack>
    );
};

export default ClinicalHistoryCreate;
