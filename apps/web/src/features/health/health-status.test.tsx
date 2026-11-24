import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { server } from "@/src/mocks/node";
import { renderWithProviders } from "@/src/test/render";
import { HealthStatus } from "./health-status";
import { healthDownHandler } from "./mocks";

describe("HealthStatus", () => {
  it("shows the API and database status", async () => {
    renderWithProviders(<HealthStatus />);

    expect(screen.getByRole("status")).toHaveTextContent("Checking API");
    expect(await screen.findByText("up")).toBeInTheDocument();
    expect(screen.getByText("ok")).toBeInTheDocument();
  });

  it("shows an error when the API answers 503", async () => {
    server.use(healthDownHandler);

    renderWithProviders(<HealthStatus />);

    expect(await screen.findByRole("alert")).toHaveTextContent("503");
  });
});
