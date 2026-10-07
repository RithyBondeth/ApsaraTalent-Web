"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import {
  accountDrafts,
  readDraftIdentity,
  startAccountDraft,
  writeDraftIdentity,
  saveDraftRecovery,
  clearDraftRecovery,
  type DraftIdentity,
} from "@/utils/functions/resume/account-drafts";
import {
  resumeDraftSchema,
  saveResumeDraft,
} from "@/utils/functions/resume/resume-draft";

export function useAccountDraft(
  owner: string | undefined,
  content: IBuildResume,
  ready: boolean,
) {
  const [status, setStatus] = useState<
    "saving" | "saved" | "offline" | "conflict"
  >("saving");
  const [recoveryAvailable, setRecoveryAvailable] = useState(true);
  const state = useMemo(
    () => ({
      owner,
      running: false,
      pending: false,
      blocked: false,
      active: true,
    }),
    [owner],
  );
  const latest = useRef(content);
  latest.current = content;
  const backup = useCallback(
    (identity: DraftIdentity, snapshot: IBuildResume) => {
      if (!owner) return;
      writeDraftIdentity(owner, { ...identity, dirty: true });
      try {
        saveResumeDraft(owner, snapshot);
        saveDraftRecovery(owner, identity, snapshot);
        setRecoveryAvailable(true);
      } catch {
        setRecoveryAvailable(false);
      }
    },
    [owner],
  );
  const persist = useCallback(async () => {
    if (!owner || !ready || state.blocked) return;
    state.pending = true;
    if (state.running) return;
    state.running = true;
    try {
      while (state.pending && state.active && !state.blocked) {
        state.pending = false;
        const parsed = resumeDraftSchema.safeParse(latest.current);
        if (!parsed.success) {
          setStatus("offline");
          break;
        }
        const snapshot = parsed.data as IBuildResume;
        const captured = JSON.stringify(latest.current);
        const identity = readDraftIdentity(owner) ?? startAccountDraft(owner);
        backup(identity, snapshot);
        setStatus("saving");
        const record = await accountDrafts.save(identity, snapshot);
        // Keep the recovery marked dirty if new edits arrived during the request.
        const dirty = JSON.stringify(latest.current) !== captured;
        writeDraftIdentity(owner, {
          id: record.id,
          name: record.name,
          revision: record.revision,
          dirty,
        });
        if (!dirty) {
          try {
            clearDraftRecovery(owner, identity.id);
          } catch {
            // The cloud revision is already committed; keep its saved status.
          }
        }
        if (dirty) state.pending = true;
        if (state.active) setStatus(dirty ? "saving" : "saved");
      }
    } catch (error) {
      const code = (error as { response?: { status?: number } }).response
        ?.status;
      state.blocked = code === 409 || code === 404;
      if (state.active) setStatus(state.blocked ? "conflict" : "offline");
    } finally {
      state.running = false;
    }
  }, [owner, ready, state, backup]);
  useEffect(() => {
    state.active = true;
    return () => {
      state.active = false;
    };
  }, [state]);
  useEffect(() => {
    if (!owner || !ready) return;
    const identity = readDraftIdentity(owner) ?? startAccountDraft(owner);
    backup(identity, content);
    const timer = setTimeout(() => void persist(), 900);
    return () => clearTimeout(timer);
  }, [content, owner, ready, persist, backup]);
  useEffect(() => {
    const retry = () => void persist();
    window.addEventListener("online", retry);
    return () => window.removeEventListener("online", retry);
  }, [persist]);
  const saveAsNew = useCallback(() => {
    if (!owner || state.running) return;
    startAccountDraft(owner);
    state.blocked = false;
    void persist();
  }, [owner, persist, state]);
  return { status, recoveryAvailable, retry: persist, saveAsNew };
}
