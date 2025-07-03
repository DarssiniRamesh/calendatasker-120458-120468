import React from "react";

// PUBLIC_INTERFACE
/**
 * List of tasks/to-dos for the user.
 */
export default function TaskList({ tasks = [] }) {
  return (
    <section className="bg-white rounded shadow p-4 border border-gray-200">
      <div className="font-semibold text-lg text-primary mb-3">Tasks</div>
      <ul className="divide-y divide-gray-100">
        {(tasks.length === 0) && (
          <li className="py-2 text-gray-400">No tasks found.</li>
        )}
        {tasks.map((task) => (
          <li key={task.id} className="py-2 flex items-center justify-between">
            <span>{task.title}</span>
            <span className={`text-xs ml-4 ${task.done ? "text-green-500" : "text-accent"}`}>
              {task.done ? "Done" : "Pending"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
