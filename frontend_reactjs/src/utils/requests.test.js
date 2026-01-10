import { filterRequests, sortRequests } from "./requests";
import { RequestPriority, RequestStatus } from "../domain/constants";

const base = [
  { id: "SR-1", title: "Battery issue", description: "Drains fast", assignee: "Avery", priority: RequestPriority.HIGH, status: RequestStatus.OPEN, createdAt: 2 },
  { id: "SR-2", title: "Screen cracked", description: "Needs replacement", assignee: "Jordan", priority: RequestPriority.URGENT, status: RequestStatus.IN_PROGRESS, createdAt: 3 },
  { id: "SR-3", title: "Audio", description: "No sound", assignee: "", priority: RequestPriority.LOW, status: RequestStatus.CLOSED, createdAt: 1 },
];

test("filterRequests matches by query and status", () => {
  const res1 = filterRequests(base, { query: "battery", status: "All" });
  expect(res1).toHaveLength(1);
  expect(res1[0].id).toBe("SR-1");

  const res2 = filterRequests(base, { query: "", status: RequestStatus.IN_PROGRESS });
  expect(res2).toHaveLength(1);
  expect(res2[0].id).toBe("SR-2");
});

test("sortRequests sorts by priority desc and createdAt desc", () => {
  const prio = sortRequests(base, "priorityDesc");
  expect(prio[0].id).toBe("SR-2"); // urgent

  const created = sortRequests(base, "createdAtDesc");
  expect(created[0].id).toBe("SR-2"); // createdAt 3
});
