"use client";

import { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Briefcase,
  ChevronDown,
  GraduationCap,
  LayoutPanelLeft,
  ListTree,
  Palette,
  User,
} from "lucide-react";
import { IFormPanelProps } from "./props";
import { PersonalInfoTab } from "./utils/personal-info-tab";
import { ExperienceTab } from "./utils/experience-tab";
import { SkillsEducationTab } from "./utils/skills-education-tab";
import { LayoutTab } from "./utils/layout-tab";
import { DesignTab } from "./utils/design-tab";
import { useTranslations } from "next-intl";

/* --------------------------------- Helpers --------------------------------- */
type TEditorTab = "content" | "layout" | "design";

interface IResumeEditorFormPanelProps extends IFormPanelProps {
  activeTab: TEditorTab;
  onTabChange: (value: TEditorTab) => void;
}

function ContentEditorSection({
  title,
  description,
  icon,
  defaultOpen = false,
  children,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="border border-border">
      {/* Collapsible Trigger Section */}
      <CollapsibleTrigger className="group flex w-full items-center gap-3 bg-muted/25 px-3 py-3 text-left transition-colors hover:bg-muted/50">
        <span className="flex size-8 shrink-0 items-center justify-center border border-border bg-background text-muted-foreground">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-bold text-foreground">
            {title}
          </span>
          <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">
            {description}
          </span>
        </span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>

      {/* Collapsible Content Section */}
      <CollapsibleContent className="border-t border-border px-3 py-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function ResumeEditorFormPanel(
  props: IResumeEditorFormPanelProps,
) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Tabs
      value={props.activeTab}
      onValueChange={(value) => props.onTabChange(value as TEditorTab)}
      className="flex h-full flex-col"
    >
      {/* Primary Editor Navigation Section */}
      <TabsList className="grid h-11 w-full shrink-0 grid-cols-3 rounded-none border border-border bg-muted/35 p-0">
        <TabsTrigger
          value="content"
          className="h-full gap-1.5 rounded-none border-r border-border px-2 text-xs shadow-none"
        >
          <ListTree size={13} /> {t("tabContent")}
        </TabsTrigger>
        <TabsTrigger
          value="layout"
          className="h-full gap-1.5 rounded-none border-r border-border px-2 text-xs shadow-none"
        >
          <LayoutPanelLeft size={13} /> {t("tabLayout")}
        </TabsTrigger>
        <TabsTrigger
          value="design"
          className="h-full gap-1.5 rounded-none px-2 text-xs shadow-none"
        >
          <Palette size={13} /> {t("tabStyle")}
        </TabsTrigger>
      </TabsList>

      {/* Content Editor Section */}
      <TabsContent value="content" className="mt-3 flex-1 overflow-y-auto pr-1">
        <div className="mb-3 border-l-2 border-foreground px-3 py-1">
          <p className="text-xs font-bold text-foreground">
            {t("contentEditorTitle")}
          </p>
          <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
            {t("contentEditorDescription")}
          </p>
        </div>

        <div className="flex flex-col gap-2 pb-3">
          <ContentEditorSection
            title={t("tabPersonal")}
            description={t("contentPersonalDescription")}
            icon={<User size={14} />}
            defaultOpen
          >
            <PersonalInfoTab
              register={props.register}
              control={props.control}
              setValue={props.setValue}
            />
          </ContentEditorSection>

          <ContentEditorSection
            title={t("tabExperience")}
            description={t("contentExperienceDescription")}
            icon={<Briefcase size={14} />}
          >
            <ExperienceTab
              register={props.register}
              control={props.control}
              setValue={props.setValue}
            />
          </ContentEditorSection>

          <ContentEditorSection
            title={t("tabSkills")}
            description={t("contentSkillsDescription")}
            icon={<GraduationCap size={14} />}
          >
            <SkillsEducationTab
              register={props.register}
              control={props.control}
              setValue={props.setValue}
              getValues={props.getValues}
            />
          </ContentEditorSection>
        </div>
      </TabsContent>

      {/* Layout Editor Section */}
      <TabsContent value="layout" className="mt-3 flex-1 overflow-y-auto pr-1">
        <LayoutTab />
      </TabsContent>

      {/* Style Editor Section */}
      <TabsContent value="design" className="mt-3 flex-1 overflow-y-auto pr-1">
        <DesignTab control={props.control} setValue={props.setValue} />
      </TabsContent>
    </Tabs>
  );
}
