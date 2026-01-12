import React from "react";
import { RequestStatus } from "../domain/constants";

function classForStatus(status) {
  switch (status) {
    case RequestStatus.OPEN:
      return "badgeOpen";
    case RequestStatus.IN_PROGRESS:
      return "badgeInProgress";
    case RequestStatus.RESOLVED:
      return "badgeResolved";
    case RequestStatus.CLOSED:
      return "badgeClosed";
    default:
      return "";
  }
}

// PUBLIC_INTERFACE
export default function StatusBadge({ status }) {
  /** Renders a consistent status badge for a request. */
  const cls = classForStatus(status);
  const label = status ? `Status: ${status}` : "Status";

  return (
    <span className={`badge ${cls}`} aria-label={label}>
      <span className="badgeDot" aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}
