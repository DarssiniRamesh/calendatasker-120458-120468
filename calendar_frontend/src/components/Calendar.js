import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// PUBLIC_INTERFACE
/**
 * Calendar component using FullCalendar.
 */
export default function Calendar({ events = [] }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 w-full h-full border border-gray-200">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        height="auto"
        events={events}
      />
    </div>
  );
}
