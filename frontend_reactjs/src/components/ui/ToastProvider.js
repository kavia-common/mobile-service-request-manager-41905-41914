import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

/**
 * Very small toast system for non-blocking confirmations.
 * No external deps; supports keyboard-accessible dismiss buttons.
 */

const ToastCtx = createContext(null);

function makeId() {
  return `t_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

// PUBLIC_INTERFACE
export function ToastProvider({ children }) {
  /** Provides toast API and renders toast region. */
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const remove = useCallback((id) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
  }, []);

  const push = useCallback(
    ({ title, description, kind = "success", timeoutMs = 2400 }) => {
      const id = makeId();
      setToasts((ts) => [{ id, title, description, kind }, ...ts].slice(0, 3));

      if (timeoutMs > 0) {
        const timer = window.setTimeout(() => remove(id), timeoutMs);
        timers.current.set(id, timer);
      }
      return id;
    },
    [remove],
  );

  const api = useMemo(() => ({ push, remove }), [push, remove]);

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="toastRegion" role="region" aria-label="Notifications">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast ${t.kind === "error" ? "toastError" : "toastSuccess"}`}
            role="status"
            aria-live="polite"
          >
            <div>
              <div className="toastTitle">{t.title}</div>
              {t.description ? <div className="toastDesc">{t.description}</div> : null}
            </div>
            <button className="btn btnGhost" onClick={() => remove(t.id)} aria-label="Dismiss notification">
              Dismiss
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

// PUBLIC_INTERFACE
export function useToast() {
  /** Hook to enqueue toast notifications. */
  const ctx = useContext(ToastCtx);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
