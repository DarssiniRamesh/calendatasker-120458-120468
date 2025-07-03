import React from "react";

// PUBLIC_INTERFACE
/**
 * Shows Gmail integration status and latest messages.
 */
export default function GmailPanel({ connected, emails = [] }) {
  return (
    <section className="bg-white border border-gray-200 rounded shadow p-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-lg text-primary">Gmail Integration</span>
        <span className={connected ? "text-green-500" : "text-red-400"}>
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {connected && emails.length > 0 ? (
          <ul className="list-disc ml-4">
            {emails.slice(0, 3).map((email, idx) => (
              <li key={idx}>{email.subject}</li>
            ))}
          </ul>
        ) : connected ? (
          <span>No recent emails found.</span>
        ) : (
          <span>Connect your Gmail to view event emails.</span>
        )}
      </div>
    </section>
  );
}
