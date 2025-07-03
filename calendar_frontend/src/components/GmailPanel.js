import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { 
  fetchGmailStatus, connectGmail, disconnectGmail, fetchGmailEmails 
} from "./api";
import { motion, AnimatePresence } from "framer-motion";

/**
 * PUBLIC_INTERFACE
 * GmailPanel: shows Gmail integration status, enables connect/disconnect, shows latest event emails.
 * Animated transitions via Framer Motion.
 */
export default function GmailPanel() {
  const { getToken } = useAuth();
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch Gmail status and emails
  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const { connected } = await fetchGmailStatus(token);
      setConnected(!!connected);
      if (connected) {
        const emailData = await fetchGmailEmails(token);
        setEmails(emailData.emails || []);
      } else {
        setEmails([]);
      }
    } catch (e) {
      setError(e.message || "Gmail info error");
      setEmails([]);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    refreshAll();
    // Optionally: poll for live status
    const poll = setInterval(refreshAll, 10000);
    return () => clearInterval(poll);
  }, [refreshAll]);

  // Start OAuth Gmail connect
  const doConnect = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const { url } = await connectGmail(token);
      if (url) {
        window.location.href = url;
      } else {
        setError("No connection URL returned");
      }
    } catch (e) {
      setError(e.message || "Failed to initiate Gmail connection");
    }
    setActionLoading(false);
  };

  // Disconnect Gmail and refresh status.
  const doDisconnect = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const token = await getToken();
      await disconnectGmail(token);
      await refreshAll();
    } catch (e) {
      setError(e.message || "Failed to disconnect Gmail");
    }
    setActionLoading(false);
  };

  return (
    <section className="bg-white border border-gray-200 rounded shadow p-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-lg text-primary">Gmail Integration</span>
        <AnimatePresence>
          {loading ? (
            <motion.span
              key="gmail-status-load"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-xs text-gray-300"
            >Checking…</motion.span>
          ) : connected ? (
            <motion.span
              key="gmail-status-on"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="text-green-500 font-semibold"
            >Connected</motion.span>
          ) : (
            <motion.span
              key="gmail-status-off"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="text-red-400"
            >Disconnected</motion.span>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <div className="mt-1 mb-2 text-xs text-red-500">{error}</div>
      )}
      <div className="flex gap-2 mt-2 mb-3">
        {connected ? (
          <button
            className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700"
            onClick={doDisconnect}
            disabled={actionLoading}
          >
            Disconnect
          </button>
        ) : (
          <button
            className="bg-kavia-blue text-white px-3 py-1 rounded text-xs font-medium hover:bg-kavia-orange"
            onClick={doConnect}
            disabled={actionLoading}
          >
            Connect Gmail
          </button>
        )}
      </div>
      <AnimatePresence>
        {connected && emails.length > 0 && (
          <motion.ul
            key="gmail-email-list"
            className="list-disc ml-4 mt-2 text-sm text-gray-700"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.36 }}
          >
            {emails.slice(0, 3).map(email => (
              <li key={email.id || email.subject}>
                {email.subject || "No Subject"}
                {email.snippet ? (
                  <div className="text-xs text-gray-400">{email.snippet}</div>
                ) : null}
              </li>
            ))}
          </motion.ul>
        )}
        {connected && emails.length === 0 && (
          <motion.div
            key="gmail-empty"
            className="mt-2 text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >No recent event emails found.</motion.div>
        )}
        {!connected && !loading && (
          <motion.div
            key="gmail-prompt"
            className="text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >Connect your Gmail to view event-related emails.</motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
