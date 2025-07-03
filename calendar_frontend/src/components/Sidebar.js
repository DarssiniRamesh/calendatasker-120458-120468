import React from 'react';

// PUBLIC_INTERFACE
/**
 * Sidebar component for app navigation.
 */
export default function Sidebar() {
  return (
    <aside className="bg-secondary min-h-screen w-56 flex flex-col px-4 py-6 border-r border-gray-200">
      <div className="font-bold text-2xl text-primary mb-8 tracking-tight">🗓️ KAVIA</div>
      <nav className="flex flex-col gap-4">
        <button className="text-left px-2 py-2 rounded-md hover:bg-accent/10 text-gray-800 font-medium transition-colors">
          Calendar
        </button>
        <button className="text-left px-2 py-2 rounded-md hover:bg-accent/10 text-gray-800 font-medium transition-colors">
          Tasks
        </button>
        <button className="text-left px-2 py-2 rounded-md hover:bg-accent/10 text-gray-800 font-medium transition-colors">
          Reminders
        </button>
        <button className="text-left px-2 py-2 rounded-md hover:bg-accent/10 text-gray-800 font-medium transition-colors">
          Gmail
        </button>
        <button className="text-left px-2 py-2 rounded-md hover:bg-accent/10 text-gray-800 font-medium transition-colors">
          Account
        </button>
      </nav>
    </aside>
  );
}
