import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function Breadcrumbs({ items }) {
  /** Renders breadcrumbs navigation. items: [{ label, to? }] */
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {safeItems.map((it, idx) => {
        const isLast = idx === safeItems.length - 1;
        const sep = idx === 0 ? null : <span className="crumbSep" aria-hidden="true">/</span>;

        return (
          <React.Fragment key={`${it.label}-${idx}`}>
            {sep}
            {it.to && !isLast ? (
              <Link className="crumbLink" to={it.to}>
                {it.label}
              </Link>
            ) : (
              <span aria-current={isLast ? "page" : undefined}>{it.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
