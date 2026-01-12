import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import StatusBadge from "../components/StatusBadge";
import { api } from "../services/apiClient";
import { RequestStatus } from "../domain/constants";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import { useToast } from "../components/ui/ToastProvider";

function formatDate(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleString();
}

// PUBLIC_INTERFACE
export default function ServiceRequestDetailsPage() {
  /** Page showing details for one request, including quick status actions. */
  const { id } = useParams();
  const nav = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [req, setReq] = useState(null);
  const [error, setError] = useState("");
  const [mutating, setMutating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getRequest(id);
      setReq(data);
    } catch (e) {
      setError(e.message || "Failed to load request.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (status) => {
    setMutating(true);
    try {
      await api.updateRequest(id, { status });
      toast.push({ title: "Updated", description: `Status set to ${status}.`, kind: "success" });
      await load();
    } catch (e) {
      toast.push({ title: "Update failed", description: e?.message || "Please try again.", kind: "error" });
    } finally {
      setMutating(false);
    }
  };

  const onDelete = async () => {
    // eslint-disable-next-line no-alert
    const ok = window.confirm("Delete this request? This cannot be undone.");
    if (!ok) return;
    setMutating(true);
    try {
      await api.deleteRequest(id);
      toast.push({ title: "Deleted", description: `Request ${id} removed.`, kind: "success" });
      nav("/requests");
    } catch (e) {
      toast.push({ title: "Delete failed", description: e?.message || "Please try again.", kind: "error" });
    } finally {
      setMutating(false);
    }
  };

  const crumbs = [
    { label: "Service Requests", to: "/requests" },
    { label: `Request ${id}` },
  ];

  return (
    <div className="container">
      <Breadcrumbs items={crumbs} />

      <div className="card">
        <div className="cardHeader">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <h1 className="h1">{loading ? "Loading…" : req?.title || `Request ${id}`}</h1>
              <p className="h2" style={{ marginTop: 6 }}>
                <span style={{ marginRight: 8, fontWeight: 900 }}>ID:</span>
                <span>{id}</span>
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <button
                className="btn"
                onClick={() => nav(`/requests/${encodeURIComponent(id)}/edit`)}
                disabled={loading || !!error || mutating}
                aria-disabled={loading || !!error || mutating}
              >
                Edit
              </button>
              <button className="btn btnDanger" onClick={onDelete} disabled={loading || !!error || mutating} aria-disabled={loading || !!error || mutating}>
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="cardBody">
          {error ? (
            <div
              className="banner"
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                borderColor: "rgba(239, 68, 68, 0.28)",
                marginBottom: 12,
              }}
              role="alert"
            >
              <div>
                <div className="bannerTitle">Could not load request</div>
                <div className="bannerDesc">
                  {error}{" "}
                  <Link to="/requests" className="crumbLink">
                    Back to list
                  </Link>
                </div>
              </div>
              <button className="btn btnGhost" onClick={load}>
                Retry
              </button>
            </div>
          ) : null}

          {!loading && req ? (
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 14 }}>
              <div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <StatusBadge status={req.status} />
                  <span className="badge" aria-label={`Priority: ${req.priority}`}>
                    <span className="badgeDot" aria-hidden="true" style={{ background: "rgba(245, 158, 11, 0.95)" }} />
                    {req.priority}
                  </span>
                  {req.assignee ? (
                    <span className="badge" aria-label={`Assignee: ${req.assignee}`}>
                      <span className="badgeDot" aria-hidden="true" style={{ background: "rgba(37, 99, 235, 0.95)" }} />
                      {req.assignee}
                    </span>
                  ) : null}
                </div>

                <div style={{ marginTop: 14, fontWeight: 900, letterSpacing: "-0.02em" }}>Description</div>
                <div style={{ marginTop: 8, color: "var(--ocean-text)", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
                  {req.description || <span style={{ color: "var(--ocean-muted)" }}>—</span>}
                </div>

                <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="card" style={{ boxShadow: "none" }}>
                    <div className="cardBody">
                      <div className="smallLabel">Created</div>
                      <div style={{ marginTop: 6, fontWeight: 900 }}>{formatDate(req.createdAt)}</div>
                    </div>
                  </div>
                  <div className="card" style={{ boxShadow: "none" }}>
                    <div className="cardBody">
                      <div className="smallLabel">Last updated</div>
                      <div style={{ marginTop: 6, fontWeight: 900 }}>{formatDate(req.updatedAt)}</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 14 }}>
                  <Link to="/requests" className="btn btnGhost" style={{ display: "inline-block" }} aria-label="Back to list">
                    ← Back to list
                  </Link>
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 900, letterSpacing: "-0.02em" }}>Quick status actions</div>
                <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                  <button className="btn" onClick={() => setStatus(RequestStatus.OPEN)} disabled={mutating || req.status === RequestStatus.OPEN}>
                    Mark Open
                  </button>
                  <button className="btn" onClick={() => setStatus(RequestStatus.IN_PROGRESS)} disabled={mutating || req.status === RequestStatus.IN_PROGRESS}>
                    Mark In Progress
                  </button>
                  <button className="btn" onClick={() => setStatus(RequestStatus.RESOLVED)} disabled={mutating || req.status === RequestStatus.RESOLVED}>
                    Mark Resolved
                  </button>
                  <button className="btn" onClick={() => setStatus(RequestStatus.CLOSED)} disabled={mutating || req.status === RequestStatus.CLOSED}>
                    Mark Closed
                  </button>
                </div>

                <div style={{ marginTop: 14, fontSize: 12, color: "var(--ocean-muted)", lineHeight: 1.4 }}>
                  Use <strong>Edit</strong> for full changes (title/description/assignee/priority).
                </div>

                <style>
                  {`
                    @media (max-width: 860px) {
                      .cardBody > div[style*="grid-template-columns: 1.2fr 0.8fr"] {
                        grid-template-columns: 1fr !important;
                      }
                      .cardBody > div[style*="grid-template-columns: 1fr 1fr"] {
                        grid-template-columns: 1fr !important;
                      }
                    }
                  `}
                </style>
              </div>
            </div>
          ) : loading ? (
            <div style={{ color: "var(--ocean-muted)" }} role="status" aria-live="polite">
              Loading…
            </div>
          ) : (
            <div style={{ color: "var(--ocean-muted)" }}>No data.</div>
          )}
        </div>
      </div>
    </div>
  );
}
