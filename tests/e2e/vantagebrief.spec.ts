import { expect, test, type Page, type Route } from "@playwright/test";

const viewports = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1280", width: 1280, height: 800 },
  { name: "tablet-1024", width: 1024, height: 768 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-360", width: 360, height: 800 },
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    )
    .toBe(true);
}

async function completeOnboarding(page: Page) {
  await page.getByLabel("Name", { exact: true }).fill("Jordan Lee");
  await page.getByLabel("Business or company name").fill("Northstar Operations");
  await page.getByLabel("Work email").fill("jordan@northstar.example");
  await page.getByLabel("Role").selectOption("operations");
  await page
    .getByLabel("Initial business challenge or opportunity")
    .fill("We need to clarify ownership across a complex reporting process.");
  await page.getByRole("button", { name: "Continue to Workspace" }).click();
}

async function fulfillJson(route: Route, payload: object, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(payload),
  });
}

test.describe("responsive product shell", () => {
  for (const viewport of viewports) {
    test(`${viewport.name} has usable landing and onboarding layouts`, async ({ page }) => {
      const browserErrors: string[] = [];
      page.on("pageerror", (error) => browserErrors.push(error.message));
      await page.setViewportSize(viewport);
      await page.goto("/");

      await expect(
        page.getByRole("heading", {
          name: "Turn business conversations into decision-ready briefs.",
        }),
      ).toBeVisible();
      await expectNoHorizontalOverflow(page);

      await page.goto("/workspace");
      await page.waitForTimeout(500);
      expect(browserErrors).toEqual([]);
      await expect(
        page.getByRole("heading", { name: "Let's understand your business first." }),
      ).toBeVisible();
      await expectNoHorizontalOverflow(page);
    });
  }
});

test("mobile navigation is keyboard-accessible and closes after navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const menuButton = page.getByRole("button", { name: "Open navigation" });
  await menuButton.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();

  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", {
    name: "How It Works",
  }).click();
  await expect(page).toHaveURL(/#how-it-works$/);
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeHidden();
});

test("discovery completes, restores the brief hash and confirms explicit email delivery", async ({
  page,
}) => {
  const sessionId = "3c0f66cf-8b0a-46a7-9dc2-89c6fc735b6e";
  const requests: Array<Record<string, unknown>> = [];

  await page.route("**/api/chat", async (route) => {
    const body = route.request().postDataJSON() as Record<string, unknown>;
    requests.push(body);

    if (body.action === "email_brief") {
      await fulfillJson(route, {
        success: true,
        type: "email_confirmation",
        reply: "Your Opportunity Brief has been sent to your email.",
        sessionId,
        action: "email_brief",
        emailStatus: "sent",
        emailMessage: "The Opportunity Brief was emailed successfully.",
      });
      return;
    }

    await fulfillJson(route, {
      success: true,
      type: "chat_response",
      reply: "The discovery is complete. Your brief is ready for review.",
      sessionId,
      action: "chat",
      brief: {
        businessContext: "Northstar coordinates a cross-functional reporting process.",
        primaryChallenge: "Reporting ownership is unclear across team handoffs.",
        currentWorkflow: ["Operations prepares reports before finance approval."],
        requirements: ["Define one accountable owner for every handoff."],
        recommendedDirection: "Create a documented ownership and approval workflow.",
        openQuestions: ["Who approves exceptions to the standard workflow?"],
        nextStep: "Review the proposed ownership model with operations and finance.",
      },
    });
  });

  await page.goto("/workspace");
  await completeOnboarding(page);
  await expect(page).toHaveURL(/\/workspace#discovery-panel$/);
  await expect(page.getByText(/Thanks, Jordan\./)).toBeVisible();

  await page
    .getByRole("textbox", { name: "Message", exact: true })
    .fill("Map our reporting workflow and ownership.");
  await page.getByRole("button", { name: "Submit discovery message" }).click();

  await expect(page.getByText("Discovery complete")).toBeVisible();
  await expect(page.getByText("Brief ready")).toBeVisible();
  await expect(page).toHaveURL(/\/workspace#brief-panel$/);
  await expect(page.getByText(/Your Opportunity Brief is ready for review/)).toBeVisible();

  const emailButton = page.getByRole("button", { name: "Email Brief" });
  await emailButton.click();
  const dialog = page.getByRole("dialog", { name: "Email this Opportunity Brief?" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Cancel" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(emailButton).toBeFocused();

  await emailButton.click();
  await dialog.getByRole("button", { name: "Confirm email brief" }).click();
  await expect(page.getByText("Opportunity Brief sent")).toBeVisible();
  await expect(page.getByRole("button", { name: "Brief emailed" })).toBeDisabled();
  await expect(page).toHaveURL(/\/workspace#brief-panel$/);

  expect(requests).toHaveLength(2);
  expect(requests[0]).toMatchObject({
    action: "chat",
    message: "Map our reporting workflow and ownership.",
  });
  expect(requests[0].sessionId).toEqual(expect.any(String));
  expect(requests[1]).toMatchObject({
    action: "email_brief",
    userEmail: "jordan@northstar.example",
    sessionId: requests[0].sessionId,
  });
  expect(JSON.stringify(requests)).not.toContain("N8N_WEBHOOK");

  await page
    .getByRole("textbox", { name: "Message", exact: true })
    .fill("Orders arrive through email, WhatsApp and phone calls.");
  await page.getByRole("button", { name: "Submit discovery message" }).click();
  await expect.poll(() => requests.length).toBe(3);
  expect(requests[2]).toMatchObject({
    action: "chat",
    message: "Orders arrive through email, WhatsApp and phone calls.",
  });

  await page.reload();
  await expect(page).toHaveURL(/\/workspace#brief-panel$/);
  await expect(page.getByText("Opportunity Brief sent")).toBeVisible();
  await page
    .getByRole("textbox", { name: "Message", exact: true })
    .fill("Continue the discovery after restoring this session.");
  await page.getByRole("button", { name: "Submit discovery message" }).click();
  await expect.poll(() => requests.length).toBe(4);
  expect(requests[3]).toMatchObject({
    action: "chat",
    message: "Continue the discovery after restoring this session.",
  });
});

test("failed discovery retry remains chat-only and does not duplicate the message", async ({
  page,
}) => {
  const sessionId = "7d3ea5ad-acde-4c47-9d83-67099ac36cf7";
  const requests: Array<Record<string, unknown>> = [];

  await page.route("**/api/chat", async (route) => {
    const body = route.request().postDataJSON() as Record<string, unknown>;
    requests.push(body);

    if (requests.length === 1) {
      await fulfillJson(
        route,
        {
          error: {
            code: "SERVICE_UNAVAILABLE",
            message:
              "The discovery service is temporarily unavailable. Please try again shortly.",
            retryable: true,
          },
        },
        503,
      );
      return;
    }

    await fulfillJson(route, {
      success: true,
      type: "chat_response",
      reply: "Which coordination step causes the longest delay?",
      sessionId,
      action: "chat",
    });
  });

  await page.goto("/workspace");
  await completeOnboarding(page);
  const message = "Manual coordination is delaying customer orders.";
  await page.getByRole("textbox", { name: "Message", exact: true }).fill(message);
  await page.getByRole("button", { name: "Submit discovery message" }).click();

  await expect(page.getByText("We couldn't continue the discovery.")).toBeVisible();
  await expect(page.getByText("Not sent")).toBeVisible();
  await page.getByRole("button", { name: "Retry" }).click();

  await expect(
    page.getByText("Which coordination step causes the longest delay?"),
  ).toBeVisible();
  await expect(page.getByText("Not sent")).toBeHidden();
  await expect(page.getByText(message)).toHaveCount(1);
  expect(requests).toHaveLength(2);
  expect(requests[0]).toMatchObject({ action: "chat", message });
  expect(requests[1]).toMatchObject({ action: "chat", message });
  expect(requests.some((request) => request.action === "email_brief")).toBe(
    false,
  );
});

test("unconfirmed email delivery shows failure and permits a real retry", async ({ page }) => {
  const sessionId = "5d864497-0845-4e5c-a31e-26d037930c2d";
  let emailAttempts = 0;

  await page.route("**/api/chat", async (route) => {
    const body = route.request().postDataJSON() as Record<string, unknown>;

    if (body.action === "email_brief") {
      emailAttempts += 1;
      await fulfillJson(
        route,
        emailAttempts === 1
          ? {
              success: true,
              type: "chat_response",
              reply: "The request was processed without delivery confirmation.",
              sessionId,
              action: "email_brief",
            }
          : {
              success: true,
              type: "email_confirmation",
              reply: "Your Opportunity Brief has been sent to your email.",
              sessionId,
              action: "email_brief",
              emailStatus: "sent",
              emailMessage: "The Opportunity Brief was emailed successfully.",
            },
      );
      return;
    }

    await fulfillJson(route, {
      success: true,
      type: "chat_response",
      reply: "Your brief is ready.",
      sessionId,
      brief: {
        businessContext: "Northstar coordinates operational reporting.",
        primaryChallenge: "Report ownership is unclear.",
        currentWorkflow: ["Operations prepares a weekly report."],
        requirements: ["Clarify ownership and approval timing."],
        recommendedDirection: "Document the reporting workflow.",
        nextStep: "Review the workflow with stakeholders.",
      },
    });
  });

  await page.goto("/workspace");
  await completeOnboarding(page);
  await page
    .getByRole("textbox", { name: "Message", exact: true })
    .fill("Prepare the opportunity brief.");
  await page.getByRole("button", { name: "Submit discovery message" }).click();
  await page.getByRole("button", { name: "Email Brief" }).click();
  await page.getByRole("button", { name: "Confirm email brief" }).click();

  await expect(page.getByText("The brief could not be emailed.")).toBeVisible();
  await expect(page.getByText("Opportunity Brief sent")).toBeHidden();
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(page.getByText("Opportunity Brief sent")).toBeVisible();
  expect(emailAttempts).toBe(2);
});
