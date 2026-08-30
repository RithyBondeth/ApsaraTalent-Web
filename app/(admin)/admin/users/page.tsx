"use client";

import { AdminPagination } from "@/components/admin/admin-pagination";
import { StatusPill } from "@/components/admin/status-pill";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PageState } from "@/components/utils/feedback/page-state";
import { PageBanner } from "@/components/utils/layout/page-banner";
import { useAdminStore } from "@/stores/apis/admin/admin.store";
import { formatShortDate } from "@/utils/functions/date";
import type {
  TAdminUserQuery,
  TUserStatus,
} from "@/utils/types/admin/admin.type";
import type { TUserRole } from "@/utils/types/auth/role.type";
import { LucideFlag, LucideUsers, LucideUserX } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

const PAGE_SIZE = 25;
/** Long enough that a two-character typo does not fire a full-table scan. */
const SEARCH_DEBOUNCE_MS = 350;

export default function AdminUsersPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("admin.users");
  const tStatus = useTranslations("admin.status");

  /* ----------------------------- API Integration ---------------------------- */
  const { users, loadingUsers, error, getUsers } = useAdminStore();

  /* -------------------------------- All States ------------------------------ */
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<TUserRole | "all">("all");
  const [status, setStatus] = useState<TUserStatus | "all">("all");
  const [page, setPage] = useState(1);

  /* --------------------------------- Effects -------------------------------- */
  // Any filter change resets to page one: staying on page 4 of a list that now
  // has two pages shows an empty table and reads as a broken page.
  useEffect(() => {
    setPage(1);
  }, [search, role, status]);

  useEffect(() => {
    const query: TAdminUserQuery = {
      page,
      limit: PAGE_SIZE,
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(role !== "all" ? { role } : {}),
      ...(status !== "all" ? { status } : {}),
    };

    const timer = setTimeout(() => void getUsers(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [page, search, role, status, getUsers]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div className="flex flex-col gap-5">
      {/* Banner Section */}
      <PageBanner
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        stats={
          users
            ? [
                {
                  label: t("statTotal"),
                  value: users.total.toLocaleString(),
                  icon: LucideUsers,
                },
              ]
            : undefined
        }
      >
        {/* Filters Section */}
        <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
          <Input
            type="search"
            value={search}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select
            value={role}
            onValueChange={(value) => setRole(value as TUserRole | "all")}
          >
            <SelectTrigger className="sm:w-44" aria-label={t("filterRole")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allRoles")}</SelectItem>
              <SelectItem value="employee">{t("roleEmployee")}</SelectItem>
              <SelectItem value="company">{t("roleCompany")}</SelectItem>
              <SelectItem value="admin">{t("roleAdmin")}</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as TUserStatus | "all")}
          >
            <SelectTrigger className="sm:w-44" aria-label={t("filterStatus")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allStatuses")}</SelectItem>
              <SelectItem value="active">{tStatus("active")}</SelectItem>
              <SelectItem value="suspended">{tStatus("suspended")}</SelectItem>
              <SelectItem value="banned">{tStatus("banned")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PageBanner>

      {/* Results Section */}
      <section className="border border-border bg-card p-5 shadow-hard">
        {loadingUsers && !users ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </div>
        ) : error && !users ? (
          <PageState variant="error" title={error} compact />
        ) : users && users.items.length === 0 ? (
          <PageState
            variant="empty"
            title={t("emptyTitle")}
            description={t("emptyDescription")}
            icon={LucideUserX}
            compact
          />
        ) : (
          <>
            {/* The table scrolls inside itself; the page never scrolls sideways. */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    <th className="py-3 pr-4 font-bold">{t("colUser")}</th>
                    <th className="py-3 pr-4 font-bold">{t("colRole")}</th>
                    <th className="py-3 pr-4 font-bold">{t("colStatus")}</th>
                    <th className="py-3 pr-4 font-bold">{t("colReports")}</th>
                    <th className="py-3 pr-4 font-bold">{t("colJoined")}</th>
                    <th className="py-3 font-bold">{t("colLastSeen")}</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border last:border-b-0 hover:bg-accent/40"
                    >
                      <td className="py-3 pr-4">
                        <Link
                          href={`/admin/users/${item.id}`}
                          className="font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {item.email ?? item.phone ?? "—"}
                        </p>
                      </td>
                      <td className="py-3 pr-4 text-xs uppercase tracking-[0.08em] text-muted-foreground">
                        {item.role}
                      </td>
                      <td className="py-3 pr-4">
                        <StatusPill
                          status={item.status}
                          label={tStatus(item.status)}
                        />
                      </td>
                      <td className="py-3 pr-4">
                        {item.openReportCount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold tabular-nums text-destructive">
                            <LucideFlag aria-hidden className="size-3" />
                            {item.openReportCount}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-xs tabular-nums text-muted-foreground">
                        {formatShortDate(item.createdAt)}
                      </td>
                      <td className="py-3 text-xs tabular-nums text-muted-foreground">
                        {item.lastLoginAt
                          ? formatShortDate(item.lastLoginAt)
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users ? (
              <AdminPagination
                page={users.page}
                limit={users.limit}
                total={users.total}
                busy={loadingUsers}
                onPageChange={setPage}
              />
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
