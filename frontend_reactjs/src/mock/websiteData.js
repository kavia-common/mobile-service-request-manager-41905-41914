/**
 * Mock content for the Ocean Professional marketing website.
 * Keep this file small and editable so product/content can iterate quickly.
 */

export const siteMeta = Object.freeze({
  productName: "Mobile Service Request Manager",
  tagline: "Track, prioritize, and resolve mobile service tickets.",
  ctaPrimary: { label: "Open Dashboard", to: "/app/requests" },
  ctaSecondary: { label: "Contact Sales", to: "/contact" },
});

export const highlights = Object.freeze([
  {
    title: "Real-time visibility",
    description: "A clean dashboard for service intake, triage, and status tracking—designed for speed.",
    icon: "📡",
  },
  {
    title: "Prioritization",
    description: "Use priority + status workflows so your team focuses on what matters most.",
    icon: "🎯",
  },
  {
    title: "Local-first mock mode",
    description: "Start building and demoing instantly—falls back to localStorage when no backend is configured.",
    icon: "⚡",
  },
]);

export const services = Object.freeze([
  {
    name: "Intake & triage",
    description: "Capture issues, assign ownership, and route requests into a consistent workflow.",
    icon: "🧾",
  },
  {
    name: "Repair operations",
    description: "Track diagnostics, parts, notes, and status to keep repairs moving forward.",
    icon: "🛠️",
  },
  {
    name: "Customer updates",
    description: "Make communication predictable with clear milestones and resolution notes.",
    icon: "💬",
  },
  {
    name: "Reporting",
    description: "Spot bottlenecks by status/priority trends and optimize throughput.",
    icon: "📈",
  },
  {
    name: "Audit & history",
    description: "See timestamps and changes to support accountability and compliance.",
    icon: "🧭",
  },
  {
    name: "Integrations-ready",
    description: "Structured endpoints and lightweight UI patterns, ready to connect to your backend.",
    icon: "🔌",
  },
]);

export const testimonials = Object.freeze([
  {
    name: "Operations Lead",
    org: "Repair Hub",
    quote: "We reduced time-to-triage by standardizing the workflow and making priorities visible.",
  },
  {
    name: "Service Manager",
    org: "MobileCare",
    quote: "The interface is fast and focused—exactly what technicians need on busy days.",
  },
  {
    name: "Team Lead",
    org: "DeviceWorks",
    quote: "Mock mode made it easy to demo while the API was still under construction.",
  },
]);

export const pricingPlans = Object.freeze([
  {
    name: "Starter",
    price: "$0",
    period: "demo",
    emphasis: false,
    bullets: ["Local mock mode", "Core request workflow", "Theme + layout scaffold"],
    cta: { label: "Try the Demo", to: "/app/requests" },
  },
  {
    name: "Professional",
    price: "$49",
    period: "per month",
    emphasis: true,
    bullets: ["Team workflow", "Priority + status automation (extensible)", "Integrations-ready UI"],
    cta: { label: "Get Started", to: "/contact" },
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "quote",
    emphasis: false,
    bullets: ["SSO + audit features (future)", "Custom SLAs + reporting", "Dedicated support"],
    cta: { label: "Talk to Sales", to: "/contact" },
  },
]);

export const faqs = Object.freeze([
  {
    q: "Is this connected to a backend API?",
    a: "If REACT_APP_API_BASE or REACT_APP_BACKEND_URL is set, the app uses the backend. Otherwise it runs fully in local mock mode using localStorage.",
  },
  {
    q: "Can we customize the workflow?",
    a: "Yes—statuses, priorities, and additional fields can be extended in the domain constants and request pages.",
  },
  {
    q: "Is it mobile-friendly?",
    a: "Yes—the UI is responsive, and the dashboard uses a drawer navigation on smaller screens.",
  },
]);
