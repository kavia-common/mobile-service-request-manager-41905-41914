import { RequestPriority, RequestStatus } from "../domain/constants";

const STORAGE_KEY = "msm.serviceRequests.v1";

function now() {
  return Date.now();
}

function makeId() {
  // Simple, deterministic-enough ID for local/mock use
  return `SR-${Math.random().toString(16).slice(2, 6).toUpperCase()}-${Math.random().toString(16).slice(2, 6).toUpperCase()}`;
}

function seedData() {
  const base = now();
  return [
    {
      id: "SR-1001",
      title: "Screen replacement needed",
      description: "Customer reports cracked screen after drop. Needs estimate and replacement.",
      priority: RequestPriority.HIGH,
      assignee: "Avery",
      status: RequestStatus.OPEN,
      createdAt: base - 1000 * 60 * 60 * 26,
      updatedAt: base - 1000 * 60 * 60 * 26,
    },
    {
      id: "SR-1002",
      title: "Battery draining fast",
      description: "Battery drains from 100% to 20% within 3 hours. Diagnostics requested.",
      priority: RequestPriority.MEDIUM,
      assignee: "Jordan",
      status: RequestStatus.IN_PROGRESS,
      createdAt: base - 1000 * 60 * 60 * 18,
      updatedAt: base - 1000 * 60 * 60 * 8,
    },
    {
      id: "SR-1003",
      title: "Water damage inspection",
      description: "Phone exposed to rain. Needs cleaning and corrosion assessment.",
      priority: RequestPriority.URGENT,
      assignee: "Kai",
      status: RequestStatus.RESOLVED,
      createdAt: base - 1000 * 60 * 60 * 52,
      updatedAt: base - 1000 * 60 * 60 * 2,
    },
  ];
}

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function normalizeRecord(record) {
  const createdAt = typeof record.createdAt === "number" ? record.createdAt : now();
  const updatedAt = typeof record.updatedAt === "number" ? record.updatedAt : createdAt;
  return {
    id: record.id || makeId(),
    title: String(record.title ?? ""),
    description: String(record.description ?? ""),
    priority: record.priority || RequestPriority.MEDIUM,
    assignee: String(record.assignee ?? ""),
    status: record.status || RequestStatus.OPEN,
    createdAt,
    updatedAt,
  };
}

// PUBLIC_INTERFACE
export function loadRequestsFromStorage() {
  /** Loads requests from localStorage; seeds initial data if empty/corrupt. */
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? safeParse(raw) : null;

  if (!Array.isArray(parsed)) {
    const seeded = seedData();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  return parsed.map(normalizeRecord);
}

function saveRequestsToStorage(requests) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

// PUBLIC_INTERFACE
export function createRequestLocal(input) {
  /** Creates a request in localStorage and returns the created record. */
  const existing = loadRequestsFromStorage();
  const record = normalizeRecord({
    ...input,
    id: makeId(),
    createdAt: now(),
    updatedAt: now(),
  });
  const next = [record, ...existing];
  saveRequestsToStorage(next);
  return record;
}

// PUBLIC_INTERFACE
export function updateRequestLocal(id, patch) {
  /** Updates an existing request by id in localStorage and returns updated record. */
  const existing = loadRequestsFromStorage();
  let updated = null;

  const next = existing.map((r) => {
    if (r.id !== id) return r;
    updated = normalizeRecord({ ...r, ...patch, id: r.id, createdAt: r.createdAt, updatedAt: now() });
    return updated;
  });

  if (!updated) {
    const err = new Error(`Request not found: ${id}`);
    err.code = "NOT_FOUND";
    throw err;
  }

  saveRequestsToStorage(next);
  return updated;
}

// PUBLIC_INTERFACE
export function deleteRequestLocal(id) {
  /** Deletes an existing request by id in localStorage. */
  const existing = loadRequestsFromStorage();
  const next = existing.filter((r) => r.id !== id);
  saveRequestsToStorage(next);
  return { ok: true };
}

// PUBLIC_INTERFACE
export function getRequestLocal(id) {
  /** Gets a single request by id from localStorage. */
  const existing = loadRequestsFromStorage();
  const found = existing.find((r) => r.id === id);
  if (!found) {
    const err = new Error(`Request not found: ${id}`);
    err.code = "NOT_FOUND";
    throw err;
  }
  return found;
}
