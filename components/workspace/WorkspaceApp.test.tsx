import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import {
  WORKSPACE_STORAGE_KEY,
} from "@/store/persistence";
import { WorkspaceApp } from "./WorkspaceApp";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

function renderWorkspace() {
  return render(
    <ReduxProvider>
      <WorkspaceApp />
    </ReduxProvider>,
  );
}

async function completeForm() {
  const user = userEvent.setup();

  await user.type(screen.getByLabelText("Name"), "  Alex Morgan  ");
  await user.type(
    screen.getByLabelText("Business or company name"),
    "Acme Solutions",
  );
  await user.type(
    screen.getByLabelText("Work email"),
    "ALEX@ACMESOLUTIONS.COM",
  );
  await user.selectOptions(screen.getByLabelText("Role"), "operations");
  await user.type(
    screen.getByLabelText("Initial business challenge or opportunity"),
    "We need to improve coordination across our current workflow.",
  );

  return user;
}

describe("WorkspaceApp onboarding", () => {
  it("keeps Continue disabled and shows accessible inline email validation", async () => {
    const user = userEvent.setup();
    renderWorkspace();

    const email = await screen.findByLabelText("Work email");
    const continueButton = screen.getByRole("button", {
      name: "Continue to Workspace",
    });

    expect(continueButton).toBeDisabled();

    await user.type(email, "not-an-email");
    await user.tab();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a valid work email.",
    );
    expect(email).toHaveAttribute("aria-invalid", "true");
  });

  it("stores normalized onboarding data and shows the ready handoff", async () => {
    renderWorkspace();
    await screen.findByLabelText("Name");
    const user = await completeForm();
    const continueButton = screen.getByRole("button", {
      name: "Continue to Workspace",
    });

    expect(continueButton).toBeEnabled();
    await user.click(continueButton);

    expect(
      await screen.findByRole("heading", {
        name: "Your context is ready, Alex.",
      }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(window.localStorage.getItem(WORKSPACE_STORAGE_KEY)).not.toBeNull();
    });

    const saved = JSON.parse(
      window.localStorage.getItem(WORKSPACE_STORAGE_KEY) ?? "{}",
    );

    expect(saved.user.fullName).toBe("Alex Morgan");
    expect(saved.user.email).toBe("alex@acmesolutions.com");
    expect(saved.user.onboardingCompleted).toBe(true);
    expect(saved.session.sessionId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it("restores a valid completed onboarding session", async () => {
    window.localStorage.setItem(
      WORKSPACE_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        user: {
          fullName: "Jordan Lee",
          companyName: "Northstar Operations",
          email: "jordan@northstar.example",
          role: "business_owner",
          challenge: "We need to clarify ownership across a complex process.",
          onboardingCompleted: true,
        },
        session: {
          sessionId: "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e",
          createdAt: "2026-07-31T08:00:00.000Z",
          updatedAt: "2026-07-31T08:00:00.000Z",
          status: "active",
          hydrationStatus: "ready",
        },
      }),
    );

    renderWorkspace();

    expect(
      await screen.findByRole("heading", {
        name: "Your context is ready, Jordan.",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();
  });
});
