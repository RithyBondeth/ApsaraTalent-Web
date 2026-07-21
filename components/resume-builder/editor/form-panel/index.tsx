"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  User,
  Briefcase,
  GraduationCap,
  LayoutPanelLeft,
  Palette,
} from "lucide-react";
import { IFormPanelProps } from "./props";
import { PersonalInfoTab } from "./utils/personal-info-tab";
import { ExperienceTab } from "./utils/experience-tab";
import { SkillsEducationTab } from "./utils/skills-education-tab";
import { LayoutTab } from "./utils/layout-tab";
import { DesignTab } from "./utils/design-tab";
import { useTranslations } from "next-intl";

export default function ResumeEditorFormPanel(props: IFormPanelProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Tabs defaultValue="personal" className="flex h-full flex-col">
      {/* Tab Bar Section */}
      <TabsList className="grid h-10 w-full shrink-0 grid-cols-5 rounded-xl bg-muted/70 p-1">
        {/* Personal Tab Trigger Section */}
        <TabsTrigger
          value="personal"
          aria-label={t("tabPersonal")}
          title={t("tabPersonal")}
          className="gap-1 rounded-lg px-1 text-[10px] data-[state=active]:bg-card sm:gap-1.5 sm:text-xs"
        >
          <User size={13} />
          <span className="hidden sm:inline">{t("tabPersonal")}</span>
        </TabsTrigger>

        {/* Experience Tab Trigger Section */}
        <TabsTrigger
          value="experience"
          aria-label={t("tabExperience")}
          title={t("tabExperience")}
          className="gap-1 rounded-lg px-1 text-[10px] data-[state=active]:bg-card sm:gap-1.5 sm:text-xs"
        >
          <Briefcase size={13} />
          <span className="hidden sm:inline">{t("tabExperience")}</span>
        </TabsTrigger>

        {/* Skills Tab Trigger Section */}
        <TabsTrigger
          value="skills"
          aria-label={t("tabSkills")}
          title={t("tabSkills")}
          className="gap-1 rounded-lg px-1 text-[10px] data-[state=active]:bg-card sm:gap-1.5 sm:text-xs"
        >
          <GraduationCap size={13} />
          <span className="hidden sm:inline">{t("tabSkills")}</span>
        </TabsTrigger>

        {/* Layout Tab Trigger Section */}
        <TabsTrigger
          value="layout"
          aria-label={t("tabLayout")}
          title={t("tabLayout")}
          className="gap-1 rounded-lg px-1 text-[10px] data-[state=active]:bg-card sm:gap-1.5 sm:text-xs"
        >
          <LayoutPanelLeft size={13} />
          <span className="hidden sm:inline">{t("tabLayout")}</span>
        </TabsTrigger>

        {/* Design Tab Trigger Section */}
        <TabsTrigger
          value="design"
          aria-label={t("tabDesign")}
          title={t("tabDesign")}
          className="gap-1 rounded-lg px-1 text-[10px] data-[state=active]:bg-card sm:gap-1.5 sm:text-xs"
        >
          <Palette size={13} />
          <span className="hidden sm:inline">{t("tabDesign")}</span>
        </TabsTrigger>
      </TabsList>

      {/* Tab Contents Section: Each scrolls independently */}
      <TabsContent
        value="personal"
        className="mt-3 flex-1 overflow-y-auto pr-1.5"
      >
        {/* Personal Info Tab Content Section */}
        <PersonalInfoTab
          register={props.register}
          control={props.control}
          setValue={props.setValue}
        />
      </TabsContent>

      <TabsContent
        value="experience"
        className="mt-3 flex-1 overflow-y-auto pr-1.5"
      >
        {/* Experience Tab Content Section */}
        <ExperienceTab
          register={props.register}
          control={props.control}
          setValue={props.setValue}
        />
      </TabsContent>

      <TabsContent
        value="skills"
        className="mt-3 flex-1 overflow-y-auto pr-1.5"
      >
        {/* Skills Tab Content Section */}
        <SkillsEducationTab {...props} />
      </TabsContent>

      <TabsContent
        value="layout"
        className="mt-3 flex-1 overflow-y-auto pr-1.5"
      >
        {/* Layout Tab Content Section */}
        <LayoutTab />
      </TabsContent>

      <TabsContent
        value="design"
        className="mt-3 flex-1 overflow-y-auto pr-1.5"
      >
        {/* Design Tab Content Section */}
        <DesignTab control={props.control} setValue={props.setValue} />
      </TabsContent>
    </Tabs>
  );
}
