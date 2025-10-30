import { useMemo, useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import AppointmentFilters from "../components/AppointmentFilters";
import AppointmentCalendar from "../components/AppointmentCalendar";
import AppointmentSidebar from "../components/AppointmentSidebar";
import { useAppointmentsData } from "../hooks/useAppointmentsData";
import { toISOFromBackend } from "../utils/utils";

/**
 * Appointments page
 * Renders the appointments page, including a calendar, sidebar,
 * filters, and a confirmation dialog for deletions.
 */
const Appointments = () => {
    const navigate = useNavigate();

    const {
        filters,
        setFilters,
        vets,
        appointments,
        loading,
        fetchAppointments,
        handleDeleteAppointment,
    } = useAppointmentsData();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    // Convert backend appointments to FullCalendar event format
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

    const todayStr = dayjs().format("YYYY-MM-DD");
    const tomorrowStr = dayjs().add(1, "day").format("YYYY-MM-DD");

    const todayList = (appointments || []).filter((a) => a.date === todayStr);
    const tomorrowList = (appointments || []).filter((a) => a.date === tomorrowStr);

    const handleDateSelect = (selInfo) => {
        const date = dayjs(selInfo.startStr).format("YYYY-MM-DD");
        const time = dayjs(selInfo.startStr).format("HH:mm");
        navigate(`/appointments/create?date=${date}&time=${time}`);
    };

    const handleEventClick = (clickInfo) => {
        const id = clickInfo.event.id;
        navigate(`/appointments/${id}`);
    };

    const handleDelete = (id) => {
        setSelectedId(id);
        setConfirmOpen(true);
    };

    const confirmDelete = async () => {
        await handleDeleteAppointment(selectedId);
        setConfirmOpen(false);
    };
    
    return (
        <Stack spacing={2}>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                <Typography variant="h4" fontWeight={800}>
                    Turnos
                </Typography>
            </Stack>

            {/* Filters */}
            <AppointmentFilters
                filters={filters}
                setFilters={setFilters}
                vets={vets}
                onApply={fetchAppointments}
            />

            {/* Main layout */}
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

            {/* Confirm delete dialog */}
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
