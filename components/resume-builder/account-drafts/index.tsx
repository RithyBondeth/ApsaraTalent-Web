"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  accountDrafts,
  selectAccountDraft,
  startAccountDraft,
  ResumeDraftSummary,
  loadDraftRecoveries,
  DraftRecovery,
  writeDraftIdentity,
  clearDraftRecovery,
} from "@/utils/functions/resume/account-drafts";
import { useResumeEditStore } from "@/stores/apis/resume/resume-edit.store";

export default function AccountDrafts({ owner }: { owner: string }) {
  const [records, setRecords] = useState<ResumeDraftSummary[]>([]);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [rename, setRename] = useState<{ id: string; name: string } | null>(
    null,
  );
  const [remove, setRemove] = useState<string | null>(null);
  const [recoveries, setRecoveries] = useState<DraftRecovery[]>([]);
  const router = useRouter();
  const t = useTranslations("resumeBuilder");
  const load = useCallback(async () => {
    setError(false);
    try {
      setRecords(await accountDrafts.list());
    } catch {
      setError(true);
    }
  }, []);
  useEffect(() => {
    setRecoveries(loadDraftRecoveries(owner));
    void load();
  }, [load, owner]);
  function openRecovery(record: DraftRecovery) {
    writeDraftIdentity(owner, record);
    useResumeEditStore.getState().setPayload(record.content, owner);
    router.push("/resume-builder/edit");
  }
  async function action(
    id: string,
    kind: "open" | "copy" | "rename" | "delete",
  ) {
    setBusy(id);
    setError(false);
    try {
      if (kind === "delete") {
        await accountDrafts.remove(id);
        setRemove(null);
        await load();
        return;
      }
      const record = await accountDrafts.read(id);
      if (kind === "rename") {
        await accountDrafts.save(
          { ...record, name: rename!.name.trim(), dirty: false },
          record.content,
        );
        setRename(null);
        await load();
        return;
      }
      const content = selectAccountDraft(owner, record);
      if (kind === "copy") {
        const identity = startAccountDraft(
          owner,
          `${record.name.slice(0, 110)} (copy)`,
        );
        const copy = await accountDrafts.save(identity, content);
        selectAccountDraft(owner, copy);
      }
      useResumeEditStore.getState().setPayload(content, owner);
      router.push("/resume-builder/edit");
    } catch {
      setError(true);
    } finally {
      setBusy(null);
    }
  }
  return (
    <section className="flex w-full flex-col gap-3 border border-border bg-card p-4">
      <h2 className="font-bold">{t("myResumes")}</h2>
      <p className="text-sm text-muted-foreground">
        {t("accountDraftDescription")}
      </p>
      {error && (
        <div role="alert">
          {t("draftActionFailed")}{" "}
          <Button variant="outline" onClick={() => void load()}>
            {t("retryDraft")}
          </Button>
        </div>
      )}
      {!error && records.length === 0 && <p>{t("noAccountDrafts")}</p>}
      {recoveries.length > 0 && (
        <div className="flex flex-col gap-2" role="status">
          <p>{t("localResumeEdits")}</p>
          {recoveries.map((record) => (
            <div key={record.id} className="flex flex-wrap items-center gap-2">
              <span className="mr-auto">{record.name}</span>
              <Button onClick={() => openRecovery(record)}>
                {t("resumeLocalEdits")}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (window.confirm(t("confirmDiscardLocal"))) {
                    clearDraftRecovery(owner, record.id);
                    setRecoveries(loadDraftRecoveries(owner));
                  }
                }}
              >
                {t("discardLocalEdits")}
              </Button>
            </div>
          ))}
        </div>
      )}
      {records.map((record) => (
        <div
          key={record.id}
          className="flex flex-wrap items-center gap-2 border-t border-border pt-3"
        >
          <span className="mr-auto font-medium">{record.name}</span>
          {rename?.id === record.id ? (
            <>
              <Input
                aria-label={t("resumeName")}
                maxLength={120}
                value={rename.name}
                onChange={(e) =>
                  setRename({ id: record.id, name: e.target.value })
                }
              />
              <Button
                disabled={!!busy || !rename.name.trim()}
                onClick={() => void action(record.id, "rename")}
              >
                {t("saveDraftName")}
              </Button>
              <Button variant="outline" onClick={() => setRename(null)}>
                {t("cancelDraftAction")}
              </Button>
            </>
          ) : remove === record.id ? (
            <>
              <span>{t("confirmDeleteDraft")}</span>
              <Button
                variant="destructive"
                disabled={!!busy}
                onClick={() => void action(record.id, "delete")}
              >
                {t("deleteDraft")}
              </Button>
              <Button variant="outline" onClick={() => setRemove(null)}>
                {t("cancelDraftAction")}
              </Button>
            </>
          ) : (
            <>
              <Button
                disabled={
                  !!busy || recoveries.some((local) => local.id === record.id)
                }
                onClick={() => void action(record.id, "open")}
              >
                {t("openDraft")}
              </Button>
              <Button
                variant="outline"
                disabled={!!busy}
                onClick={() => void action(record.id, "copy")}
              >
                {t("duplicateDraft")}
              </Button>
              <Button
                variant="outline"
                disabled={!!busy}
                onClick={() => setRename({ id: record.id, name: record.name })}
              >
                {t("renameDraft")}
              </Button>
              <Button
                variant="outline"
                disabled={!!busy}
                onClick={() => setRemove(record.id)}
              >
                {t("deleteDraft")}
              </Button>
            </>
          )}
        </div>
      ))}
    </section>
  );
}
