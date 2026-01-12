import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import AppShell from "./components/layout/AppShell";
import ServiceRequestsPage from "./pages/ServiceRequestsPage";
import ServiceRequestFormPage from "./pages/ServiceRequestFormPage";
import ServiceRequestDetailsPage from "./pages/ServiceRequestDetailsPage";
import { ToastProvider } from "./components/ui/ToastProvider";

// PUBLIC_INTERFACE
function App() {
  /** Root application component that defines routing and top-level layout. */
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/requests" replace />} />
            <Route path="/requests" element={<ServiceRequestsPage />} />
            <Route path="/requests/new" element={<ServiceRequestFormPage mode="create" />} />
            <Route path="/requests/:id" element={<ServiceRequestDetailsPage />} />
            <Route path="/requests/:id/edit" element={<ServiceRequestFormPage mode="edit" />} />
            <Route path="*" element={<Navigate to="/requests" replace />} />
          </Routes>
        </AppShell>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
