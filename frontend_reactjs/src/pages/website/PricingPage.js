import React from "react";
import { useNavigate } from "react-router-dom";
import { pricingPlans } from "../../mock/websiteData";

// PUBLIC_INTERFACE
export default function PricingPage() {
  /** Pricing page for the Ocean Professional marketing website. */
  const nav = useNavigate();

  return (
    <div className="section">
      <div className="sectionInner">
        <div className="sectionTitleRow">
          <div>
            <h1 className="h1">Pricing</h1>
            <p className="sectionDesc">
              Mock plans to help structure the page and iterate. Replace with real business pricing later.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btnPrimary" onClick={() => nav("/contact")} aria-label="Contact sales">
              Contact sales
            </button>
            <button className="btn" onClick={() => nav("/app/requests")} aria-label="Open dashboard">
              Open dashboard
            </button>
          </div>
        </div>

        <div className="pricingGrid" aria-label="Pricing plans">
          {pricingPlans.map((p) => (
            <div
              key={p.name}
              className="priceCard"
              style={
                p.emphasis
                  ? {
                      borderColor: "rgba(37, 99, 235, 0.35)",
                      boxShadow: "0 18px 56px rgba(37, 99, 235, 0.18)",
                      background:
                        "radial-gradient(700px 240px at 20% 0%, rgba(37, 99, 235, 0.16), transparent 60%), var(--ocean-surface)",
                    }
                  : undefined
              }
            >
              <div className="priceTop">
                <div className="priceName">{p.name}</div>
                {p.emphasis ? (
                  <span className="badge" aria-label="Recommended plan">
                    <span className="badgeDot" aria-hidden="true" style={{ background: "var(--ocean-primary)" }} />
                    Recommended
                  </span>
                ) : null}
              </div>

              <div style={{ marginTop: 10 }}>
                <div className="priceValue">{p.price}</div>
                <div className="pricePeriod">{p.period}</div>
              </div>

              <ul className="priceBullets">
                {p.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>

              <div className="priceCtaRow">
                <button
                  className={p.emphasis ? "btn btnPrimary" : "btn"}
                  onClick={() => nav(p.cta.to)}
                  aria-label={p.cta.label}
                >
                  {p.cta.label}
                </button>
                <button className="btn btnGhost" onClick={() => nav("/services")} aria-label="View services">
                  View services
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
