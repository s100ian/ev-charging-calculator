import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CostResults from "./CostResults";

describe("CostResults", () => {
  it("renders formatted cost values", () => {
    render(
      <CostResults
        currencySymbol="€"
        sessionCost={4.5}
        fullChargeCost={12}
        costPer100Km={5.25}
      />
    );

    expect(screen.getByText("€4.50")).toBeInTheDocument();
    expect(screen.getByText("€12.00")).toBeInTheDocument();
    expect(screen.getByText("€5.25 / 100 km")).toBeInTheDocument();
  });

  it("renders placeholders when cost values are unavailable", () => {
    render(
      <CostResults
        currencySymbol="€"
        sessionCost={null}
        fullChargeCost={null}
        costPer100Km={null}
      />
    );

    expect(screen.getAllByText("—")).toHaveLength(3);
  });

  it("renders multi-character currency symbols", () => {
    render(
      <CostResults
        currencySymbol="лв"
        sessionCost={4.5}
        fullChargeCost={12}
        costPer100Km={5.25}
      />
    );

    expect(screen.getByText("лв4.50")).toBeInTheDocument();
  });
});
