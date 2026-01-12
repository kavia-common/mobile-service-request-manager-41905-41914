import { PriorityOrder, RequestPriority, RequestStatus, StatusOrder } from "../domain/constants";

/**
 * Safely normalizes a string for comparisons.
 */
export function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

/**
 * Returns a numeric rank for priority for sorting.
 */
export function priorityRank(priority) {
  const idx = PriorityOrder.indexOf(priority);
  return idx === -1 ? PriorityOrder.length : idx;
}

/**
 * Returns a numeric rank for status for sorting.
 */
export function statusRank(status) {
  const idx = StatusOrder.indexOf(status);
  return idx === -1 ? StatusOrder.length : idx;
}

/**
 * Filters a list of requests based on search query and optional status filter.
 */
export function filterRequests(requests, { query, status }) {
  const q = normalizeText(query);
  return (requests ?? []).filter((r) => {
    const matchesQuery =
      !q ||
      normalizeText(r.title).includes(q) ||
      normalizeText(r.description).includes(q) ||
      normalizeText(r.assignee).includes(q) ||
      normalizeText(r.id).includes(q);

    const matchesStatus = !status || status === "All" ? true : r.status === status;

    return matchesQuery && matchesStatus;
  });
}

/**
 * Sorts requests based on a sort key.
 * sortKey:
 * - createdAtDesc, createdAtAsc
 * - priorityDesc, priorityAsc
 * - statusAsc
 * - titleAsc
 */
export function sortRequests(requests, sortKey) {
  const arr = [...(requests ?? [])];

  const compare = (a, b) => {
    switch (sortKey) {
      case "createdAtAsc":
        return (a.createdAt ?? 0) - (b.createdAt ?? 0);
      case "createdAtDesc":
        return (b.createdAt ?? 0) - (a.createdAt ?? 0);
      case "priorityAsc":
        return priorityRank(a.priority) - priorityRank(b.priority);
      case "priorityDesc":
        // Lower rank means higher priority (Urgent=0 ... Low=3), so descending priority
        // should sort by ascending rank.
        return priorityRank(a.priority) - priorityRank(b.priority);
      case "statusAsc":
        return statusRank(a.status) - statusRank(b.status);
      case "titleAsc":
        return normalizeText(a.title).localeCompare(normalizeText(b.title));
      default:
        return (b.createdAt ?? 0) - (a.createdAt ?? 0);
    }
  };

  return arr.sort(compare);
}

/**
 * Returns a safe default request object for create.
 */
export function makeNewRequestDefaults() {
  return {
    title: "",
    description: "",
    priority: RequestPriority.MEDIUM,
    assignee: "",
    status: RequestStatus.OPEN,
  };
}
