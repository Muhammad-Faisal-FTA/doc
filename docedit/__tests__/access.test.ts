import { canView, canEdit } from "@/lib/access";
import type { AccessCheckable } from "@/types";

describe("lib/access", () => {
  const doc: AccessCheckable = {
    ownerId: "user-alice",
    sharedWith: ["user-bob"],
  };

  describe("canView", () => {
    it("returns true for the owner", () => {
      expect(canView(doc, "user-alice")).toBe(true);
    });

    it("returns true for a user in sharedWith", () => {
      expect(canView(doc, "user-bob")).toBe(true);
    });

    it("returns false for an unrelated user", () => {
      expect(canView(doc, "user-carol")).toBe(false);
    });

    it("returns false for an empty userId", () => {
      expect(canView(doc, "")).toBe(false);
    });
  });

  describe("canEdit", () => {
    it("returns true for the owner", () => {
      expect(canEdit(doc, "user-alice")).toBe(true);
    });

    it("returns false for a shared (read-only) viewer", () => {
      expect(canEdit(doc, "user-bob")).toBe(false);
    });

    it("returns false for an unrelated user", () => {
      expect(canEdit(doc, "user-carol")).toBe(false);
    });

    it("returns false for an empty userId", () => {
      expect(canEdit(doc, "")).toBe(false);
    });
  });

  it("treats an owner with an empty sharedWith list correctly", () => {
    const soloDoc: AccessCheckable = { ownerId: "user-alice", sharedWith: [] };
    expect(canView(soloDoc, "user-alice")).toBe(true);
    expect(canEdit(soloDoc, "user-alice")).toBe(true);
    expect(canView(soloDoc, "user-bob")).toBe(false);
  });
});
