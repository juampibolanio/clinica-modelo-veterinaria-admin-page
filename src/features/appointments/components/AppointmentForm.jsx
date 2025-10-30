import {
    Stack,
    TextField,
    MenuItem,
    Button,
    CircularProgress,
    Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema } from "../schemas/appointment.schema.js";
import { useAppointmentFormData } from "../hooks/useAppointmentFormData.js";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";

/**
 * Appointment form for creating and editing appointments.
 * Fully responsive, validated with Zod + React Hook Form.
 */
const STATUS_OPTIONS = [
    { label: "Pendiente", value: "PENDING" },
    { label: "Confirmado", value: "CONFIRMED" },
    { label: "Cancelado", value: "CANCELLED" },
    { label: "Completado", value: "COMPLETED" },
];

const AppointmentForm = ({ initialValues = {}, onSubmit, saving }) => {
    const navigate = useNavigate();
    const { owners, vets, pets, setPets, loadingPreset } =
        useAppointmentFormData(initialValues);

    // Wait until owners and vets are loaded
    const isDataReady = owners.length > 0 && vets.length > 0;

    // Normalize IDs to strings for form compatibility
    const normalizedInitialValues = useMemo(
        () => ({
            ...initialValues,
            veterinarianId: initialValues.veterinarianId
                ? String(initialValues.veterinarianId)
                : "",
            ownerId: initialValues.ownerId ? String(initialValues.ownerId) : "",
            petId: initialValues.petId ? String(initialValues.petId) : "",
        }),
        [initialValues]
    );

    // Initialize React Hook Form
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(appointmentSchema),
        mode: "onChange",
        defaultValues: {
            date: "",
            time: "",
            status: "PENDING",
            veterinarianId: "",
            ownerId: "",
            petId: "",
            reason: "",
            notes: "",
            ...normalizedInitialValues,
        },
    });

    const ownerId = watch("ownerId");

    // Update pets when ownerId changes
    useEffect(() => {
        if (ownerId) {
            (async () => {
                const list = await import("../../pets/api/pets.api").then((m) =>
                    m.getPetsByOwnerId(ownerId)
                );
                const mapped = (list || []).map((p) => ({
                    ...p,
                    id: String(p.id),
                }));
                setPets(mapped);
            })();
        }
    }, [ownerId, setPets]);

    const handleFormSubmit = (data) => {
        onSubmit?.(data);
    };

    // Show loader until data is ready
    if (!isDataReady || loadingPreset)
        return (
            <Stack alignItems="center" mt={4}>
                <CircularProgress />
            </Stack>
        );

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <Grid container spacing={2}>
                {/* Date */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Fecha"
                        type="date"
                        fullWidth
                        {...register("date")}
                        error={!!errors.date}
                        helperText={errors.date?.message}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: dayjs().format("YYYY-MM-DD") }}
                        required
                    />
                </Grid>

                {/* Hour */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Hora"
                        type="time"
                        fullWidth
                        {...register("time")}
                        error={!!errors.time}
                        helperText={errors.time?.message}
                        inputProps={{ step: 300, min: "09:00", max: "20:00" }}
                        required
                    />
                </Grid>

                {/* State */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        select
                        label="Estado"
                        fullWidth
                        {...register("status")}
                        error={!!errors.status}
                        helperText={errors.status?.message}
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Veterinarian */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        select
                        label="Veterinario"
                        fullWidth
                        {...register("veterinarianId")}
                        error={!!errors.veterinarianId}
                        helperText={errors.veterinarianId?.message}
                        required
                    >
                        {vets.map((v) => (
                            <MenuItem key={v.id} value={v.id}>
                                {v.name} {v.surname}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Owner */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        select
                        label="Dueño"
                        fullWidth
                        {...register("ownerId")}
                        error={!!errors.ownerId}
                        helperText={errors.ownerId?.message}
                        required
                        disabled={!!initialValues.ownerId}
                    >
                        {owners.map((o) => (
                            <MenuItem key={o.id} value={o.id}>
                                {o.name} {o.surname}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Pet */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        select
                        label="Mascota"
                        fullWidth
                        {...register("petId")}
                        error={!!errors.petId}
                        helperText={errors.petId?.message}
                        required
                        disabled={!ownerId && !initialValues.petId}
                    >
                        {pets.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Motivation */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Motivo"
                        fullWidth
                        {...register("reason")}
                        error={!!errors.reason}
                        helperText={errors.reason?.message}
                    />
                </Grid>

                {/* Notes */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Notas"
                        fullWidth
                        multiline
                        rows={3}
                        {...register("notes")}
                        error={!!errors.notes}
                        helperText={errors.notes?.message}
                    />
                </Grid>

                {/* Buttons */}
                <Grid item xs={12}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="flex-end"
                        spacing={2}
                    >
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => navigate(-1)}
                            fullWidth={true}
                            sx={{
                                "@media (min-width:600px)": { width: "auto" },
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!isValid || saving}
                            fullWidth={true}
                            sx={{
                                "@media (min-width:600px)": { width: "auto" },
                            }}
                        >
                            {saving ? <CircularProgress size={22} /> : "Guardar"}
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </form>
    );
};

export default AppointmentForm;
