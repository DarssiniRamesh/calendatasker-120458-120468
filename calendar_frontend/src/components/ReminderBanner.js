import React from "react";

// PUBLIC_INTERFACE
/**
 * Banner displaying upcoming reminders.
 */
export default function ReminderBanner({ reminders = [] }) {
  return (
    <div className="w-full py-2 px-4 bg-accent text-white rounded-lg text-center mb-4 shadow">
      {reminders.length === 0 ? (
        <span className="opacity-70">No upcoming reminders.</span>
      ) : (
        <span>
          Upcoming reminders: {reminders.map(r => r.title).join(", ")}
        </span>
      )}
    </div>
  );
}
