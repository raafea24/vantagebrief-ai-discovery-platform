import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { WORKSPACE_STORAGE_KEY } from "@/store/persistence";
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

function seedCompletedWorkspace() {
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

  it("stores normalized onboarding data and shows the workspace empty state", async () => {
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
        name: "Start your discovery conversation",
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
    seedCompletedWorkspace();

    renderWorkspace();

    expect(
      await screen.findByRole("heading", {
        name: "Start your discovery conversation",
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Northstar Operations")).toHaveLength(2);
    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();
  });

  it("returns to a prefilled onboarding form for business detail edits", async () => {
    const user = userEvent.setup();
    seedCompletedWorkspace();
    renderWorkspace();

    await screen.findByRole("heading", {
      name: "Start your discovery conversation",
    });
    await user.click(
      screen.getByRole("button", { name: "Edit business details" }),
    );

    expect(await screen.findByLabelText("Name")).toHaveValue("Jordan Lee");
    expect(screen.getByLabelText("Business or company name")).toHaveValue(
      "Northstar Operations",
    );
    expect(screen.getByLabelText("Work email")).toHaveValue(
      "jordan@northstar.example",
    );
    expect(screen.getByLabelText("Role")).toHaveValue("business_owner");

    await user.click(
      screen.getByRole("button", { name: "Continue to Workspace" }),
    );
    await screen.findByRole("heading", {
      name: "Start your discovery conversation",
    });

    await waitFor(() => {
      const saved = JSON.parse(
        window.localStorage.getItem(WORKSPACE_STORAGE_KEY) ?? "{}",
      );
      expect(saved.session.sessionId).toBe(
        "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e",
      );
    });
  });

  it("places a quick prompt in the composer and stores only the first message", async () => {
    const user = userEvent.setup();
    seedCompletedWorkspace();
    renderWorkspace();

    const prompt = await screen.findByRole("button", {
      name: "Where is our current process slowing down?",
    });
    await user.click(prompt);

    const composer = screen.getByLabelText("Message");
    expect(composer).toHaveValue("Where is our current process slowing down?");

    await user.type(composer, " Please focus on handoffs.");
    await user.click(
      screen.getByRole("button", { name: "Submit discovery message" }),
    );

    expect(
      await screen.findByRole("heading", {
        name: "Your first context is in place.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Where is our current process slowing down? Please focus on handoffs.",
      ),
    ).toBeInTheDocument();

    await waitFor(() => {
      const saved = JSON.parse(
        window.localStorage.getItem(WORKSPACE_STORAGE_KEY) ?? "{}",
      );
      expect(saved.workspace.mode).toBe("initiated");
      expect(saved.conversation.firstMessage.content).toBe(
        "Where is our current process slowing down? Please focus on handoffs.",
      );
    });
  });
});
