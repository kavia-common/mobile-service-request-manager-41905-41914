/**
 * Domain constants for service requests.
 */

export const RequestStatus = Object.freeze({
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
});

export const RequestPriority = Object.freeze({
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
});

export const StatusOrder = [RequestStatus.OPEN, RequestStatus.IN_PROGRESS, RequestStatus.RESOLVED, RequestStatus.CLOSED];

export const PriorityOrder = [
  RequestPriority.URGENT,
  RequestPriority.HIGH,
  RequestPriority.MEDIUM,
  RequestPriority.LOW,
];
