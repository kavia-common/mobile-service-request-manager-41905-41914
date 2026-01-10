import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { api } from "../../services/apiClient";

function NavItem({ to, icon, label }) {
  const className = ({ isActive }) => `navItem ${isActive ? "navItemActive" : ""}`;
  return (
    <NavLink to={to} className={className}>
      <span className="navIcon" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </NavLink>
  );
}

// PUBLIC_INTERFACE
export default function AppShell({ children }) {
  /** App layout wrapper: sidebar navigation + topbar actions + content. */
  const nav = useNavigate();
  const loc = useLocation();

  return (
    <div className="appFrame">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandMark" aria-hidden="true" />
          <div>
            <div className="brandTitle">Mobile Service</div>
            <div className="brandSub">Request Manager</div>
          </div>
        </div>

        <div className="navSection" aria-label="Navigation">
          <NavItem to="/requests" icon="🧾" label="Service Requests" />
          <NavItem to="/requests/new" icon="➕" label="Create Request" />
        </div>

        <div className="navSection" style={{ marginTop: 18 }}>
          <div style={{ fontSize: 12, color: "var(--ocean-muted)", fontWeight: 700, letterSpacing: "0.06em" }}>
            MODE
          </div>
          <div style={{ marginTop: 10 }}>
            <span className="badge">
              <span className="badgeDot" style={{ background: api.isMockMode() ? "var(--ocean-secondary)" : "var(--ocean-primary)" }} />
              {api.isMockMode() ? "Mock / localStorage" : "Backend API"}
            </span>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: "var(--ocean-muted)", lineHeight: 1.4 }}>
            Uses <code>REACT_APP_API_BASE</code>/<code>REACT_APP_BACKEND_URL</code> when set, otherwise local persistence.
          </div>
        </div>
      </aside>

      <header className="topbar">
        <div>
          <div style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
            {loc.pathname.startsWith("/requests/new")
              ? "Create Service Request"
              : loc.pathname.includes("/edit")
                ? "Edit Service Request"
                : loc.pathname.startsWith("/requests/")
                  ? "Request Details"
                  : "Service Requests"}
          </div>
          <div style={{ fontSize: 12, color: "var(--ocean-muted)", fontWeight: 600 }}>
            Track, prioritize, and resolve mobile service tickets
          </div>
        </div>

        <div className="topActions">
          <button className="btn btnGhost" onClick={() => nav("/requests")} aria-label="Go to service requests list">
            List
          </button>
          <button className="btn btnPrimary" onClick={() => nav("/requests/new")} aria-label="Create a new request">
            New Request
          </button>
        </div>
      </header>

      <main className="main fadeIn">{children}</main>
    </div>
  );
}
