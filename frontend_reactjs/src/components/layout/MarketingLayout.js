import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "../ui/useTheme";

function SiteNavLink({ to, children }) {
  const className = ({ isActive }) => `siteNavLink ${isActive ? "siteNavLinkActive" : ""}`;
  return (
    <NavLink to={to} className={className}>
      {children}
    </NavLink>
  );
}

// PUBLIC_INTERFACE
export default function MarketingLayout() {
  /** Marketing/website layout (top nav + footer) for the Ocean Professional theme. */
  const { theme, toggle } = useTheme();
  const nav = useNavigate();

  return (
    <div className="siteFrame">
      <header className="siteHeader" role="banner">
        <div className="siteHeaderInner">
          <button
            type="button"
            className="siteBrand"
            onClick={() => nav("/")}
            aria-label="Go to home"
          >
            <span className="brandMark" aria-hidden="true" style={{ width: 30, height: 30 }} />
            <span style={{ display: "grid", lineHeight: 1.1 }}>
              <span style={{ fontWeight: 950, letterSpacing: "-0.03em" }}>Ocean Professional</span>
              <span style={{ fontSize: 12, color: "var(--ocean-muted)", fontWeight: 700 }}>
                Mobile Service Manager
              </span>
            </span>
          </button>

          <nav className="siteNav" aria-label="Site navigation">
            <SiteNavLink to="/">Home</SiteNavLink>
            <SiteNavLink to="/services">Services</SiteNavLink>
            <SiteNavLink to="/pricing">Pricing</SiteNavLink>
            <SiteNavLink to="/about">About</SiteNavLink>
            <SiteNavLink to="/contact">Contact</SiteNavLink>

            <button
              type="button"
              className="btn btnGhost"
              onClick={toggle}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              style={{ marginLeft: 6 }}
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>

            <button
              type="button"
              className="btn btnPrimary"
              onClick={() => nav("/app/requests")}
              aria-label="Open dashboard"
              style={{ marginLeft: 6 }}
            >
              Dashboard
            </button>
          </nav>
        </div>
      </header>

      <main className="siteMain" role="main" aria-label="Website content">
        <Outlet />
      </main>

      <footer className="siteFooter" role="contentinfo">
        <div className="siteFooterInner">
          <div>
            <span style={{ fontWeight: 950, color: "var(--ocean-text)" }}>Mobile Service Request Manager</span>{" "}
            · Ocean Professional
          </div>
          <div>
            Tip: configure <code>REACT_APP_API_BASE</code> to switch from local mock mode to backend API.
          </div>
        </div>
      </footer>
    </div>
  );
}
