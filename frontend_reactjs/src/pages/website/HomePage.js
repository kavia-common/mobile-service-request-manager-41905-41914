import React from "react";
import { useNavigate } from "react-router-dom";
import { highlights, siteMeta, testimonials } from "../../mock/websiteData";

// PUBLIC_INTERFACE
export default function HomePage() {
  /** Ocean Professional marketing home page. */
  const nav = useNavigate();

  return (
    <div>
      <section className="hero">
        <div className="heroInner">
          <div className="heroCard">
            <div className="heroEyebrow">
              <span className="badgeDot" aria-hidden="true" style={{ background: "var(--ocean-primary)" }} />
              Ocean Professional
            </div>
            <h1 className="heroTitle">{siteMeta.productName}</h1>
            <p className="heroLead">{siteMeta.tagline}</p>

            <div className="heroActions">
              <button className="btn btnPrimary" onClick={() => nav(siteMeta.ctaPrimary.to)}>
                {siteMeta.ctaPrimary.label}
              </button>
              <button className="btn" onClick={() => nav(siteMeta.ctaSecondary.to)}>
                {siteMeta.ctaSecondary.label}
              </button>
            </div>

            <div style={{ marginTop: 14, color: "var(--ocean-muted)", fontWeight: 650, lineHeight: 1.5 }}>
              Build faster with a ready-to-extend UI: pages, routing, layout, and mock data included.
            </div>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <div className="smallLabel">At a glance</div>
            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
              <div className="banner" style={{ background: "rgba(37, 99, 235, 0.08)" }}>
                <div>
                  <div className="bannerTitle">Dashboard included</div>
                  <div className="bannerDesc">Service request list, create/edit, and details screens.</div>
                </div>
                <button className="btn btnGhost" onClick={() => nav("/app/requests")} aria-label="Go to dashboard">
                  Open
                </button>
              </div>

              <div className="banner bannerWarn">
                <div>
                  <div className="bannerTitle">Mock mode support</div>
                  <div className="bannerDesc">Local persistence via localStorage when no backend URL is set.</div>
                </div>
                <button className="btn btnGhost" onClick={() => nav("/services")} aria-label="See services">
                  Learn
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="sectionInner">
          <div className="sectionTitleRow">
            <div>
              <h2 className="sectionTitle">Built for service operations</h2>
              <p className="sectionDesc">
                A modern, minimalist UI with blue/amber accents, subtle gradients, and crisp typography.
              </p>
            </div>
          </div>

          <div className="grid3" aria-label="Highlights">
            {highlights.map((h) => (
              <div key={h.title} className="featureCard">
                <div className="featureIcon" aria-hidden="true">
                  {h.icon}
                </div>
                <div className="featureTitle">{h.title}</div>
                <div className="featureDesc">{h.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 10 }}>
        <div className="sectionInner">
          <div className="sectionTitleRow">
            <div>
              <h2 className="sectionTitle">What teams say</h2>
              <p className="sectionDesc">Mock testimonials to shape the content and layout as development starts.</p>
            </div>
          </div>

          <div className="grid3" aria-label="Testimonials">
            {testimonials.map((t) => (
              <div key={t.name} className="featureCard">
                <div style={{ fontWeight: 900, letterSpacing: "-0.02em" }}>"{t.quote}"</div>
                <div style={{ marginTop: 10, color: "var(--ocean-muted)", fontWeight: 800 }}>
                  {t.name} · {t.org}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btnPrimary" onClick={() => nav("/pricing")} aria-label="View pricing">
              View pricing
            </button>
            <button className="btn" onClick={() => nav("/contact")} aria-label="Contact">
              Contact
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
