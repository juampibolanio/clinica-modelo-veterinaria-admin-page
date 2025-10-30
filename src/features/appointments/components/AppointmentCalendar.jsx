import { Paper } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

/**
 * Calendar view for appointments (FullCalendar)
 */
const AppointmentCalendar = ({
    events,
    onDateSelect,
    onEventClick,
}) => {
    return (
        <Paper
            sx={{
                p: { xs: 1, md: 2 },
                borderRadius: 2,
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
            }}
        >
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                selectable
                selectMirror
                select={onDateSelect}
                eventClick={onEventClick}
                events={events}
                height="auto"
                businessHours={[
                    { daysOfWeek: [1, 2, 3, 4, 5], startTime: "09:00", endTime: "12:30" },
                    { daysOfWeek: [1, 2, 3, 4, 5], startTime: "17:00", endTime: "20:00" },
                    { daysOfWeek: [6], startTime: "09:00", endTime: "12:30" },
                    { daysOfWeek: [6], startTime: "18:00", endTime: "20:00" },
                ]}
                weekends={true}
                slotMinTime="08:00:00"
                slotMaxTime="21:00:00"
                allDaySlot={false}
                nowIndicator
                slotLabelFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                }}
            />
        </Paper>
    );
};

export default AppointmentCalendar;
