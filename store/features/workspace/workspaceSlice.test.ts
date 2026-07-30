import { describe, expect, it } from "vitest";
import {
  initialWorkspaceState,
  setWorkspaceMode,
  workspaceReducer,
} from "./workspaceSlice";

describe("workspaceSlice", () => {
  it("transitions the local workspace into the initiated mode", () => {
    expect(
      workspaceReducer(initialWorkspaceState, setWorkspaceMode("initiated")),
    ).toEqual({
      mode: "initiated",
      discoveryStage: "challenge",
    });
  });
});
