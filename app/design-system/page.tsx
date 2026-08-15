import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LucideBriefcase, LucideSparkles, LucideUsers } from "lucide-react";

import { PixelMosaic } from "@/components/utils/brand/pixel-mosaic";
import { StatusPill } from "@/components/utils/data-display/status-pill";
import { PageBanner } from "@/components/utils/layout/page-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./theme-toggle";

export const metadata: Metadata = { title: "Design system" };

/* ---------------------------------------------------------------------------
 * A living reference for the token layer. Dev-only: it exists so a colour
 * decision can be seen side by side in both themes instead of being guessed at
 * from hex values, and so a new status surface has something to copy from.
 * ------------------------------------------------------------------------- */

const STATUSES = ["success", "warning", "info", "destructive"] as const;

// Literal class names — Tailwind never sees `bg-pixel-${n}`.
const PIXEL_RUNGS = [
  { swatch: "bg-pixel-1", name: "pixel-1" },
  { swatch: "bg-pixel-2", name: "pixel-2" },
  { swatch: "bg-pixel-3", name: "pixel-3" },
  { swatch: "bg-pixel-4", name: "pixel-4" },
  { swatch: "bg-pixel-5", name: "pixel-5" },
  { swatch: "bg-pixel-6", name: "pixel-6" },
] as const;

type TStatusName = (typeof STATUSES)[number];

// Spelled out rather than interpolated: Tailwind scans for literal class names,
// so a template string like `bg-${status}-subtle` compiles to nothing.
const CALLOUT: Record<TStatusName, string> = {
  success: "bg-success-subtle border-success-border border-l-success",
  warning: "bg-warning-subtle border-warning-border border-l-warning",
  info: "bg-info-subtle border-info-border border-l-info",
  destructive:
    "bg-destructive-subtle border-destructive-border border-l-destructive",
};

const ACCENT_TEXT: Record<TStatusName, string> = {
  success: "text-success-accent",
  warning: "text-warning-accent",
  info: "text-info-accent",
  destructive: "text-destructive-accent",
};

const SOLID_BG: Record<TStatusName, string> = {
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
  destructive: "bg-destructive",
};

const ROLES = [
  { suffix: "", role: "solid fill", use: "dots, bars, filled chips" },
  { suffix: "-foreground", role: "on solid", use: "text/icons on that fill" },
  { suffix: "-accent", role: "accent text", use: "text on page, card, subtle" },
  {
    suffix: "-subtle",
    role: "subtle surface",
    use: "tinted status background",
  },
  { suffix: "-border", role: "subtle border", use: "boundary of that surface" },
] as const;

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="border-b border-border pb-2">
        <h2 className="text-lg font-medium uppercase tracking-tight">
          {title}
        </h2>
        {note ? (
          <p className="mt-1 text-sm text-muted-foreground">{note}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Swatch({ token, label }: { token: string; label: string }) {
  return (
    <div className="space-y-1.5">
      <div
        className="h-14 w-full border border-border"
        style={{ background: `hsl(var(--${token}))` }}
      />
      <div className="space-y-0.5">
        <p className="font-mono text-[11px] leading-tight">--{token}</p>
        <p className="text-[11px] leading-tight text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="flex items-start justify-between gap-6 border-b border-border pb-4">
          <div>
            <div aria-hidden className="mb-3 flex">
              <span className="size-2 bg-pixel-1" />
              <span className="size-2 bg-pixel-2" />
              <span className="size-2 bg-pixel-3" />
              <span className="size-2 bg-pixel-4" />
              <span className="size-2 bg-pixel-5" />
              <span className="size-2 bg-pixel-6" />
            </div>
            <h1 className="pixel-display text-3xl uppercase">Design system</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Every colour below resolves per theme on its own. Toggle the theme
              — nothing on this page carries a <code>dark:</code> variant.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <Section
          title="Page banner"
          note="Shared by feed, dashboard, matching, favourite, interview, notification, search and resume-builder. Replaced a two-column hero whose right half held a 146–320 KB illustration that could not follow the theme. The reclaimed space now carries real counts."
        >
          <div className="space-y-4">
            <PageBanner
              eyebrow="All talent"
              title="Find top talent from anywhere and grow your team"
              subtitle="Build your dream team effortlessly, no matter where you are."
              stats={[
                { icon: LucideUsers, label: "candidates", value: "1,248" },
                { icon: LucideSparkles, label: "new this week", value: "38" },
                { icon: LucideBriefcase, label: "open roles", value: "6" },
              ]}
            />
            <PageBanner
              eyebrow="Activity center"
              title="Your notifications"
              subtitle="Stay updated with your latest matches, likes, and messages."
              stats={[
                { icon: LucideUsers, label: "all", value: "24" },
                { icon: LucideSparkles, label: "unread", value: "3" },
              ]}
            />
            <PageBanner
              eyebrow="AI-powered features"
              title="Build a standout resume in minutes"
              subtitle="Let AI draft, refine, and format your resume so you can focus on the content."
            />
          </div>
        </Section>

        <Section
          title="Surfaces & text"
          note="Page, card and popover stack from darkest to lightest in light mode, and the reverse in dark."
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            <Swatch token="background" label="page" />
            <Swatch token="card" label="raised surface" />
            <Swatch token="popover" label="overlay" />
            <Swatch token="muted" label="inset / disabled" />
            <Swatch token="foreground" label="body text" />
            <Swatch token="muted-foreground" label="secondary text" />
          </div>
        </Section>

        <Section
          title="Brand"
          note="Ember carries every primary action. Accent is its tinted companion for hover and active states. In dark mode --primary is literally the pixel-3 tile; in light mode it is the deep end of the same hue, because the bright ramp orange is 2.6:1 on white and cannot hold text."
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            <Swatch token="primary" label="actions, links" />
            <Swatch token="primary-foreground" label="on primary" />
            <Swatch token="accent" label="hover surface" />
            <Swatch token="accent-foreground" label="on accent" />
            <Swatch token="secondary" label="secondary button" />
            <Swatch token="ring" label="focus ring" />
          </div>
        </Section>

        <Section
          title="Pixel ramp"
          note="Six rungs of one hue sweep, ordered by heat, identical in both themes — the ramp is the brand, and a mosaic that changed colour with the theme would stop reading as the same object. These are decorative fills: nothing sets text on them except --pixel-ink, the one foreground that clears AA on all six."
        >
          <div className="space-y-6">
            <div className="grid grid-cols-6">
              {PIXEL_RUNGS.map(({ swatch, name }) => (
                <div key={name} className="min-w-0">
                  <div
                    className={`pixel-tile-ink flex aspect-square items-end p-2 ${swatch}`}
                  >
                    <span className="pixel-label text-[9px]">{name}</span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="pixel-label mb-3 text-muted-foreground">
                Mosaics — same component, three seeds
              </p>
              <div className="flex flex-wrap items-start gap-6">
                {["Apsara Talent", "Sokha Chan", "Mekong Logistics"].map(
                  (seed) => (
                    <div key={seed} className="w-32 space-y-2">
                      <PixelMosaic seed={seed} columns={8} />
                      <p className="pixel-label text-[9px] text-muted-foreground">
                        {seed}
                      </p>
                    </div>
                  ),
                )}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Deterministic from the seed, so a company&rsquo;s mark is the
                same square on every render and different from everyone
                else&rsquo;s. Costs a few hundred bytes of markup — the hero
                illustrations it replaced ran 146–320 KB and could not follow
                the theme.
              </p>
            </div>
          </div>
        </Section>

        <Section
          title="Type tiers"
          note="Three voices. The sans is for prose. The mono is for anything machine-read — labels, counts, codes — and is what makes a stat legible as an instrument reading rather than as more sentence."
        >
          <div className="space-y-5 border border-border bg-card p-6">
            <div>
              <p className="pixel-label text-muted-foreground">
                .pixel-label — eyebrows, captions, column headers
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Space Mono 11px, caps, 0.14em. Always a label, never a sentence.
              </p>
            </div>
            <div className="border-t border-border pt-5">
              <p className="pixel-display text-4xl">
                Display, tight at -0.03em
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                <code>.pixel-display</code> is for headlines only. The tracking
                that looks deliberate at 40px closes 14px body copy into a
                block, so it is deliberately not a body-text class.
              </p>
            </div>
            <div className="border-t border-border pt-5">
              <p className="pixel-numeral text-3xl">1,248 · 38 · 6</p>
              <p className="mt-2 text-sm text-muted-foreground">
                <code>.pixel-numeral</code> — tabular, so a column of figures
                stays in register. That alignment is the reason the tier uses a
                mono rather than just tracking out the sans.
              </p>
            </div>
          </div>
        </Section>

        <Section
          title="Elevation & the press"
          note="A hard offset shadow with zero blur, always a whole number of --pixel-unit. Raised controls travel exactly that offset on :active, so the shadow reads as real displacement — a blurred shadow would imply a lens, and this UI is drawn, not photographed."
        >
          <div className="flex flex-wrap items-center gap-6 border border-border bg-card p-6">
            <div className="size-20 border border-border bg-background" />
            <div className="size-20 border border-border bg-background" />
            <Button>Press me</Button>
            <Button variant="outline">Flat, no travel</Button>
          </div>
        </Section>

        <Section
          title="Borders"
          note="Two values on purpose: --border is decorative, --input bounds a control and carries the 3:1 WCAG asks for."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="border border-border p-4 text-sm">
                border-border — dividers, card edges
              </div>
              <div className="border border-input p-4 text-sm">
                border-input — inputs, selects, outline buttons
              </div>
            </div>
            <div className="space-y-2">
              <Input placeholder="Real input, real border" />
              <Input
                placeholder="Error state"
                validationMessage="This field is required"
              />
            </div>
          </div>
        </Section>

        <Section
          title="Status"
          note="Four families, five roles each. Reach for these instead of raw palette shades — a token cannot drift between files, and it already knows both themes."
        >
          <div className="space-y-8">
            {STATUSES.map((status) => (
              <div key={status} className="space-y-3">
                <h3 className="font-mono text-sm font-medium">{status}</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {ROLES.map(({ suffix, role, use }) => (
                    <div key={suffix} className="space-y-1.5">
                      <div
                        className="h-14 w-full border border-border"
                        style={{ background: `hsl(var(--${status}${suffix}))` }}
                      />
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-medium leading-tight">
                          {role}
                        </p>
                        <p className="font-mono text-[10px] leading-tight text-muted-foreground">
                          --{status}
                          {suffix}
                        </p>
                        <p className="text-[10px] leading-tight text-muted-foreground">
                          {use}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Status in use"
          note="The same five roles composed the way components actually consume them."
        >
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((status) => (
                <StatusPill key={status} status={status}>
                  {status}
                </StatusPill>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {STATUSES.map((status) => (
                <StatusPill key={status} status={status} variant="solid">
                  {status}
                </StatusPill>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {STATUSES.map((status) => (
                <div
                  key={status}
                  className={`border border-l-[4px] p-3 text-sm ${CALLOUT[status]}`}
                >
                  <p className={`font-medium ${ACCENT_TEXT[status]}`}>
                    {status} callout
                  </p>
                  <p className="mt-0.5 text-muted-foreground">
                    Body copy stays on muted-foreground so the status colour
                    carries the meaning, not the whole block.
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {STATUSES.map((status, i) => (
                <div key={status} className="flex items-center gap-3">
                  <span className="w-24 text-xs text-muted-foreground">
                    {status}
                  </span>
                  <div className="h-2 flex-1 bg-muted">
                    <div
                      className={`h-full ${SOLID_BG[status]}`}
                      style={{ width: `${40 + i * 18}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Controls">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button disabled>Disabled</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </div>
        </Section>

        <Section
          title="Elevation"
          note="Hard offset shadows, no blur — the same square language as the rest of the UI."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-4 text-sm">Card — 4px offset</Card>
            <div className="border border-border bg-card p-4 text-sm">
              Dialog — 6px offset
            </div>
            <div className="border border-border bg-popover p-4 text-sm">
              Popover — 4px offset
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}
