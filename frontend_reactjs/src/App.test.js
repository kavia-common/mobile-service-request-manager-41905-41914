import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders primary landmarks and key actions", () => {
  render(<App />);

  // Landmarks
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(screen.getByRole("main", { name: /content/i })).toBeInTheDocument();

  // Key actions
  expect(screen.getByRole("button", { name: /open navigation menu/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /new request/i })).toBeInTheDocument();

  // Page content (use a specific landmark to avoid ambiguous matches)
  expect(screen.getByRole("heading", { name: /service requests/i })).toBeInTheDocument();
});
