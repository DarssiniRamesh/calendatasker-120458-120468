import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

/**
 * PUBLIC_INTERFACE
 * TaskList component: displays, adds, edits, deletes, and marks tasks as done.
 * Syncs state with backend API (CRUD), using Clerk authentication.
 */
export default function TaskList() {
  const { getToken } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // Backend Base URL (update as needed for deployment)
  const API_BASE = process.env.REACT_APP_CALENDAR_API_BASE || "http://localhost:3001";

  // Fetch tasks from API
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/tasks/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(Array.isArray(data.tasks) ? data.tasks : []);
    } catch (err) {
      setError(err.message || "Internal Error");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  // Create new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTaskTitle }),
      });
      if (!res.ok) throw new Error("Failed to create task");
      setNewTaskTitle("");
      await fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  // Start edit task
  const handleEditInit = (task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
  };

  // Submit edit task
  const handleEditSubmit = async (task) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: editTitle, done: task.done }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      setEditingTask(null);
      setEditTitle("");
      await fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete task");
      await fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  // Mark task as done/undone
  const handleToggleDone = async (task) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...task, done: !task.done }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      await fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="bg-white rounded shadow p-4 border border-gray-200">
      <div className="font-semibold text-lg text-primary mb-3 flex items-center justify-between">
        <span>Tasks</span>
        {loading && <span className="ml-2 text-xs text-gray-400">Loading…</span>}
      </div>
      {error && <div className="mb-2 text-red-500 text-xs">{error}</div>}
      <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task…"
          className="flex-1 border rounded px-3 py-1 text-sm"
        />
        <button
          type="submit"
          className="bg-accent text-white px-4 py-1 rounded font-medium hover:bg-kavia-orange"
        >
          Add
        </button>
      </form>
      <ul className="divide-y divide-gray-100">
        {tasks.length === 0 && !loading && (
          <li className="py-2 text-gray-400">No tasks found.</li>
        )}
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`py-2 flex items-center justify-between gap-2 ${
              task.done ? "opacity-60" : ""
            }`}
          >
            {editingTask === task.id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 border border-accent rounded px-2 py-1 mr-2 text-sm"
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      handleEditSubmit(task);
                    } else if (e.key === "Escape") {
                      setEditingTask(null);
                      setEditTitle("");
                    }
                  }}
                />
                <button
                  onClick={() => handleEditSubmit(task)}
                  className="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-kavia-blue"
                  title="Save"
                >
                  💾
                </button>
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setEditTitle("");
                  }}
                  className="text-xs bg-gray-200 px-2 py-1 rounded"
                  title="Cancel"
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <span
                  className={`flex-1 cursor-pointer ${task.done ? "line-through" : ""}`}
                  onDoubleClick={() => handleEditInit(task)}
                >
                  {task.title}
                </span>
                <button
                  onClick={() => handleToggleDone(task)}
                  className="text-xs mr-2 px-2 py-1 rounded bg-gray-100 hover:bg-accent/30"
                  title={task.done ? "Mark as undone" : "Mark as done"}
                  aria-label={task.done ? "Undone" : "Done"}
                >
                  {task.done ? "✅" : "⬜"}
                </button>
                <button
                  onClick={() => handleEditInit(task)}
                  className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-kavia-blue/20"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-400 hover:text-white"
                  title="Delete"
                >
                  🗑️
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
