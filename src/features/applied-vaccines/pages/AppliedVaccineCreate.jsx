import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createAppliedVaccine } from "../api/applied-vaccines.api";
import { getProductById, patchProduct } from "../../products/api/products.api";
import AppliedVaccineForm from "../components/AppliedVaccineForm";

/**
 * AppliedVaccineCreate
 * Page for registering a new applied vaccine.
 */
const AppliedVaccineCreate = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const petId = searchParams.get("petId");

    const [saving, setSaving] = useState(false);

    // ==============================
    // Handle form submit
    // ==============================
    const handleSubmit = async (formData) => {
        try {
            setSaving(true);

            // 1️⃣ Fetch selected product
            const product = await getProductById(formData.productId);
            if (!product) throw new Error("Producto no encontrado");

            // 2️⃣ Validate stock
            const quantity = Number(formData.quantity || 1);
            if (product.stock <= 0 || product.stock < quantity) {
                enqueueSnackbar("No hay stock suficiente para aplicar esta vacuna", {
                    variant: "warning",
                });
                return;
            }

            // 3️⃣ Create applied vaccine
            await createAppliedVaccine(formData);

            // 4️⃣ Update product stock
            const newStock = Math.max(product.stock - quantity, 0);
            await patchProduct(product.id, { stock: newStock });

            enqueueSnackbar("Vacuna registrada y stock actualizado ✅", {
                variant: "success",
            });

            // 5️⃣ Redirect
            if (petId) navigate(`/pets/${petId}`);
            else navigate("/applied-vaccines");
        } catch (err) {
            console.error("Error creating applied vaccine:", err);
            enqueueSnackbar(
                "Error al registrar la vacuna o actualizar el stock",
                { variant: "error" }
            );
        } finally {
            setSaving(false);
        }
    };

    // ==============================
    // Render
    // ==============================
    return (
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>
                Nueva vacuna aplicada
            </Typography>
            <AppliedVaccineForm
                onSubmit={handleSubmit}
                saving={saving}
                petId={petId}
            />
        </Stack>
    );
};

export default AppliedVaccineCreate;
