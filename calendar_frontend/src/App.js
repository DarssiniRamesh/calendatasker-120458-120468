import React, { useState, useEffect } from "react";
import "./App.css";
import "./index.css";
import Sidebar from "./components/Sidebar";
import Calendar from "./components/Calendar";
import TaskList from "./components/TaskList";
import ReminderBanner from "./components/ReminderBanner";
import GmailPanel from "./components/GmailPanel";
import AuthUI from "./components/AuthUI";
import { PrivateRoute } from "./components/AuthProvider";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");

  // Example static test data
  const exampleEvents = [
    { title: "Team Meeting", date: "2024-07-05" },
    { title: "Doctor Appointment", date: "2024-07-07" },
  ];
  const exampleTasks = [
    { id: 1, title: "Finish UI mockups", done: false },
    { id: 2, title: "QA backend API", done: true },
  ];
  const exampleReminders = [{ title: "Workshop at 3pm" }];
  const exampleEmails = [
    { subject: "Join event: Team Meeting" },
    { subject: "Upcoming calendar event" },
  ];

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <PrivateRoute>
      <div className={`flex bg-gray-50 min-h-screen dark:bg-gray-900 transition duration-300`}>
        <Sidebar />
        <main className="flex-1 flex flex-col px-6 py-8 gap-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-2xl text-kavia-blue tracking-tight">
              Calendar & Tasks
            </span>
            <button
              className="theme-toggle ml-2"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
            {/* Auth/account controls */}
            <div className="ml-4">
              <AuthUI />
            </div>
          </div>
          <ReminderBanner reminders={exampleReminders} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="col-span-1 lg:col-span-2 flex flex-col gap-4">
              <Calendar events={exampleEvents} />
            </section>
            <section className="col-span-1 flex flex-col gap-4">
              <TaskList tasks={exampleTasks} />
              <GmailPanel connected={true} emails={exampleEmails} />
            </section>
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
}

export default App;
