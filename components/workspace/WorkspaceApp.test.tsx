import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { WORKSPACE_STORAGE_KEY } from "@/store/persistence";
import { WorkspaceApp } from "./WorkspaceApp";

function createChatResponse(
  reply = "Thanks — that gives us a useful starting point. What happens immediately before and after this part of the workflow?",
) {
  return new Response(
    JSON.stringify({
      success: true,
      type: "chat_response",
      reply,
      sessionId: "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e",
      brief: {
        primaryChallenge: "A workflow handoff needs clarification.",
      },
    }),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    },
  );
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(createChatResponse()));
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
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

function seedActiveWorkspace() {
  seedCompletedWorkspace();
  const saved = JSON.parse(
    window.localStorage.getItem(WORKSPACE_STORAGE_KEY) ?? "{}",
  );

  window.localStorage.setItem(
    WORKSPACE_STORAGE_KEY,
    JSON.stringify({
      ...saved,
      workspace: {
        mode: "active",
        discoveryStage: "requirements",
      },
      conversation: {
        draft: "",
        messages: [
          {
            id: "e5c6f233-10fb-430f-856f-20d0c241dba4",
            sender: "user",
            content: "Our reporting handoffs are unclear.",
            createdAt: "2026-07-31T08:01:00.000Z",
            status: "sent",
          },
          {
            id: "7de3120e-df82-4e38-8fb6-f4eff18a802c",
            sender: "assistant",
            content: "Which handoff causes the most delay?",
            createdAt: "2026-07-31T08:01:01.000Z",
            status: "sent",
          },
        ],
        requestStatus: "idle",
        pendingRequestId: null,
        failedRequest: null,
      },
      brief: {
        status: "current",
        businessContext: {
          value: "Northstar coordinates a complex reporting process.",
          status: "complete",
        },
        primaryChallenge: {
          value: "Reporting ownership is unclear.",
          status: "complete",
        },
        currentWorkflow: {
          value: ["Reports move between operations and finance."],
          status: "complete",
        },
        requirements: {
          value: ["Clarify ownership at each handoff."],
          status: "current",
        },
        recommendedDirection: { value: null, status: "pending" },
        openQuestions: {
          value: ["Who approves the final report?"],
          status: "complete",
        },
        nextStep: { value: null, status: "pending" },
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

  it(
    "stores normalized onboarding data and shows the workspace empty state",
    async () => {
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
        expect(
          window.localStorage.getItem(WORKSPACE_STORAGE_KEY),
        ).not.toBeNull();
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
    },
    15_000,
  );

  it("restores a valid completed onboarding session", async () => {
    seedCompletedWorkspace();

    renderWorkspace();

    expect(
      await screen.findByRole("heading", {
        name: "Start your discovery conversation",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Northstar Operations")).toBeInTheDocument();
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

  it("populates the composer and stores API-driven conversation messages", async () => {
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
      await screen.findByText(
        "Thanks — that gives us a useful starting point. What happens immediately before and after this part of the workflow?",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(
        "Where is our current process slowing down? Please focus on handoffs.",
      ),
    ).toHaveLength(1);
    const apiRequest = vi.mocked(fetch).mock.calls[0][0] as Request;
    expect(new URL(apiRequest.url).pathname).toBe("/api/chat");
    await expect(apiRequest.clone().json()).resolves.toMatchObject({
      message:
        "Where is our current process slowing down? Please focus on handoffs.",
      sessionId: "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e",
      name: "Jordan Lee",
      email: "jordan@northstar.example",
      companyName: "Northstar Operations",
      role: "business_owner",
      initialChallenge:
        "We need to clarify ownership across a complex process.",
    });

    await waitFor(() => {
      const saved = JSON.parse(
        window.localStorage.getItem(WORKSPACE_STORAGE_KEY) ?? "{}",
      );
      expect(saved.workspace.mode).toBe("active");
      expect(saved.conversation.messages).toHaveLength(2);
      expect(saved.conversation.messages[0].content).toBe(
        "Where is our current process slowing down? Please focus on handoffs.",
      );
      expect(saved.conversation.messages[1].sender).toBe("assistant");
    });
  });

  it("preserves a failed draft and retries through the API integration", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("temporary failure"))
      .mockResolvedValueOnce(
        createChatResponse(
          "Thanks. What part of that workflow should we examine first?",
        ),
      );
    vi.stubGlobal("fetch", fetchMock);
    seedCompletedWorkspace();
    renderWorkspace();

    const composer = await screen.findByRole("textbox", { name: "Message" });
    await user.type(composer, "Our handoffs are unclear.");
    await user.click(
      screen.getByRole("button", { name: "Submit discovery message" }),
    );

    expect(
      await screen.findByText("We couldn't continue the discovery."),
    ).toBeInTheDocument();
    expect(composer).toHaveValue("Our handoffs are unclear.");

    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(
      await screen.findByText(
        "Thanks. What part of that workflow should we examine first?",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("We couldn't continue the discovery."),
    ).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("requires confirmation and shows success only for explicit sent status", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            httpStatus: 200,
            success: true,
            type: "email_confirmation",
            reply: "Your Opportunity Brief has been sent to your email.",
            sessionId: "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e",
            action: "email_brief",
            emailStatus: "sent",
            emailMessage: "The Opportunity Brief was emailed successfully.",
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        ),
      ),
    );
    seedActiveWorkspace();
    renderWorkspace();

    const emailButton = await screen.findByRole("button", {
      name: "Email Brief",
    });
    await user.click(emailButton);

    expect(
      screen.getByRole("dialog", { name: "Email this Opportunity Brief?" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/jor.*@northstar\.example/)).toBeInTheDocument();
    expect(
      screen.queryByText("jordan@northstar.example"),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
    expect(fetch).not.toHaveBeenCalled();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(emailButton).toHaveFocus();
    await user.click(emailButton);
    await user.click(
      screen.getByRole("button", { name: "Confirm email brief" }),
    );

    expect(
      await screen.findByText("Your brief has been sent."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Our reporting handoffs are unclear."),
    ).toBeInTheDocument();
    expect(emailButton).toBeDisabled();

    const request = vi.mocked(fetch).mock.calls[0][0] as Request;
    await expect(request.clone().json()).resolves.toMatchObject({
      action: "email_brief",
      userName: "Jordan Lee",
      userEmail: "jordan@northstar.example",
      message:
        "Send me a structured summary of our conversation by email.",
      brief: {
        businessContext: "Northstar coordinates a complex reporting process.",
        primaryChallenge: "Reporting ownership is unclear.",
        currentWorkflow: ["Reports move between operations and finance."],
        requirements: ["Clarify ownership at each handoff."],
        recommendedDirection: null,
        openQuestions: ["Who approves the final report?"],
        nextStep: null,
      },
    });
    await expect(request.clone().json()).resolves.not.toHaveProperty("name");
    await expect(request.clone().json()).resolves.not.toHaveProperty("email");
  });

  it("shows a failure when delivery is not explicitly confirmed", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: true,
            type: "chat_response",
            reply: "The request was processed.",
            sessionId: "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e",
            action: "email_brief",
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        ),
      ),
    );
    seedActiveWorkspace();
    renderWorkspace();

    await user.click(
      await screen.findByRole("button", { name: "Email Brief" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Confirm email brief" }),
    );

    expect(
      await screen.findByText("The brief could not be emailed."),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Your brief has been sent."),
    ).not.toBeInTheDocument();
  });

  it("preserves the workspace and retries a failed email request", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            httpStatus: 502,
            success: false,
            type: "service_error",
            reply: "The brief could not be emailed. Please try again.",
            sessionId: "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e",
            action: "email_brief",
            emailStatus: "failed",
            emailMessage: "The Opportunity Brief could not be emailed.",
          }),
          { status: 502, headers: { "content-type": "application/json" } },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            httpStatus: 200,
            success: true,
            type: "email_confirmation",
            reply: "Your Opportunity Brief has been sent to your email.",
            sessionId: "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e",
            action: "email_brief",
            emailStatus: "sent",
            emailMessage: "The Opportunity Brief was emailed successfully.",
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);
    seedActiveWorkspace();
    renderWorkspace();

    await user.click(
      await screen.findByRole("button", { name: "Email Brief" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Confirm email brief" }),
    );

    expect(
      await screen.findByText("The brief could not be emailed."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Which handoff causes the most delay?"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(
      await screen.findByText("Your brief has been sent."),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
