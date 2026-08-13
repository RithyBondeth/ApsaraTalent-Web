"use client";

import {
  LucideBuilding,
  LucideBuilding2,
  LucideCircleCheck,
  LucideExternalLink,
  LucideMapPin,
  LucideUsers,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../ui/dialog";
import { ICompanyDialogProps } from "./props";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useTranslations } from "next-intl";
import { translateLocation, getNameInitials } from "@/utils/functions/text";

export default function CompanyDialog(props: ICompanyDialogProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("feed");
  const tl = useTranslations("locations");

  const isEmpty =
    !props.description &&
    (!props.benefits || props.benefits.length === 0) &&
    (!props.values || props.values.length === 0);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent className="flex max-h-[90dvh] flex-col gap-0 overflow-hidden rounded-none p-0 tablet-sm:!bottom-0 tablet-sm:!left-0 tablet-sm:!top-auto tablet-sm:max-h-[92dvh] tablet-sm:!w-full tablet-sm:!max-w-none tablet-sm:!translate-x-0 tablet-sm:!translate-y-0 tablet-sm:!rounded-none sm:max-w-lg sm:rounded-none [&>button]:rounded-none">
        {/* Drag Handle Section — Mobile Only */}
        <div className="hidden shrink-0 justify-center pb-1 pt-3 tablet-sm:flex">
          <div className="h-1 w-10 rounded-none bg-muted-foreground/30" />
        </div>

        {/* Cover Banner Section */}
        <div className="relative shrink-0">
          {props.cover ? (
            <Image
              src={props.cover}
              alt={`${props.name} cover`}
              width={1200}
              height={224}
              className="h-28 w-full object-cover"
              unoptimized
            />
          ) : (
            <div className="h-28 w-full bg-gradient-to-br from-primary/80 to-primary/30" />
          )}
          {/* Avatar Overlapping The Cover Section */}
          <div className="absolute -bottom-9 left-4">
            <Avatar
              className="!size-20 !rounded-none shadow-lg ring-4 ring-background"
              rounded="md"
            >
              <AvatarImage src={props.avatar!} />
              <AvatarFallback className="text-lg font-semibold uppercase">
                {getNameInitials(props.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Name, Industry, Location, CompanySize, FoundedYear, Progress Section */}
        <div className="shrink-0 px-4 pt-12">
          <DialogTitle className="text-base font-bold leading-tight">
            {props.name}
          </DialogTitle>
          <DialogDescription className="mt-0.5 text-sm text-muted-foreground">
            {props.industry}
          </DialogDescription>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {props.location && (
              <span className="inline-flex items-center gap-1 rounded-none bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                <LucideMapPin className="h-3 w-3 shrink-0" />
                {translateLocation(props.location, tl)}
              </span>
            )}
            {props.companySize && (
              <span className="inline-flex items-center gap-1 rounded-none bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                <LucideUsers className="h-3 w-3 shrink-0" />
                {t("dialogEmployeesCount", { count: props.companySize })}
              </span>
            )}
            {props.foundedYear && (
              <span className="inline-flex items-center gap-1 rounded-none bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                <LucideBuilding className="h-3 w-3 shrink-0" />
                {t("established", { year: props.foundedYear })}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Body Section */}
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4">
          {/* Empty State Section */}
          {isEmpty && (
            <TypographyMuted className="py-6 text-center text-sm">
              {t("dialogEmptyProfile")}
            </TypographyMuted>
          )}

          {/* About Section */}
          {props.description && (
            <section>
              <TypographyP className="mb-1.5 text-sm font-semibold [&:not(:first-child)]:mt-0">
                {t("dialogAboutCompany", { name: props.name })}
              </TypographyP>
              <TypographyMuted className="text-sm leading-relaxed text-muted-foreground">
                {props.description}
              </TypographyMuted>
            </section>
          )}

          {/* Benefits Section */}
          {props.benefits && props.benefits.length > 0 && (
            <section>
              <TypographyP className="mb-2 text-sm font-semibold [&:not(:first-child)]:mt-0">
                {t("dialogBenefits")}
              </TypographyP>
              <div className="flex flex-wrap gap-2">
                {props.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 rounded-none bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                  >
                    <LucideCircleCheck className="h-3.5 w-3.5 shrink-0" />
                    {benefit.label}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Values Section */}
          {props.values && props.values.length > 0 && (
            <section>
              <TypographyP className="mb-2 text-sm font-semibold [&:not(:first-child)]:mt-0">
                {t("dialogValues")}
              </TypographyP>
              <div className="flex flex-wrap gap-2">
                {props.values.map((value, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 rounded-none bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-700 dark:bg-green-950/40 dark:text-green-300"
                  >
                    <LucideCircleCheck className="h-3.5 w-3.5 shrink-0" />
                    {value.label}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sticky CTA Section */}
        <div className="shrink-0 border-t border-border/60 bg-background px-4 pb-4 pt-2">
          <Link href={`/feed/company/${props.id}`} className="w-full">
            <Button className="w-full gap-2 rounded-none">
              <LucideBuilding2 className="h-4 w-4" />
              {t("dialogViewCompany")}
              <LucideExternalLink className="ml-auto h-3.5 w-3.5 opacity-70" />
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
