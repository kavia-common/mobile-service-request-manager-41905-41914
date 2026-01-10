import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import StatusBadge from "../components/StatusBadge";
import { api } from "../services/apiClient";
import { RequestStatus } from "../domain/constants";

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

  const [loading, setLoading] = useState(true);
  const [req, setReq] = useState(null);
  const [error, setError] = useState("");

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
    await api.updateRequest(id, { status });
    await load();
  };

  const onDelete = async () => {
    // eslint-disable-next-line no-alert
    const ok = window.confirm("Delete this request? This cannot be undone.");
    if (!ok) return;
    await api.deleteRequest(id);
    nav("/requests");
  };

  return (
    <div className="container">
      <div className="card">
        <div className="cardHeader">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <h1 className="h1">{loading ? "Loading…" : req?.title || `Request ${id}`}</h1>
              <p className="h2" style={{ marginTop: 6 }}>
                <span style={{ marginRight: 8, fontWeight: 800 }}>ID:</span>
                <span>{id}</span>
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <button className="btn" onClick={() => nav(`/requests/${encodeURIComponent(id)}/edit`)} disabled={loading || !!error}>
                Edit
              </button>
              <button className="btn btnDanger" onClick={onDelete} disabled={loading || !!error}>
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="cardBody">
          {error ? (
            <div
              style={{
                padding: 12,
                borderRadius: 12,
                border: "1px solid rgba(239, 68, 68, 0.25)",
                background: "rgba(239, 68, 68, 0.08)",
                color: "#991b1b",
                marginBottom: 12,
                fontWeight: 700,
              }}
              role="alert"
            >
              {error}{" "}
              <Link to="/requests" style={{ textDecoration: "underline" }}>
                Back to list
              </Link>
            </div>
          ) : null}

          {!loading && req ? (
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 14 }}>
              <div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <StatusBadge status={req.status} />
                  <span className="badge">
                    <span className="badgeDot" aria-hidden="true" style={{ background: "rgba(245, 158, 11, 0.9)" }} />
                    {req.priority}
                  </span>
                  {req.assignee ? (
                    <span className="badge">
                      <span className="badgeDot" aria-hidden="true" style={{ background: "rgba(37, 99, 235, 0.9)" }} />
                      {req.assignee}
                    </span>
                  ) : null}
                </div>

                <div style={{ marginTop: 14, fontWeight: 900, letterSpacing: "-0.02em" }}>Description</div>
                <div style={{ marginTop: 8, color: "var(--ocean-text)", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
                  {req.description}
                </div>

                <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="card" style={{ boxShadow: "none" }}>
                    <div className="cardBody">
                      <div style={{ fontSize: 12, color: "var(--ocean-muted)", fontWeight: 800 }}>Created</div>
                      <div style={{ marginTop: 6, fontWeight: 800 }}>{formatDate(req.createdAt)}</div>
                    </div>
                  </div>
                  <div className="card" style={{ boxShadow: "none" }}>
                    <div className="cardBody">
                      <div style={{ fontSize: 12, color: "var(--ocean-muted)", fontWeight: 800 }}>Last updated</div>
                      <div style={{ marginTop: 6, fontWeight: 800 }}>{formatDate(req.updatedAt)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 900, letterSpacing: "-0.02em" }}>Quick status actions</div>
                <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                  <button className="btn" onClick={() => setStatus(RequestStatus.OPEN)} disabled={req.status === RequestStatus.OPEN}>
                    Mark Open
                  </button>
                  <button
                    className="btn"
                    onClick={() => setStatus(RequestStatus.IN_PROGRESS)}
                    disabled={req.status === RequestStatus.IN_PROGRESS}
                  >
                    Mark In Progress
                  </button>
                  <button
                    className="btn"
                    onClick={() => setStatus(RequestStatus.RESOLVED)}
                    disabled={req.status === RequestStatus.RESOLVED}
                  >
                    Mark Resolved
                  </button>
                  <button className="btn" onClick={() => setStatus(RequestStatus.CLOSED)} disabled={req.status === RequestStatus.CLOSED}>
                    Mark Closed
                  </button>
                </div>

                <div style={{ marginTop: 14, fontSize: 12, color: "var(--ocean-muted)", lineHeight: 1.4 }}>
                  Use <strong>Edit</strong> for full changes (title/description/assignee/priority).
                </div>

                <div style={{ marginTop: 14 }}>
                  <Link to="/requests" className="btn btnGhost" style={{ display: "inline-block" }}>
                    ← Back to list
                  </Link>
                </div>
              </div>
            </div>
          ) : loading ? (
            <div style={{ color: "var(--ocean-muted)" }}>Loading…</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
