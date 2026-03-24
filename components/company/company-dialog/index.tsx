import {
  LucideBuilding,
  LucideBuilding2,
  LucideCircleCheck,
  LucideExternalLink,
  LucideMapPin,
  LucideUsers,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../ui/dialog";
import { ICompanyDialogProps } from "./props";

export default function CompanyDialog(props: ICompanyDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent className="p-0 gap-0 flex flex-col overflow-hidden sm:max-w-lg sm:rounded-xl max-h-[90dvh] tablet-sm:!left-0 tablet-sm:!translate-x-0 tablet-sm:!translate-y-0 tablet-sm:!top-auto tablet-sm:!bottom-0 tablet-sm:!w-full tablet-sm:!max-w-none tablet-sm:rounded-t-2xl tablet-sm:!rounded-b-none tablet-sm:max-h-[92dvh]">
        {/* Drag handle — mobile only */}
        <div className="hidden tablet-sm:flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Cover banner */}
        <div className="relative shrink-0">
          {props.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={props.cover}
              alt={`${props.name} cover`}
              className="w-full h-28 object-cover"
            />
          ) : (
            <div className="w-full h-28 bg-gradient-to-br from-primary/80 to-primary/30" />
          )}
          {/* Avatar overlapping the cover */}
          <div className="absolute -bottom-9 left-4">
            <Avatar className="!size-20 ring-4 ring-background shadow-lg" rounded="md">
              <AvatarImage src={props.avatar!} />
              <AvatarFallback className="uppercase text-lg font-semibold">
                {props.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Name + industry + meta chips */}
        <div className="pt-12 px-4 shrink-0">
          <DialogTitle className="text-base font-bold leading-tight">
            {props.name}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-0.5">
            {props.industry}
          </DialogDescription>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {props.location && (
              <span className="inline-flex items-center gap-1 text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
                <LucideMapPin className="h-3 w-3 shrink-0" />
                {props.location}
              </span>
            )}
            {props.companySize && (
              <span className="inline-flex items-center gap-1 text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
                <LucideUsers className="h-3 w-3 shrink-0" />
                {props.companySize}+ Employees
              </span>
            )}
            {props.foundedYear && (
              <span className="inline-flex items-center gap-1 text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
                <LucideBuilding className="h-3 w-3 shrink-0" />
                Est. {props.foundedYear}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4 space-y-5">
          {/* About */}
          {props.description && (
            <section>
              <p className="text-sm font-semibold mb-1.5">About {props.name}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {props.description}
              </p>
            </section>
          )}

          {/* Benefits */}
          {props.benefits && props.benefits.length > 0 && (
            <section>
              <p className="text-sm font-semibold mb-2">Benefits</p>
              <div className="flex flex-wrap gap-2">
                {props.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium"
                  >
                    <LucideCircleCheck className="h-3.5 w-3.5 shrink-0" />
                    {benefit.label}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Values */}
          {props.values && props.values.length > 0 && (
            <section>
              <p className="text-sm font-semibold mb-2">Values</p>
              <div className="flex flex-wrap gap-2">
                {props.values.map((value, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 font-medium"
                  >
                    <LucideCircleCheck className="h-3.5 w-3.5 shrink-0" />
                    {value.label}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sticky CTA */}
        <div className="shrink-0 px-4 pb-4 pt-2 border-t border-border/60 bg-background">
          <Link href={`/feed/company/${props.id}`} className="w-full">
            <Button className="w-full gap-2">
              <LucideBuilding2 className="h-4 w-4" />
              View Company
              <LucideExternalLink className="h-3.5 w-3.5 ml-auto opacity-70" />
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
