import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Service Requests page shell", () => {
  render(<App />);
  expect(screen.getByText(/service requests/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /new request/i })).toBeInTheDocument();
});
