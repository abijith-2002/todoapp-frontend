import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Tasks heading", () => {
  render(<App />);
  const heading = screen.getByRole("heading", { name: /tasks/i });
  expect(heading).toBeInTheDocument();
});
