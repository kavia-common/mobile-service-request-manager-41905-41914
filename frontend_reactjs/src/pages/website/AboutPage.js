import React from "react";
import { useNavigate } from "react-router-dom";

// PUBLIC_INTERFACE
export default function AboutPage() {
  /** About page for the Ocean Professional marketing website. */
  const nav = useNavigate();

  return (
    <div className="section">
      <div className="sectionInner">
        <div className="card">
          <div className="cardHeader">
            <h1 className="h1">About</h1>
            <p className="h2" style={{ marginTop: 6 }}>
              Ocean Professional is a clean dashboard + website scaffold designed for iterative product development.
            </p>
          </div>

          <div className="cardBody" style={{ lineHeight: 1.6 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="card" style={{ boxShadow: "none" }}>
                <div className="cardBody">
                  <div className="smallLabel">Mission</div>
                  <div style={{ marginTop: 6, fontWeight: 900, letterSpacing: "-0.02em" }}>
                    Help teams move from idea → demo → production without redoing UI foundations.
                  </div>
                  <div style={{ marginTop: 8, color: "var(--ocean-muted)", fontWeight: 650 }}>
                    The site pages provide a place for product marketing content while the dashboard delivers immediate
                    operational value.
                  </div>
                </div>
              </div>

              <div className="card" style={{ boxShadow: "none" }}>
                <div className="cardBody">
                  <div className="smallLabel">Approach</div>
                  <div style={{ marginTop: 6, fontWeight: 900, letterSpacing: "-0.02em" }}>
                    Minimal dependencies, accessible components, and a consistent theme.
                  </div>
                  <div style={{ marginTop: 8, color: "var(--ocean-muted)", fontWeight: 650 }}>
                    Routes, layouts, and mock data are included so development can start immediately.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 900, letterSpacing: "-0.02em" }}>Next steps</div>
              <ul style={{ marginTop: 8, color: "var(--ocean-muted)", fontWeight: 650, lineHeight: 1.55 }}>
                <li>Replace mock content in <code>src/mock/websiteData.js</code> with real copy.</li>
                <li>Integrate backend endpoints by setting <code>REACT_APP_API_BASE</code>.</li>
                <li>Add authentication and role-based access (future enhancement).</li>
              </ul>
            </div>

            <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn btnPrimary" onClick={() => nav("/app/requests")} aria-label="Open dashboard">
                Open dashboard
              </button>
              <button className="btn" onClick={() => nav("/contact")} aria-label="Contact">
                Contact
              </button>
            </div>

            <style>
              {`
                @media (max-width: 860px) {
                  .cardBody > div[style*="grid-template-columns: 1fr 1fr"] {
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
