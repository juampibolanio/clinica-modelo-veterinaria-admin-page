import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

import ConfirmDialog from "../../../components/common/ConfirmDialog";
import AppointmentFilters from "../components/AppointmentFilters";
import AppointmentCalendar from "../components/AppointmentCalendar";
import AppointmentSidebar from "../components/AppointmentSidebar";
import { useAppointmentsData } from "../hooks/useAppointmentsData";
import { toISOFromBackend } from "../utils/utils";
import { appointmentStyles } from "../styles/appointment.styles";

const Appointments = () => {
    const navigate = useNavigate();

    const {
        filters,
        setFilters,
        vets,
        appointments,
        fetchAppointments,
        handleDeleteAppointment,
    } = useAppointmentsData();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    // Convert appointments to calendar events
    const events = useMemo(
        () =>
            (appointments || []).map((a) => ({
                id: String(a.id),
                title: `${a.petName} • ${a.veterinarianName}${a.reason ? " • " + a.reason : ""
                    }`,
                start: toISOFromBackend(a.date, a.time),
                end: toISOFromBackend(a.date, a.time),
                extendedProps: a,
            })),
        [appointments]
    );

    const today = dayjs().format("YYYY-MM-DD");
    const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
    const todayList = (appointments || []).filter((a) => a.date === today);
    const tomorrowList = (appointments || []).filter((a) => a.date === tomorrow);

    const handleDateSelect = (selInfo) => {
        const date = dayjs(selInfo.startStr).format("YYYY-MM-DD");
        const time = dayjs(selInfo.startStr).format("HH:mm");
        navigate(`/appointments/create?date=${date}&time=${time}`);
    };

    const handleEventClick = (clickInfo) => {
        navigate(`/appointments/${clickInfo.event.id}`);
    };

    const confirmDelete = async () => {
        await handleDeleteAppointment(selectedId);
        setConfirmOpen(false);
    };

    return (
        <Stack spacing={3}>
            {/* Encabezado */}
            <Typography variant="h4" sx={appointmentStyles.headerTitle}>
                Gestión de turnos
            </Typography>

            {/* Filtros */}
            <AppointmentFilters
                filters={filters}
                setFilters={setFilters}
                vets={vets}
                onApply={fetchAppointments}
            />

            {/* Layout principal */}
            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems="stretch"
            >
                <AppointmentCalendar
                    events={events}
                    onDateSelect={handleDateSelect}
                    onEventClick={handleEventClick}
                />
                <AppointmentSidebar
                    todayList={todayList}
                    tomorrowList={tomorrowList}
                    onView={(id) => navigate(`/appointments/${id}`)}
                />
            </Stack>

            {/* Confirmación eliminación */}
            <ConfirmDialog
                open={confirmOpen}
                title="Eliminar turno"
                message="¿Seguro que deseas eliminar este turno? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmDelete}
            />
        </Stack>
    );
};

export default Appointments;
