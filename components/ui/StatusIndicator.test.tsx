import { render, screen } from "@testing-library/react";
import { StatusIndicator } from "@/components/ui/StatusIndicator";

describe("StatusIndicator", () => {
  it("renders its visible status label", () => {
    render(<StatusIndicator tone="success">Foundation ready</StatusIndicator>);

    expect(screen.getByText("Foundation ready")).toBeVisible();
  });
});
