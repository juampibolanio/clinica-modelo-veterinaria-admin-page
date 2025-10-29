import React, { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createAppliedVaccine } from "../api/applied-vaccines.api";
import { getProductById, patchProduct } from "../../products/api/products.api";
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

            // 1️⃣ Obtener el producto seleccionado
            const product = await getProductById(formData.productId);
            if (!product) throw new Error("Producto no encontrado");

            // 2️⃣ Validar stock disponible
            const cantidad = Number(formData.quantity || 1);
            if (product.stock <= 0 || product.stock < cantidad) {
                enqueueSnackbar("No hay stock suficiente para aplicar esta vacuna", {
                    variant: "warning",
                });
                return;
            }

            // 3️⃣ Crear vacuna aplicada
            await createAppliedVaccine(formData);

            // 4️⃣ Restar del stock
            const newStock = Math.max(product.stock - cantidad, 0);
            await patchProduct(product.id, { stock: newStock });

            enqueueSnackbar("Vacuna registrada y stock actualizado", { variant: "success" });

            // 5️⃣ Redirigir
            if (petId) navigate(`/pets/${petId}`);
            else navigate("/applied-vaccines");
        } catch (error) {
            console.error(error);
            enqueueSnackbar("Error al registrar la vacuna o actualizar el stock", { variant: "error" });
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
