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
  return (
    <span className={`badge ${cls}`}>
      <span className="badgeDot" aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}
