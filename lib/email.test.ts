import { describe, expect, it } from "vitest";
import { maskEmail } from "./email";

describe("maskEmail", () => {
  it("masks long and short local parts without changing the domain", () => {
    expect(maskEmail("alex.morgan@example.com")).toBe(
      "ale••••••••@example.com",
    );
    expect(maskEmail("a@example.com")).toBe("a••@example.com");
  });

  it("returns a safe label for invalid input", () => {
    expect(maskEmail("not-an-email")).toBe("your validated email");
  });
});
