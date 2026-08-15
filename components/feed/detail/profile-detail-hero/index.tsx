"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DetailCard } from "@/components/utils/data-display/detail-card";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { IProfileDetailHeroProps } from "./props";

export function ProfileDetailHero(props: IProfileDetailHeroProps) {
  /* ------------------------------- Props ------------------------------- */
  const {
    kind,
    eyebrow,
    name,
    headline,
    avatar,
    cover,
    fallback,
    status,
    meta,
    actions,
    onAvatarClick,
  } = props;

  /* ------------------------------- Utils ------------------------------- */
  const profileAvatar = (
    <Avatar
      rounded="md"
      className={cn(
        "shrink-0 rounded-none border-[3px] border-card bg-card",
        avatar && onAvatarClick && "cursor-pointer",
      )}
      onClick={avatar && onAvatarClick ? onAvatarClick : undefined}
    >
      <AvatarImage src={avatar ?? ""} alt={name} className="object-cover" />
      <AvatarFallback className="bg-background text-xl font-medium uppercase text-foreground">
        {fallback ?? <User className="size-6" />}
      </AvatarFallback>
    </Avatar>
  );

  /* ----------------------------- Render UI ----------------------------- */
  if (kind === "employee") {
    return (
      <DetailCard className="profile-detail-employee-card overflow-hidden">
        {/* Employee Hero Card Section */}
        <div className="grid md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          {/* Employee Identity Panel Section */}
          <section className="profile-detail-employee-intro relative flex min-h-[300px] flex-col overflow-hidden bg-foreground p-5 text-background sm:min-h-[340px] sm:p-7 md:min-h-[410px]">
            {/* Animated Grid Background Section */}
            <div className="profile-detail-hero-grid" aria-hidden />

            {/* Employee Panel Header Section */}
            <div className="relative z-[2] flex items-start justify-between gap-4">
              <p className="pixel-label text-[10px] opacity-65">{eyebrow}</p>
              <span className="pixel-label border border-background/20 bg-background/10 px-2.5 py-1.5 text-[9px] opacity-75">
                Apsara Talent
              </span>
            </div>

            {/* Employee Identity Section */}
            <div className="relative z-[2] mt-auto flex items-end gap-4 tablet-sm:flex-col tablet-sm:items-start sm:gap-5">
              <div className="[&>span]:size-24 sm:[&>span]:size-28">
                {profileAvatar}
              </div>
              <div className="min-w-0 pb-1">
                <p className="pixel-label mb-2 text-[9px] opacity-55">
                  Apsara profile
                </p>
                <h1 className="text-3xl font-medium leading-[0.95] tracking-[-0.045em] sm:text-5xl">
                  {name}
                </h1>
              </div>
            </div>
          </section>

          {/* Employee Professional Focus Panel Section */}
          <section className="profile-detail-employee-focus relative flex min-h-[320px] flex-col overflow-hidden bg-card p-5 sm:min-h-[360px] sm:p-7 md:min-h-[410px]">
            {/* Decorative Index Section */}
            <div className="profile-detail-focus-index" aria-hidden>
              AT
            </div>
            {/* Employee Headline Section */}
            <div className="relative z-[1]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="pixel-label text-[10px] text-muted-foreground">
                  {eyebrow}
                </p>
                {status}
              </div>
              {headline && (
                <p className="mt-7 max-w-xl text-4xl font-medium leading-[0.95] tracking-[-0.05em] sm:text-6xl md:mt-10">
                  {headline}
                </p>
              )}
            </div>

            {/* Employee Metadata Section */}
            {meta && (
              <div className="profile-detail-meta profile-detail-meta-grid relative z-[1] mt-8 grid grid-cols-2 gap-px border border-border bg-border sm:mt-auto">
                {meta}
              </div>
            )}

            {/* Employee Actions Section */}
            {actions && (
              <div className="relative z-[1] mt-4 hidden items-center justify-end gap-2 md:flex [&>button]:rounded-none">
                {actions}
              </div>
            )}
          </section>
        </div>
      </DetailCard>
    );
  }

  return (
    <DetailCard className="profile-detail-company-card overflow-hidden">
      {/* Company Hero Card Section */}
      {/* Company Cover Section */}
      <section
        className={cn(
          "profile-detail-hero profile-detail-company-cover relative flex min-h-[300px] flex-col overflow-hidden bg-foreground p-5 sm:min-h-[360px] sm:p-8",
          cover && "profile-detail-hero-cover",
        )}
        style={cover ? { backgroundImage: `url(${cover})` } : undefined}
      >
        {/* Animated Grid Background Section */}
        <div className="profile-detail-hero-grid" aria-hidden />

        {/* Company Cover Header Section */}
        <div className="relative z-[2] flex items-start justify-between gap-4">
          <p className="pixel-label text-[10px] opacity-65">{eyebrow}</p>
          <span className="pixel-label profile-detail-hero-brand border px-3 py-2 text-[9px]">
            Apsara Talent
          </span>
        </div>

        {/* Company Identity Section */}
        <div className="relative z-[2] mt-auto max-w-4xl pb-10 sm:pb-0">
          {headline && (
            <p className="pixel-label mb-4 text-xs opacity-70">{headline}</p>
          )}
          <h1 className="text-4xl font-medium leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            {name}
          </h1>
        </div>
      </section>

      {/* Company Metadata Rail Section */}
      <div className="relative grid gap-5 px-4 pb-5 sm:px-6 sm:pb-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-end">
        {/* Company Avatar Section */}
        <div className="-mt-12 sm:-mt-14 [&>span]:size-24 sm:[&>span]:size-28">
          {profileAvatar}
        </div>

        {/* Company Metadata Section */}
        {meta && (
          <div className="profile-detail-meta profile-detail-company-meta grid min-w-0 grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4 md:mb-1">
            {meta}
          </div>
        )}

        {/* Company Actions Section */}
        {actions && (
          <div className="hidden shrink-0 items-center gap-2 md:mb-1 md:flex [&>button]:rounded-none">
            {actions}
          </div>
        )}
      </div>

      {/* Company Accent Line Section */}
      <div className="h-1 bg-foreground" aria-hidden />
    </DetailCard>
  );
}
