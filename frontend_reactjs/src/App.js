import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import AppShell from "./components/layout/AppShell";
import MarketingLayout from "./components/layout/MarketingLayout";

import HomePage from "./pages/website/HomePage";
import AboutPage from "./pages/website/AboutPage";
import ServicesPage from "./pages/website/ServicesPage";
import PricingPage from "./pages/website/PricingPage";
import ContactPage from "./pages/website/ContactPage";

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
        <Routes>
          {/* Marketing website (Ocean Professional) */}
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* App dashboard */}
          <Route
            path="/app/*"
            element={
              <AppShell>
                <Routes>
                  <Route path="" element={<Navigate to="requests" replace />} />
                  <Route path="requests" element={<ServiceRequestsPage />} />
                  <Route path="requests/new" element={<ServiceRequestFormPage mode="create" />} />
                  <Route path="requests/:id" element={<ServiceRequestDetailsPage />} />
                  <Route path="requests/:id/edit" element={<ServiceRequestFormPage mode="edit" />} />
                  <Route path="*" element={<Navigate to="requests" replace />} />
                </Routes>
              </AppShell>
            }
          />

          {/* Back-compat: older links go to app */}
          <Route path="/requests" element={<Navigate to="/app/requests" replace />} />
          <Route path="/requests/new" element={<Navigate to="/app/requests/new" replace />} />
          <Route path="/requests/:id" element={<Navigate to="/app/requests/:id" replace />} />
          <Route path="/requests/:id/edit" element={<Navigate to="/app/requests/:id/edit" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
