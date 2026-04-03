import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "./page";

test("renders Home page", () => {
  render(<Home />);

  expect(
    screen.getByText("To get started, edit the page.tsx file."),
  ).toBeInTheDocument();
});
