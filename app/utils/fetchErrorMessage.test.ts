import { describe, expect, it } from "vitest";
import { fetchErrorMessage } from "./fetchErrorMessage";

describe("fetchErrorMessage", () => {
  it("returns the server's statusMessage from the response body", () => {
    expect(fetchErrorMessage({ data: { statusMessage: "Username already taken" } }, "fallback")).toBe(
      "Username already taken",
    );
  });

  it("falls back when the body has no usable statusMessage", () => {
    expect(fetchErrorMessage({ data: { statusMessage: "" } }, "fallback")).toBe("fallback");
    expect(fetchErrorMessage({ data: { statusMessage: 409 } }, "fallback")).toBe("fallback");
    expect(fetchErrorMessage({ data: undefined }, "fallback")).toBe("fallback");
  });

  it("falls back for errors that are not fetch errors", () => {
    expect(fetchErrorMessage(new Error("network down"), "fallback")).toBe("fallback");
    expect(fetchErrorMessage(null, "fallback")).toBe("fallback");
    expect(fetchErrorMessage(undefined, "fallback")).toBe("fallback");
  });
});
