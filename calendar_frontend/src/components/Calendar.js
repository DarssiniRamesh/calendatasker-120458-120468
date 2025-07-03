import React, { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAuth } from "@clerk/clerk-react";

/**
 * PUBLIC_INTERFACE
 * Calendar component using FullCalendar.
 * Fetches, updates, and renders events from backend API with Clerk authentication.
 * Supports add/edit/delete via API.
 */
export default function Calendar() {
  const { getToken } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Backend Base URL (update as needed for deployment)
  const API_BASE = process.env.REACT_APP_CALENDAR_API_BASE || "http://localhost:3001";

  // Fetch events from backend, using Clerk JWT
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/events/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      // Assume API returns { events: [...] }
      setEvents(
        data.events
          ? data.events.map(e => ({
              ...e,
              title: e.title,
              start: e.start || e.date,
              end: e.end || e.date,
              id: e.id
            }))
          : []
      );
    } catch (err) {
      setError(err.message || "Internal Error");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [getToken, API_BASE]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Create new event via API
  const handleDateSelect = async (selectInfo) => {
    const title = window.prompt("Event Title?");
    if (!title) return;
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/events/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr || selectInfo.startStr,
        }),
      });
      if (!res.ok) throw new Error("Failed to create event");
      await fetchEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  // Drag or resize event handler (update)
  const handleEventChange = async (changeInfo) => {
    const event = changeInfo.event;
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: event.title,
          start: event.startStr,
          end: event.endStr || event.startStr,
        }),
      });
      if (!res.ok) throw new Error("Failed to update event");
      await fetchEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  // Event delete handler
  const handleEventClick = async (clickInfo) => {
    if (
      window.confirm(
        `Delete event "${clickInfo.event.title}"?\nThis cannot be undone.`
      )
    ) {
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE}/events/${clickInfo.event.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to delete event");
        await fetchEvents();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full h-full border border-gray-200">
      <div className="flex items-center mb-2">
        <span className="font-semibold text-primary text-lg">Calendar</span>
        {loading && <span className="ml-3 text-xs text-gray-400">Loading…</span>}
        {error && (
          <span className="ml-3 text-xs text-red-500">{error}</span>
        )}
      </div>
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
        selectable
        select={handleDateSelect}
        editable
        eventChange={handleEventChange}
        eventClick={handleEventClick}
        aspectRatio={1.6}
      />
    </div>
  );
}
