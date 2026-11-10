import type { components } from "@/utils/interfaces/generated/api";
import axios from "@/lib/axios";
import { GatewayApi } from "@/lib/generated/gateway-api";
import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import { resumeDraftSchema, saveResumeDraft } from "./resume-draft";

export type ResumeDraftSummary = components["schemas"]["ResumeDraftSummaryDTO"];
export type AccountResumeDraft = Omit<
  components["schemas"]["ResumeDraftRecordDTO"],
  "content"
> & { content: IBuildResume };
export type DraftIdentity = {
  id: string;
  name: string;
  revision: number | null;
  dirty: boolean;
};
const api = new GatewayApi(axios);
const key = (owner: string) => `resume.account.${owner}`;
// Preserve the revision in memory when browser storage is full or disabled.
const identities = new Map<string, DraftIdentity>();
const unavailableStorage = new Set<string>();
const recoveryKey = (owner: string, id: string) =>
  `resume.recovery.${owner}.${id}`;
export type DraftRecovery = DraftIdentity & { content: IBuildResume };
export function saveDraftRecovery(
  owner: string,
  identity: DraftIdentity,
  content: IBuildResume,
) {
  sessionStorage.setItem(
    recoveryKey(owner, identity.id),
    JSON.stringify({ ...identity, dirty: true, content }),
  );
}
export function clearDraftRecovery(owner: string, id: string) {
  sessionStorage.removeItem(recoveryKey(owner, id));
}
export function loadDraftRecoveries(owner: string): DraftRecovery[] {
  const records: DraftRecovery[] = [];
  for (let index = 0; index < sessionStorage.length; index++) {
    const storageKey = sessionStorage.key(index);
    if (!storageKey?.startsWith(`resume.recovery.${owner}.`)) continue;
    try {
      const record = JSON.parse(sessionStorage.getItem(storageKey)!);
      if (
        typeof record.id === "string" &&
        typeof record.name === "string" &&
        (record.revision === null ||
          (Number.isInteger(record.revision) && record.revision > 0))
      ) {
        const parsed = resumeDraftSchema.safeParse(record.content);
        if (parsed.success)
          records.push({ ...record, content: parsed.data, dirty: true });
      }
    } catch {
      /* Corrupt recovery is never sent to the server. */
    }
  }
  return records;
}
export function readDraftIdentity(owner: string): DraftIdentity | null {
  if (unavailableStorage.has(owner)) return identities.get(owner) ?? null;
  try {
    const data = JSON.parse(sessionStorage.getItem(key(owner)) ?? "null");
    if (
      !data ||
      typeof data.id !== "string" ||
      typeof data.name !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(data.id) ||
      !(
        data.revision === null ||
        (Number.isInteger(data.revision) && data.revision > 0)
      )
    )
      return null;
    return data;
  } catch {
    return identities.get(owner) ?? null;
  }
}
export function writeDraftIdentity(owner: string, identity: DraftIdentity) {
  const metadata = {
    id: identity.id,
    name: identity.name,
    revision: identity.revision,
    dirty: identity.dirty,
  };
  identities.set(owner, metadata);
  try {
    sessionStorage.setItem(key(owner), JSON.stringify(metadata));
    unavailableStorage.delete(owner);
  } catch {
    // Account saving can continue with the in-memory revision.
    unavailableStorage.add(owner);
  }
}
export function startAccountDraft(owner: string, name = "My resume") {
  const identity = {
    id: crypto.randomUUID(),
    name,
    revision: null,
    dirty: true,
  };
  writeDraftIdentity(owner, identity);
  return identity;
}
export function selectAccountDraft(owner: string, record: AccountResumeDraft) {
  const parsed = resumeDraftSchema.parse(record.content) as IBuildResume;
  saveResumeDraft(owner, parsed);
  writeDraftIdentity(owner, {
    id: record.id,
    name: record.name,
    revision: record.revision,
    dirty: false,
  });
  return parsed;
}
export const accountDrafts = {
  async list() {
    return (await api.resumeDraftControllerList({})).data;
  },
  async read(id: string) {
    const record = (await api.resumeDraftControllerRead({ id })).data;
    return {
      ...record,
      content: resumeDraftSchema.parse(record.content) as IBuildResume,
    };
  },
  async save(identity: DraftIdentity, content: IBuildResume) {
    const body = {
      name: identity.name,
      content: resumeDraftSchema.parse(content),
    };
    const response =
      identity.revision === null
        ? await api.resumeDraftControllerCreate({
            body: { ...body, id: identity.id },
          })
        : await api.resumeDraftControllerUpdate({
            id: identity.id,
            body: { ...body, revision: identity.revision },
          });
    return {
      ...response.data,
      content: resumeDraftSchema.parse(response.data.content) as IBuildResume,
    };
  },
  async remove(id: string) {
    await api.resumeDraftControllerRemove({ id });
  },
};
