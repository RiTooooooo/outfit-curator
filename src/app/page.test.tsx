import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "./page";

test("renders Home page hero title", () => {
  render(<Home />);

  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading).toHaveTextContent("あなただけの");
});

test("renders diagnosis CTA link", () => {
  render(<Home />);

  const links = screen.getAllByRole("link", { name: /診断/ });
  expect(links.length).toBeGreaterThan(0);
  expect(links[0]).toHaveAttribute("href", "/diagnosis");
});
