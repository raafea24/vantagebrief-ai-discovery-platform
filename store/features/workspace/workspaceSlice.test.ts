import { describe, expect, it } from "vitest";
import {
  initialWorkspaceState,
  setWorkspaceMode,
  workspaceReducer,
} from "./workspaceSlice";

describe("workspaceSlice", () => {
  it("transitions the local workspace into active mode", () => {
    expect(
      workspaceReducer(initialWorkspaceState, setWorkspaceMode("active")),
    ).toEqual({
      mode: "active",
      discoveryStage: "challenge",
    });
  });
});
