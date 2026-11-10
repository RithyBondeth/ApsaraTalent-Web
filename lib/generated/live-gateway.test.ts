// @vitest-environment node
import { describe, it, expect } from "vitest";
import axios from "axios";
import { GatewayApi } from "./gateway-api";
const base = process.env.E2E_API_URL;
describe.skipIf(!base)(
  "generated TypeScript client against the real gateway",
  () => {
    it("preserves the shared draft document and revision", async () => {
      const url = new URL(base!);
      expect(url.hostname).toBe("127.0.0.1");
      expect(url.port).toBe("13000");
      const api = new GatewayApi(
        axios.create({
          headers: { Authorization: `Bearer ${process.env.E2E_ACCESS_TOKEN}` },
        }),
      );
      const id = process.env.E2E_DRAFT_ID!;
      const response = await api.resumeDraftControllerRead({ id });
      const draft = response.data;
      expect(draft.id).toBe(id);
      expect(draft.content.summary).toBe("Mobile edit");
      const updated = await api.resumeDraftControllerUpdate({
        id,
        body: {
          name: draft.name,
          revision: draft.revision,
          content: {
            ...draft.content,
            summary: "TypeScript generated client edit",
          },
        },
      });
      expect(updated.data.revision).toBe(draft.revision + 1);
      expect(updated.data.content.design).toEqual(draft.content.design);
      // Leave a recognizable value for the following mobile client check.
      await api.resumeDraftControllerUpdate({
        id,
        body: {
          name: draft.name,
          revision: updated.data.revision,
          content: draft.content,
        },
      });
    });
  },
);
