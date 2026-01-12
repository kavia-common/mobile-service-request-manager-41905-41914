import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { api } from "../../services/apiClient";
import { useTheme } from "../ui/useTheme";

function NavItem({ to, icon, label, onNavigate }) {
  const className = ({ isActive }) => `navItem ${isActive ? "navItemActive" : ""}`;
  return (
    <NavLink
      to={to}
      className={className}
      onClick={() => onNavigate?.()}
      aria-label={label}
    >
      <span className="navIcon" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </NavLink>
  );
}

function deriveTitle(pathname) {
  if (pathname.startsWith("/requests/new")) return "Create Service Request";
  if (pathname.includes("/edit")) return "Edit Service Request";
  if (pathname.startsWith("/requests/")) return "Request Details";
  return "Service Requests";
}

// PUBLIC_INTERFACE
export default function AppShell({ children }) {
  /** App layout wrapper: sidebar navigation + topbar actions + content. */
  const nav = useNavigate();
  const loc = useLocation();
  const { theme, toggle } = useTheme();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const openBtnRef = useRef(null);
  const closeBtnRef = useRef(null);

  const title = useMemo(() => deriveTitle(loc.pathname), [loc.pathname]);
  const mockMode = api.isMockMode();

  useEffect(() => {
    // Close drawer on route change
    setMobileNavOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    // Basic escape-to-close for drawer
    const onKey = (e) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    if (mobileNavOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileNavOpen]);

  useEffect(() => {
    // Focus management: move focus into drawer on open, return on close
    if (mobileNavOpen) closeBtnRef.current?.focus();
    else openBtnRef.current?.focus();
  }, [mobileNavOpen]);

  const SidebarContents = ({ variant }) => (
    <div aria-label="Primary navigation">
      <div className="brand">
        <div className="brandMark" aria-hidden="true" />
        <div>
          <div className="brandTitle">Mobile Service</div>
          <div className="brandSub">Request Manager</div>
        </div>
      </div>

      <div className="navSection" aria-label="Navigation">
        <NavItem to="/requests" icon="🧾" label="Service Requests" onNavigate={() => setMobileNavOpen(false)} />
        <NavItem to="/requests/new" icon="➕" label="Create Request" onNavigate={() => setMobileNavOpen(false)} />
      </div>

      <div className="navSection" style={{ marginTop: 18 }}>
        <div className="smallLabel">Mode</div>
        <div style={{ marginTop: 10 }}>
          <span className="badge">
            <span
              className="badgeDot"
              style={{ background: mockMode ? "var(--ocean-secondary)" : "var(--ocean-primary)" }}
              aria-hidden="true"
            />
            {mockMode ? "Mock / localStorage" : "Backend API"}
          </span>
        </div>

        {variant === "desktop" ? (
          <div style={{ marginTop: 10 }} className="helpText">
            Uses <code>REACT_APP_API_BASE</code>/<code>REACT_APP_BACKEND_URL</code> when set, otherwise local persistence.
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="appFrame">
      {/* Desktop sidebar */}
      <aside className="sidebar" aria-label="Sidebar">
        <SidebarContents variant="desktop" />
      </aside>

      {/* Mobile drawer sidebar */}
      {mobileNavOpen ? (
        <div
          className="sidebarOverlay"
          role="presentation"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}
      {mobileNavOpen ? (
        <aside
          className="sidebarDrawer"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
            <div className="smallLabel">Menu</div>
            <button
              ref={closeBtnRef}
              className="btn btnGhost"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close navigation menu"
            >
              Close
            </button>
          </div>

          <div style={{ marginTop: 12 }}>
            <SidebarContents variant="mobile" />
          </div>
        </aside>
      ) : null}

      <header className="topbar" role="banner">
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <button
            ref={openBtnRef}
            className="btn btnGhost"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation menu"
            aria-haspopup="dialog"
          >
            Menu
          </button>

          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 900, letterSpacing: "-0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {title}
            </div>
            <div style={{ fontSize: 12, color: "var(--ocean-muted)", fontWeight: 600 }}>
              Track, prioritize, and resolve mobile service tickets
            </div>
          </div>
        </div>

        <div className="topActions" aria-label="Top actions">
          <button
            className="btn btnGhost"
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>

          <button className="btn btnGhost" onClick={() => nav("/requests")} aria-label="Go to service requests list">
            List
          </button>
          <button className="btn btnPrimary" onClick={() => nav("/requests/new")} aria-label="Create a new request">
            New Request
          </button>
        </div>
      </header>

      <main className="main fadeIn" role="main" aria-label="Content">
        {mockMode ? (
          <div className="banner bannerWarn" role="status" aria-live="polite" style={{ marginBottom: 14 }}>
            <div>
              <div className="bannerTitle">Mock mode enabled</div>
              <div className="bannerDesc">
                No backend URL detected. Data is stored in <code>localStorage</code> and stays on this device.
              </div>
            </div>
            <button className="btn btnGhost" onClick={() => nav("/requests")} aria-label="Go to requests list">
              OK
            </button>
          </div>
        ) : null}

        {children}
      </main>
    </div>
  );
}
