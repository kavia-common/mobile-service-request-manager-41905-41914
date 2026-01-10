import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { RequestPriority, RequestStatus } from "../domain/constants";
import { api } from "../services/apiClient";
import { makeNewRequestDefaults } from "../utils/requests";

function Field({ label, children, hint }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 800, color: "var(--ocean-muted)" }}>{label}</label>
      <div style={{ marginTop: 6 }}>{children}</div>
      {hint ? <div style={{ marginTop: 6, fontSize: 12, color: "var(--ocean-muted)" }}>{hint}</div> : null}
    </div>
  );
}

// PUBLIC_INTERFACE
export default function ServiceRequestFormPage({ mode }) {
  /** Page to create or edit a service request. */
  const nav = useNavigate();
  const { id } = useParams();

  const isEdit = mode === "edit";
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState(makeNewRequestDefaults());

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!isEdit) return;
      setLoading(true);
      setError("");
      try {
        const data = await api.getRequest(id);
        if (!cancelled) {
          setForm({
            title: data.title ?? "",
            description: data.description ?? "",
            priority: data.priority ?? RequestPriority.MEDIUM,
            assignee: data.assignee ?? "",
            status: data.status ?? RequestStatus.OPEN,
          });
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load request.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  const isValid = useMemo(() => {
    return Boolean(form.title.trim()) && Boolean(form.description.trim());
  }, [form.title, form.description]);

  const onChange = (patch) => setForm((f) => ({ ...f, ...patch }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (!isValid) throw new Error("Please provide at least a title and description.");
      if (isEdit) {
        await api.updateRequest(id, form);
        nav(`/requests/${encodeURIComponent(id)}`);
      } else {
        const created = await api.createRequest(form);
        nav(`/requests/${encodeURIComponent(created.id)}`);
      }
    } catch (err) {
      setError(err.message || "Failed to save request.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="cardHeader">
          <h1 className="h1">{isEdit ? `Edit Request ${id}` : "Create Service Request"}</h1>
          <p className="h2" style={{ marginTop: 6 }}>
            {isEdit ? "Update details and status for the request." : "Add a new service request to the queue."}
          </p>
        </div>

        <div className="cardBody">
          {loading ? (
            <div style={{ color: "var(--ocean-muted)" }}>Loading…</div>
          ) : (
            <form onSubmit={onSubmit} aria-label="Service request form">
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
                  {error}
                </div>
              ) : null}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 14 }}>
                <Field label="Title" hint="Short summary shown in the request list.">
                  <input
                    className="input"
                    value={form.title}
                    onChange={(e) => onChange({ title: e.target.value })}
                    placeholder="e.g., Camera not focusing"
                    required
                  />
                </Field>

                <Field label="Priority" hint="Used for sorting and triage.">
                  <select className="select" value={form.priority} onChange={(e) => onChange({ priority: e.target.value })}>
                    <option value={RequestPriority.LOW}>{RequestPriority.LOW}</option>
                    <option value={RequestPriority.MEDIUM}>{RequestPriority.MEDIUM}</option>
                    <option value={RequestPriority.HIGH}>{RequestPriority.HIGH}</option>
                    <option value={RequestPriority.URGENT}>{RequestPriority.URGENT}</option>
                  </select>
                </Field>

                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Description" hint="Include symptoms, context, and any troubleshooting already performed.">
                    <textarea
                      className="textarea"
                      value={form.description}
                      onChange={(e) => onChange({ description: e.target.value })}
                      placeholder="Describe the issue…"
                      required
                    />
                  </Field>
                </div>

                <Field label="Assignee" hint="Optional technician name.">
                  <input
                    className="input"
                    value={form.assignee}
                    onChange={(e) => onChange({ assignee: e.target.value })}
                    placeholder="e.g., Sam"
                  />
                </Field>

                <Field label="Status" hint="Track progress as work proceeds.">
                  <select className="select" value={form.status} onChange={(e) => onChange({ status: e.target.value })}>
                    <option value={RequestStatus.OPEN}>{RequestStatus.OPEN}</option>
                    <option value={RequestStatus.IN_PROGRESS}>{RequestStatus.IN_PROGRESS}</option>
                    <option value={RequestStatus.RESOLVED}>{RequestStatus.RESOLVED}</option>
                    <option value={RequestStatus.CLOSED}>{RequestStatus.CLOSED}</option>
                  </select>
                </Field>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16, flexWrap: "wrap" }}>
                <button className="btn" type="button" onClick={() => nav(-1)} disabled={saving}>
                  Cancel
                </button>
                <button className={`btn btnPrimary`} type="submit" disabled={saving || !isValid} aria-disabled={saving || !isValid}>
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>

              <div style={{ marginTop: 12, fontSize: 12, color: "var(--ocean-muted)" }}>
                Required fields: <strong>title</strong> and <strong>description</strong>.
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
