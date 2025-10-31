import { Paper, useMediaQuery, useTheme } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { appointmentStyles } from "../styles/appointment.styles";

/**
 * Vista de calendario (FullCalendar) — completamente responsive y en español
 */
const AppointmentCalendar = ({ events, onDateSelect, onEventClick }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Paper
            sx={{
                ...appointmentStyles.paperCard,
                flex: 1,
                overflow: "hidden",
                minHeight: 400,
                "& .fc": {
                    fontFamily: "'Nunito', sans-serif",
                },
                "& .fc-toolbar-title": {
                    fontSize: { xs: "1.1rem", sm: "1.3rem" },
                    fontWeight: 700,
                },
                "& .fc-button": {
                    textTransform: "capitalize",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    borderRadius: "8px",
                    padding: "4px 8px",
                    backgroundColor: "#3781E3",
                    borderColor: "#3781E3",
                    "&:hover": {
                        backgroundColor: "#2c6ed3",
                        borderColor: "#2c6ed3",
                    },
                },
            }}
        >
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                locale={esLocale}
                initialView={isMobile ? "dayGridMonth" : "timeGridWeek"}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: isMobile
                        ? "dayGridMonth"
                        : "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                selectable
                selectMirror
                select={onDateSelect}
                eventClick={onEventClick}
                events={events}
                height="auto"
                weekends
                nowIndicator
                allDaySlot={false}
                expandRows
                slotMinTime="08:00:00"
                slotMaxTime="21:00:00"
                businessHours={[
                    { daysOfWeek: [1, 2, 3, 4, 5], startTime: "09:00", endTime: "12:30" },
                    { daysOfWeek: [1, 2, 3, 4, 5], startTime: "17:00", endTime: "20:00" },
                    { daysOfWeek: [6], startTime: "09:00", endTime: "12:30" },
                ]}
                slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
                eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
                dayMaxEventRows
                stickyHeaderDates
            />
        </Paper>
    );
};

export default AppointmentCalendar;
