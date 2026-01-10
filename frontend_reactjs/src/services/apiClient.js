import {
  createRequestLocal,
  deleteRequestLocal,
  getRequestLocal,
  loadRequestsFromStorage,
  updateRequestLocal,
} from "./storage";

/**
 * NOTE ABOUT ENV VARS:
 * - This app will use a real backend if either REACT_APP_API_BASE or REACT_APP_BACKEND_URL is defined.
 * - Otherwise, it falls back to a fully functional local mock backed by localStorage.
 *
 * Do not modify .env in code generation; env values are managed by deployment/orchestrator.
 */

function resolveApiBase() {
  return process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || "";
}

function isConfiguredForRealApi() {
  return Boolean(resolveApiBase());
}

async function httpJson(path, options = {}) {
  const base = resolveApiBase();
  const url = `${base}${path}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(`HTTP ${res.status} for ${path}${text ? `: ${text}` : ""}`);
    err.status = res.status;
    throw err;
  }

  // 204 no content
  if (res.status === 204) return null;
  return res.json();
}

// PUBLIC_INTERFACE
export const api = {
  /** Returns whether the app is using real HTTP API or mock/local mode. */
  isMockMode() {
    return !isConfiguredForRealApi();
  },

  /** List service requests (mock/local or backend). */
  async listRequests() {
    if (!isConfiguredForRealApi()) return loadRequestsFromStorage();
    return httpJson("/requests", { method: "GET" });
  },

  /** Get a single service request by id. */
  async getRequest(id) {
    if (!isConfiguredForRealApi()) return getRequestLocal(id);
    return httpJson(`/requests/${encodeURIComponent(id)}`, { method: "GET" });
  },

  /** Create a service request. */
  async createRequest(payload) {
    if (!isConfiguredForRealApi()) return createRequestLocal(payload);
    return httpJson("/requests", { method: "POST", body: JSON.stringify(payload) });
  },

  /** Update a service request. */
  async updateRequest(id, patch) {
    if (!isConfiguredForRealApi()) return updateRequestLocal(id, patch);
    return httpJson(`/requests/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(patch) });
  },

  /** Delete a service request. */
  async deleteRequest(id) {
    if (!isConfiguredForRealApi()) return deleteRequestLocal(id);
    return httpJson(`/requests/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
};
