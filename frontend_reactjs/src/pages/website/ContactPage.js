import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/ui/ToastProvider";

// PUBLIC_INTERFACE
export default function ContactPage() {
  /** Contact page scaffold (no backend submission yet). */
  const nav = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState({ name: false, email: false, message: false });

  const validation = useMemo(() => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required.";
    if (!form.email.trim()) errors.email = "Email is required.";
    if (!form.message.trim()) errors.message = "Message is required.";
    return errors;
  }, [form]);

  const isValid = useMemo(() => Object.keys(validation).length === 0, [validation]);

  const onSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });

    if (!isValid) {
      toast.push({ title: "Please fix the form", description: "Some fields are missing.", kind: "error" });
      return;
    }

    // No backend submission in this scaffold.
    toast.push({
      title: "Message captured (mock)",
      description: "Connect a backend endpoint to send this message.",
      kind: "success",
    });

    setForm({ name: "", email: "", message: "" });
    setTouched({ name: false, email: false, message: false });
  };

  const Field = ({ label, id, children, errorText, hint }) => (
    <div>
      <label className="smallLabel" htmlFor={id}>
        {label} <span aria-hidden="true" style={{ color: "var(--ocean-error)" }}>*</span>
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

  return (
    <div className="section">
      <div className="sectionInner">
        <div className="card">
          <div className="cardHeader">
            <h1 className="h1">Contact</h1>
            <p className="h2" style={{ marginTop: 6 }}>
              Use this form as a starting point. Wire it to your backend or CRM when ready.
            </p>
          </div>

          <div className="cardBody">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 0.9fr", gap: 14 }}>
              <form onSubmit={onSubmit} aria-label="Contact form">
                <div style={{ display: "grid", gap: 12 }}>
                  <Field
                    label="Name"
                    id="contactName"
                    hint="Tell us who to reach out to."
                    errorText={touched.name ? validation.name : ""}
                  >
                    <input
                      id="contactName"
                      className="input"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                      aria-invalid={Boolean(touched.name && validation.name)}
                      placeholder="e.g., Alex Chen"
                      required
                    />
                  </Field>

                  <Field
                    label="Email"
                    id="contactEmail"
                    hint="We’ll only use this to respond."
                    errorText={touched.email ? validation.email : ""}
                  >
                    <input
                      id="contactEmail"
                      className="input"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                      aria-invalid={Boolean(touched.email && validation.email)}
                      placeholder="e.g., alex@company.com"
                      required
                    />
                  </Field>

                  <Field
                    label="Message"
                    id="contactMessage"
                    hint="Describe what you want to build or integrate."
                    errorText={touched.message ? validation.message : ""}
                  >
                    <textarea
                      id="contactMessage"
                      className="textarea"
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                      aria-invalid={Boolean(touched.message && validation.message)}
                      placeholder="How can we help?"
                      required
                    />
                  </Field>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    <button type="button" className="btn" onClick={() => nav("/")} aria-label="Back to home">
                      Back
                    </button>
                    <button type="submit" className="btn btnPrimary" disabled={!isValid} aria-disabled={!isValid}>
                      Send (mock)
                    </button>
                  </div>
                </div>
              </form>

              <div className="card" style={{ boxShadow: "none" }}>
                <div className="cardBody">
                  <div className="smallLabel">Quick links</div>
                  <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                    <div className="banner" style={{ background: "rgba(37, 99, 235, 0.08)" }}>
                      <div>
                        <div className="bannerTitle">Open the dashboard</div>
                        <div className="bannerDesc">See the working service request workflow.</div>
                      </div>
                      <button className="btn btnGhost" type="button" onClick={() => nav("/app/requests")}>
                        Open
                      </button>
                    </div>

                    <div className="banner bannerWarn">
                      <div>
                        <div className="bannerTitle">API integration</div>
                        <div className="bannerDesc">
                          Set <code>REACT_APP_API_BASE</code> or <code>REACT_APP_BACKEND_URL</code> to enable real HTTP
                          calls.
                        </div>
                      </div>
                      <button className="btn btnGhost" type="button" onClick={() => nav("/services")}>
                        Details
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: 12, color: "var(--ocean-muted)", fontWeight: 650, lineHeight: 1.5 }}>
                    This page intentionally avoids external dependencies. Add validation, spam protection, and submission
                    when your backend route is ready.
                  </div>
                </div>
              </div>
            </div>

            <style>
              {`
                @media (max-width: 980px) {
                  .cardBody > div[style*="grid-template-columns: 1fr 0.9fr"] {
                    grid-template-columns: 1fr !important;
                  }
                }
              `}
            </style>
          </div>
        </div>
      </div>
    </div>
  );
}
