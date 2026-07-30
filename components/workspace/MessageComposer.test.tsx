import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MessageComposer } from "./MessageComposer";

describe("MessageComposer", () => {
  it("submits with Enter and preserves a newline with Shift+Enter", () => {
    const onSubmit = vi.fn();

    render(
      <MessageComposer
        value="A valid discovery message"
        onChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    const composer = screen.getByRole("textbox", { name: "Message" });

    fireEvent.keyDown(composer, { key: "Enter", shiftKey: true });
    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.keyDown(composer, { key: "Enter" });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("keeps the send action disabled for an empty draft", () => {
    render(
      <MessageComposer value="   " onChange={vi.fn()} onSubmit={vi.fn()} />,
    );

    expect(
      screen.getByRole("button", { name: "Submit discovery message" }),
    ).toBeDisabled();
  });
});
