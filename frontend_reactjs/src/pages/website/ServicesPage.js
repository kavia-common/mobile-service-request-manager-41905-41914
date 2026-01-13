import React from "react";
import { useNavigate } from "react-router-dom";
import { services } from "../../mock/websiteData";

// PUBLIC_INTERFACE
export default function ServicesPage() {
  /** Services page for the Ocean Professional marketing website. */
  const nav = useNavigate();

  return (
    <div className="section">
      <div className="sectionInner">
        <div className="card">
          <div className="cardHeader">
            <h1 className="h1">Services</h1>
            <p className="h2" style={{ marginTop: 6 }}>
              Start with a solid workflow foundation—extend to match your operations.
            </p>
          </div>

          <div className="cardBody">
            <div className="grid3" aria-label="Service list" style={{ marginTop: 0 }}>
              {services.map((s) => (
                <div key={s.name} className="featureCard">
                  <div className="featureIcon" aria-hidden="true">
                    {s.icon}
                  </div>
                  <div className="featureTitle">{s.name}</div>
                  <div className="featureDesc">{s.description}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn btnPrimary" onClick={() => nav("/pricing")} aria-label="View pricing">
                View pricing
              </button>
              <button className="btn" onClick={() => nav("/app/requests")} aria-label="Open dashboard">
                Open dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
