import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { RequestStatus } from "../domain/constants";
import StatusBadge from "../components/StatusBadge";
import { api } from "../services/apiClient";
import { filterRequests, sortRequests } from "../utils/requests";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import { useToast } from "../components/ui/ToastProvider";

// PUBLIC_INTERFACE
export default function ServiceRequestsPage() {
  /** Page showing request list with filtering/search/sorting and CRUD actions. */
  const nav = useNavigate();
  const toast = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [sortKey, setSortKey] = useState("createdAtDesc");
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async ({ silent } = {}) => {
    if (!silent) setRefreshing(true);
    setLoading(true);
    setLoadError("");
    try {
      const data = await api.listRequests();
      setRequests(Array.isArray(data) ? data : []);
      if (!silent) toast.push({ title: "Updated", description: "Request list refreshed.", kind: "success" });
    } catch (e) {
      setLoadError(e?.message || "Failed to load requests.");
      if (!silent) toast.push({ title: "Could not refresh", description: "Please try again.", kind: "error" });
    } finally {
      setLoading(false);
      if (!silent) setRefreshing(false);
    }
  };

  useEffect(() => {
    refresh({ silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return filterRequests(requests, { query, status });
  }, [requests, query, status]);

  const sorted = useMemo(() => {
    return sortRequests(filtered, sortKey);
  }, [filtered, sortKey]);

  const onDelete = async (id) => {
    // eslint-disable-next-line no-alert
    const ok = window.confirm("Delete this request? This cannot be undone.");
    if (!ok) return;
    try {
      await api.deleteRequest(id);
      toast.push({ title: "Deleted", description: `Request ${id} removed.`, kind: "success" });
      await refresh({ silent: true });
    } catch (e) {
      toast.push({ title: "Delete failed", description: e?.message || "Please try again.", kind: "error" });
    }
  };

  const counts = useMemo(() => {
    const by = { total: requests.length, open: 0, inProgress: 0, resolved: 0, closed: 0 };
    for (const r of requests) {
      if (r.status === RequestStatus.OPEN) by.open += 1;
      else if (r.status === RequestStatus.IN_PROGRESS) by.inProgress += 1;
      else if (r.status === RequestStatus.RESOLVED) by.resolved += 1;
      else if (r.status === RequestStatus.CLOSED) by.closed += 1;
    }
    return by;
  }, [requests]);

  return (
    <div className="container">
      <Breadcrumbs items={[{ label: "Service Requests" }]} />

      <div className="card">
        <div className="cardHeader">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div>
              <h1 className="h1">Service Requests</h1>
              <p className="h2" style={{ marginTop: 6 }}>
                {loading
                  ? "Loading..."
                  : `${counts.total} total · ${counts.open} open · ${counts.inProgress} in progress · ${counts.resolved} resolved · ${counts.closed} closed`}
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <button className="btn" onClick={() => refresh()} disabled={refreshing} aria-disabled={refreshing}>
                {refreshing ? "Refreshing…" : "Refresh"}
              </button>
              <button className="btn btnPrimary" onClick={() => nav("/requests/new")}>
                Create
              </button>
            </div>
          </div>
        </div>

        <div className="cardBody">
          {loadError ? (
            <div
              className="banner"
              role="alert"
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                borderColor: "rgba(239, 68, 68, 0.28)",
                marginBottom: 12,
              }}
            >
              <div>
                <div className="bannerTitle">Could not load requests</div>
                <div className="bannerDesc">{loadError}</div>
              </div>
              <button className="btn btnGhost" onClick={() => refresh()}>
                Retry
              </button>
            </div>
          ) : null}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 180px 200px",
              gap: 12,
              alignItems: "end",
            }}
          >
            <div>
              <label className="smallLabel" htmlFor="searchInput">
                Search
              </label>
              <input
                id="searchInput"
                className="input"
                placeholder="Search by title, description, assignee, or ID…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div>
              <label className="smallLabel" htmlFor="statusSelect">
                Status
              </label>
              <select id="statusSelect" className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="All">All</option>
                <option value={RequestStatus.OPEN}>{RequestStatus.OPEN}</option>
                <option value={RequestStatus.IN_PROGRESS}>{RequestStatus.IN_PROGRESS}</option>
                <option value={RequestStatus.RESOLVED}>{RequestStatus.RESOLVED}</option>
                <option value={RequestStatus.CLOSED}>{RequestStatus.CLOSED}</option>
              </select>
            </div>

            <div>
              <label className="smallLabel" htmlFor="sortSelect">
                Sort
              </label>
              <select id="sortSelect" className="select" value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
                <option value="createdAtDesc">Newest first</option>
                <option value="createdAtAsc">Oldest first</option>
                <option value="priorityDesc">Priority (high → low)</option>
                <option value="priorityAsc">Priority (low → high)</option>
                <option value="statusAsc">Status</option>
                <option value="titleAsc">Title (A → Z)</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: 16, overflowX: "auto" }}>
            <table className="table" aria-label="Service requests table">
              <thead>
                <tr>
                  <th style={{ width: 120 }}>ID</th>
                  <th>Title</th>
                  <th style={{ width: 160 }}>Assignee</th>
                  <th style={{ width: 160 }}>Priority</th>
                  <th style={{ width: 190 }}>Status</th>
                  <th style={{ width: 220 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 16, color: "var(--ocean-muted)" }}>
                      Loading requests…
                    </td>
                  </tr>
                ) : sorted.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 16, color: "var(--ocean-muted)" }}>
                      No requests match your filters.
                    </td>
                  </tr>
                ) : (
                  sorted.map((r) => (
                    <tr className="tableRow" key={r.id}>
                      <td style={{ fontWeight: 900, letterSpacing: "-0.01em" }}>{r.id}</td>
                      <td>
                        <div style={{ fontWeight: 900, letterSpacing: "-0.01em" }}>
                          <Link to={`/requests/${encodeURIComponent(r.id)}`}>{r.title}</Link>
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--ocean-muted)",
                            marginTop: 4,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 520,
                          }}
                        >
                          {r.description}
                        </div>
                      </td>
                      <td>{r.assignee || <span style={{ color: "var(--ocean-muted)" }}>—</span>}</td>
                      <td>
                        <span className="badge" aria-label={`Priority: ${r.priority}`}>
                          <span className="badgeDot" aria-hidden="true" style={{ background: "rgba(245, 158, 11, 0.95)" }} />
                          {r.priority}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={r.status} />
                      </td>
                      <td style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button className="btn" onClick={() => nav(`/requests/${encodeURIComponent(r.id)}`)} aria-label={`View request ${r.id}`}>
                          View
                        </button>
                        <button className="btn" onClick={() => nav(`/requests/${encodeURIComponent(r.id)}/edit`)} aria-label={`Edit request ${r.id}`}>
                          Edit
                        </button>
                        <button className="btn btnDanger" onClick={() => onDelete(r.id)} aria-label={`Delete request ${r.id}`}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 14, fontSize: 12, color: "var(--ocean-muted)" }}>
            Tip: local mode persists to <code>localStorage</code>. Refresh the page to verify persistence.
          </div>

          {/* Stack filters for narrow screens */}
          <style>
            {`
              @media (max-width: 860px) {
                .cardBody > div[style*="grid-template-columns: 1fr 180px 200px"] {
                  grid-template-columns: 1fr !important;
                }
              }
            `}
          </style>
        </div>
      </div>
    </div>
  );
}
