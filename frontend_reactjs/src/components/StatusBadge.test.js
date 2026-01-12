import { render, screen } from "@testing-library/react";
import StatusBadge from "./StatusBadge";
import { RequestStatus } from "../domain/constants";

test("renders status label and accessible aria-label", () => {
  render(<StatusBadge status={RequestStatus.IN_PROGRESS} />);
  expect(screen.getByText(/in progress/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/status: in progress/i)).toBeInTheDocument();
});
