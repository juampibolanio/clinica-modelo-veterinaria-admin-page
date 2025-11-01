import {
    Box,
    Stack,
    TextField,
    MenuItem,
    Button,
    CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema } from "../schemas/appointment.schema.js";
import { useAppointmentFormData } from "../hooks/useAppointmentFormData.js";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { appointmentFormStyles } from "../styles/appointmentForm.styles.js";

const STATUS_OPTIONS = [
    { label: "Pendiente", value: "PENDING" },
    { label: "Confirmado", value: "CONFIRMED" },
    { label: "Cancelado", value: "CANCELLED" },
    { label: "Completado", value: "COMPLETED" },
];

/**
 * This component renders a form for creating or editing an appointment.
 * It uses react-hook-form for form state management and validation with zod.
 */
const AppointmentForm = ({ initialValues = {}, onSubmit, saving }) => {
    const navigate = useNavigate();
    const { owners, vets, pets, setPets, loadingPreset } =
        useAppointmentFormData(initialValues);

    const isDataReady = owners.length > 0 && vets.length > 0;

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

    const handleFormSubmit = (data) => onSubmit?.(data);

    if (!isDataReady || loadingPreset)
        return (
            <Stack alignItems="center" mt={4}>
                <CircularProgress />
            </Stack>
        );

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(handleFormSubmit)}
            noValidate
            sx={appointmentFormStyles.form}
        >
            <Stack spacing={2}>
                {/* Date */}
                <TextField
                    label="Fecha"
                    type="date"
                    fullWidth
                    {...register("date")}
                    error={!!errors.date}
                    helperText={errors.date?.message}
                    slotProps={{ inputLabel: { shrink: true } }}
                    inputProps={{ min: dayjs().format("YYYY-MM-DD") }}
                    required
                    sx={appointmentFormStyles.textField}
                />

                {/* Hour */}
                <TextField
                    label="Hora"
                    type="time"
                    fullWidth
                    {...register("time")}
                    error={!!errors.time}
                    helperText={errors.time?.message}
                    inputProps={{ step: 300, min: "09:00", max: "20:00" }}
                    required
                    sx={appointmentFormStyles.textField}
                />

                {/* State */}
                <TextField
                    select
                    label="Estado"
                    fullWidth
                    {...register("status")}
                    error={!!errors.status}
                    helperText={errors.status?.message}
                    sx={appointmentFormStyles.textField}
                >
                    {STATUS_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Veterinarian */}
                <TextField
                    select
                    label="Veterinario"
                    fullWidth
                    {...register("veterinarianId")}
                    error={!!errors.veterinarianId}
                    helperText={errors.veterinarianId?.message}
                    required
                    sx={appointmentFormStyles.textField}
                >
                    {vets.map((v) => (
                        <MenuItem key={v.id} value={v.id}>
                            {v.name} {v.surname}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Owner */}
                <TextField
                    select
                    label="Dueño"
                    fullWidth
                    {...register("ownerId")}
                    error={!!errors.ownerId}
                    helperText={errors.ownerId?.message}
                    required
                    disabled={!!initialValues.ownerId}
                    sx={appointmentFormStyles.textField}
                >
                    {owners.map((o) => (
                        <MenuItem key={o.id} value={o.id}>
                            {o.name} {o.surname}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Pet */}
                <TextField
                    select
                    label="Mascota"
                    fullWidth
                    {...register("petId")}
                    error={!!errors.petId}
                    helperText={errors.petId?.message}
                    required
                    disabled={!ownerId && !initialValues.petId}
                    sx={appointmentFormStyles.textField}
                >
                    {pets.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                            {p.name}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Motive */}
                <TextField
                    label="Motivo"
                    fullWidth
                    {...register("reason")}
                    error={!!errors.reason}
                    helperText={errors.reason?.message}
                    sx={appointmentFormStyles.textField}
                />

                {/* Notes */}
                <TextField
                    label="Notas"
                    fullWidth
                    multiline
                    rows={3}
                    {...register("notes")}
                    error={!!errors.notes}
                    helperText={errors.notes?.message}
                    sx={appointmentFormStyles.textField}
                />

                {/* Buttons */}
                <Stack sx={appointmentFormStyles.actionsContainer}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate(-1)}
                        sx={appointmentFormStyles.cancelButton}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!isValid || saving}
                        sx={appointmentFormStyles.submitButton}
                    >
                        {saving ? (
                            <CircularProgress size={22} sx={{ color: "white" }} />
                        ) : (
                            "Guardar turno"
                        )}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};

export default AppointmentForm;
