import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRemindersPolling } from "./api";

/**
 * PUBLIC_INTERFACE
 * Banner displaying upcoming reminders; animates in/out on changes.
 * Fetches reminders with polling from backend. Shows loading/error states.
 */
export default function ReminderBanner() {
  const { reminders, loading, error } = useRemindersPolling(12000);

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          key="rem-loading"
          className="w-full py-2 px-4 bg-accent text-white rounded-lg text-center mb-4 shadow"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.45 }}
        >
          <span>Loading reminders…</span>
        </motion.div>
      ) : error ? (
        <motion.div
          key="rem-error"
          className="w-full py-2 px-4 bg-red-400 text-white rounded-lg text-center mb-4 shadow"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45 }}
        >
          <span>{error}</span>
        </motion.div>
      ) : (
        <motion.div
          key="rem-main"
          className={`w-full py-2 px-4 bg-accent text-white rounded-lg text-center mb-4 shadow`}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.5 }}
        >
          {reminders.length === 0 ? (
            <span className="opacity-70">No upcoming reminders.</span>
          ) : (
            <span>
              Upcoming reminders:{" "}
              {reminders.map(r => r.title).join(", ")}
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
