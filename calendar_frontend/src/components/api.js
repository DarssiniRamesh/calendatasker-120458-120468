import { useAuth } from "@clerk/clerk-react";
import { useState, useEffect, useCallback } from "react";

const API_BASE = process.env.REACT_APP_CALENDAR_API_BASE || "http://localhost:3001";

// PUBLIC_INTERFACE
/**
 * Helper for backend API requests (injects Clerk JWT if needed).
 * @param {string} path - Endpoint path.
 * @param {object} options - fetch options (method, body, etc).
 * @param {string} [token] - Auth token.
 */
export async function callApi(path, options = {}, token) {
  const headers = Object.assign(
    {}, 
    (options.headers || {}),
    token ? { Authorization: `Bearer ${token}` } : {}
  );
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const contentType = res.headers.get("content-type") || "";
  let data;
  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }
  if (!res.ok) {
    throw new Error(data?.error || data?.message || "API error");
  }
  return data;
}

/**
 * PUBLIC_INTERFACE
 * Fetch reminders from backend.
 * Returns: { reminders: [{ title, due, ... }], ... }
 */
export async function fetchReminders(token) {
  return callApi("/reminders/", {}, token);
}

/**
 * PUBLIC_INTERFACE
 * Fetch Gmail auth connection status.
 * Returns: { connected: boolean }
 */
export async function fetchGmailStatus(token) {
  return callApi("/gmail/status", {}, token);
}

/**
 * PUBLIC_INTERFACE
 * Start or disconnect Gmail OAuth flow.
 * Returns: { url: string } for connect, { success: true } for disconnect.
 */
export async function connectGmail(token) {
  return callApi("/gmail/connect", {}, token);
}
export async function disconnectGmail(token) {
  return callApi("/gmail/disconnect", { method: "POST" }, token);
}

/**
 * PUBLIC_INTERFACE
 * Fetch recent event-related emails.
 * Returns: { emails: [{ subject, snippet, id, ... }], ... }
 */
export async function fetchGmailEmails(token) {
  return callApi("/gmail/emails", {}, token);
}

/**
 * PUBLIC_INTERFACE
 * React hook: Provides { reminders, refresh, loading, error } with polling of reminders.
 */
export function useRemindersPolling(intervalMs = 15000) {
  const { getToken } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const data = await fetchReminders(token);
      setReminders((data && data.reminders) || []);
    } catch (e) {
      setError(e.message || "Failed fetching reminders");
      setReminders([]);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    refresh();
    if (intervalMs > 0) {
      const id = setInterval(refresh, intervalMs);
      return () => clearInterval(id);
    }
  }, [refresh, intervalMs]);

  return { reminders, refresh, loading, error };
}
