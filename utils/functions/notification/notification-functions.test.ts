import { describe, expect, it } from "vitest";
import { INotification } from "@/utils/interfaces/notification/notification.interface";
import {
  parseSenderNameFromMessage,
  parseSenderNameFromTitle,
  resolveAvatarUrl,
  resolveNotificationUser,
} from "./resolve-notification-user";

const notification = (over: Partial<INotification> = {}): INotification => ({
  id: "n1",
  title: "New Message!",
  message: "Hello sir",
  type: "chat",
  data: null,
  isRead: false,
  createdAt: "2026-08-24T00:00:00.000Z",
  updatedAt: "2026-08-24T00:00:00.000Z",
  ...over,
});

describe("resolveNotificationUser", () => {
  it("prefers the sender written onto data", () => {
    const user = resolveNotificationUser(
      notification({
        data: { senderName: "Sok Dara", senderAvatar: "/uploads/a.png" },
      }),
      "employee",
    );

    expect(user.name).toBe("Sok Dara");
    expect(user.avatar).toBe("/uploads/a.png");
  });

  it("recovers a chat sender from the title when data has none", () => {
    // The regression: chat notifications carried no senderName, and a chat
    // message body is the message preview, so there was nothing to parse out of
    // it either. The card rendered an empty name, empty initials, and a
    // description that began at the dash — "— Hello sir".
    const user = resolveNotificationUser(
      notification({ title: "Sok Dara", data: { senderId: "u1" } }),
      "employee",
    );

    expect(user.name).toBe("Sok Dara");
  });

  it("does not pass off the API's placeholder title as a name", () => {
    const user = resolveNotificationUser(
      notification({ title: "New message", data: { senderId: "u1" } }),
      "employee",
    );

    expect(user.name).toBe("");
  });

  it("treats the placeholder avatar path as no avatar", () => {
    // Nothing serves /avatars/default.png, so letting it through guaranteed a
    // broken image where initials should have been.
    const user = resolveNotificationUser(
      notification({
        data: { senderName: "Sok Dara", senderAvatar: "/avatars/default.png" },
      }),
      "employee",
    );

    expect(user.avatar).toBeUndefined();
  });

  it("falls through an empty-string avatar, which `??` would have kept", () => {
    expect(
      resolveAvatarUrl({ senderAvatar: "", avatar: "/uploads/b.png" }),
    ).toBe("/uploads/b.png");
    expect(resolveAvatarUrl({ senderAvatar: "" })).toBeUndefined();
    expect(resolveAvatarUrl(null)).toBeUndefined();
  });

  it("picks the counterparty id by the viewer's role", () => {
    const data = { companyId: "c1", employeeId: "e1" };

    expect(resolveNotificationUser(notification({ data }), "employee").id).toBe(
      "c1",
    );
    expect(resolveNotificationUser(notification({ data }), "company").id).toBe(
      "e1",
    );
  });
});

describe("parseSenderNameFromMessage", () => {
  it.each([
    ["like", "Sok Dara liked your profile", "Sok Dara"],
    ["match", "Sok Dara and you liked each other!", "Sok Dara"],
    ["match", "You and Sok Dara liked each other!", "Sok Dara"],
    ["interview", "Sok Dara wants to schedule an interview", "Sok Dara"],
  ])("recovers a name from a %s message", (type, message, expected) => {
    expect(parseSenderNameFromMessage(type, message)).toBe(expected);
  });

  it("recovers nothing from a chat message, which is a preview not a sentence", () => {
    expect(parseSenderNameFromMessage("chat", "Hello sir")).toBe("");
  });
});

describe("parseSenderNameFromTitle", () => {
  it("trims a real title and rejects the placeholder", () => {
    expect(parseSenderNameFromTitle("  Sok Dara  ")).toBe("Sok Dara");
    expect(parseSenderNameFromTitle("New message")).toBe("");
    expect(parseSenderNameFromTitle("")).toBe("");
  });
});
