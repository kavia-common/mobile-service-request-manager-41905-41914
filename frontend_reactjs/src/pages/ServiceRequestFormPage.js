import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { RequestPriority, RequestStatus } from "../domain/constants";
import { api } from "../services/apiClient";
import { makeNewRequestDefaults } from "../utils/requests";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import { useToast } from "../components/ui/ToastProvider";

function Field({ label, required, children, hint, errorText, htmlFor }) {
  return (
    <div>
      <label className="smallLabel" htmlFor={htmlFor}>
        {label} {required ? <span aria-hidden="true" style={{ color: "var(--ocean-error)" }}>*</span> : null}
      </label>
      <div style={{ marginTop: 6 }}>{children}</div>
      {errorText ? (
        <div className="formErrorText" role="alert">
          {errorText}
        </div>
      ) : hint ? (
        <div className="helpText">{hint}</div>
      ) : null}
    </div>
  );
}

// PUBLIC_INTERFACE
export default function ServiceRequestFormPage({ mode }) {
  /** Page to create or edit a service request. */
  const nav = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  const isEdit = mode === "edit";
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [touched, setTouched] = useState({ title: false, description: false });
  const [form, setForm] = useState(makeNewRequestDefaults());

  const titleRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!isEdit) {
        // autofocus on create
        titleRef.current?.focus();
        return;
      }

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
        // autofocus after load (edit)
        window.setTimeout(() => titleRef.current?.focus(), 0);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  const validation = useMemo(() => {
    const errors = {};
    if (!form.title.trim()) errors.title = "Title is required.";
    if (!form.description.trim()) errors.description = "Description is required.";
    return errors;
  }, [form.title, form.description]);

  const isValid = useMemo(() => Object.keys(validation).length === 0, [validation]);

  const onChange = (patch) => setForm((f) => ({ ...f, ...patch }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (!isValid) {
        setTouched({ title: true, description: true });
        throw new Error("Please fix the highlighted fields.");
      }

      if (isEdit) {
        await api.updateRequest(id, form);
        toast.push({ title: "Saved", description: `Request ${id} updated.`, kind: "success" });
        nav(`/requests/${encodeURIComponent(id)}`);
      } else {
        const created = await api.createRequest(form);
        toast.push({ title: "Created", description: `Request ${created.id} created.`, kind: "success" });
        nav(`/requests/${encodeURIComponent(created.id)}`);
      }
    } catch (err) {
      setError(err.message || "Failed to save request.");
      toast.push({ title: "Save failed", description: err.message || "Please try again.", kind: "error" });
    } finally {
      setSaving(false);
    }
  };

  const crumbs = isEdit
    ? [
        { label: "Service Requests", to: "/requests" },
        { label: `Request ${id}`, to: `/requests/${encodeURIComponent(id)}` },
        { label: "Edit" },
      ]
    : [{ label: "Service Requests", to: "/requests" }, { label: "New request" }];

  return (
    <div className="container">
      <Breadcrumbs items={crumbs} />

      <div className="card">
        <div className="cardHeader">
          <h1 className="h1">{isEdit ? `Edit Request ${id}` : "Create Service Request"}</h1>
          <p className="h2" style={{ marginTop: 6 }}>
            {isEdit ? "Update details and status for the request." : "Add a new service request to the queue."}
          </p>
        </div>

        <div className="cardBody">
          {loading ? (
            <div style={{ color: "var(--ocean-muted)" }} role="status" aria-live="polite">
              Loading…
            </div>
          ) : (
            <form onSubmit={onSubmit} aria-label="Service request form">
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
                    <div className="bannerTitle">Please review</div>
                    <div className="bannerDesc">{error}</div>
                  </div>
                  <Link className="btn btnGhost" to="/requests" aria-label="Back to list">
                    Back to list
                  </Link>
                </div>
              ) : null}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 14 }}>
                <Field
                  label="Title"
                  required
                  hint="Short summary shown in the request list."
                  errorText={touched.title ? validation.title : ""}
                  htmlFor="titleInput"
                >
                  <input
                    ref={titleRef}
                    id="titleInput"
                    className="input"
                    value={form.title}
                    onChange={(e) => onChange({ title: e.target.value })}
                    onBlur={() => setTouched((t) => ({ ...t, title: true }))}
                    placeholder="e.g., Camera not focusing"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(touched.title && validation.title)}
                  />
                </Field>

                <Field label="Priority" hint="Used for sorting and triage." htmlFor="prioritySelect">
                  <select
                    id="prioritySelect"
                    className="select"
                    value={form.priority}
                    onChange={(e) => onChange({ priority: e.target.value })}
                    aria-label="Priority"
                  >
                    <option value={RequestPriority.LOW}>{RequestPriority.LOW}</option>
                    <option value={RequestPriority.MEDIUM}>{RequestPriority.MEDIUM}</option>
                    <option value={RequestPriority.HIGH}>{RequestPriority.HIGH}</option>
                    <option value={RequestPriority.URGENT}>{RequestPriority.URGENT}</option>
                  </select>
                </Field>

                <div style={{ gridColumn: "1 / -1" }}>
                  <Field
                    label="Description"
                    required
                    hint="Include symptoms, context, and any troubleshooting already performed."
                    errorText={touched.description ? validation.description : ""}
                    htmlFor="descInput"
                  >
                    <textarea
                      id="descInput"
                      className="textarea"
                      value={form.description}
                      onChange={(e) => onChange({ description: e.target.value })}
                      onBlur={() => setTouched((t) => ({ ...t, description: true }))}
                      placeholder="Describe the issue…"
                      required
                      aria-required="true"
                      aria-invalid={Boolean(touched.description && validation.description)}
                    />
                  </Field>
                </div>

                <Field label="Assignee" hint="Optional technician name." htmlFor="assigneeInput">
                  <input
                    id="assigneeInput"
                    className="input"
                    value={form.assignee}
                    onChange={(e) => onChange({ assignee: e.target.value })}
                    placeholder="e.g., Sam"
                  />
                </Field>

                <Field label="Status" hint="Track progress as work proceeds." htmlFor="statusSelect">
                  <select
                    id="statusSelect"
                    className="select"
                    value={form.status}
                    onChange={(e) => onChange({ status: e.target.value })}
                  >
                    <option value={RequestStatus.OPEN}>{RequestStatus.OPEN}</option>
                    <option value={RequestStatus.IN_PROGRESS}>{RequestStatus.IN_PROGRESS}</option>
                    <option value={RequestStatus.RESOLVED}>{RequestStatus.RESOLVED}</option>
                    <option value={RequestStatus.CLOSED}>{RequestStatus.CLOSED}</option>
                  </select>
                </Field>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16, flexWrap: "wrap" }}>
                <button className="btn" type="button" onClick={() => nav(-1)} disabled={saving} aria-disabled={saving}>
                  Cancel
                </button>
                <button className="btn btnPrimary" type="submit" disabled={saving || !isValid} aria-disabled={saving || !isValid}>
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>

              <div style={{ marginTop: 12, fontSize: 12, color: "var(--ocean-muted)" }}>
                Required fields: <strong>title</strong> and <strong>description</strong>.
              </div>

              <style>
                {`
                  @media (max-width: 860px) {
                    form > div[style*="grid-template-columns: 1fr 240px"] {
                      grid-template-columns: 1fr !important;
                    }
                  }
                `}
              </style>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
