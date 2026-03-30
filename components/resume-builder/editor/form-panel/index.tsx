import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Briefcase, GraduationCap } from "lucide-react";
import { IFormPanelProps } from "./props";
import { PersonalInfoTab } from "./utils/personal-info-tab";
import { ExperienceTab } from "./utils/experience-tab";
import { SkillsEducationTab } from "./utils/skills-education-tab";

export default function ResumeEditorFormPanel(props: IFormPanelProps) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Tabs defaultValue="personal" className="flex flex-col h-full">
      {/* Tab Bar Section */}
      <TabsList className="grid w-full shrink-0 grid-cols-3">
        {/* Personal Tab Trigger */}
        <TabsTrigger
          value="personal"
          className="gap-1 text-[11px] sm:gap-1.5 sm:text-xs"
        >
          <User size={12} /> Personal
        </TabsTrigger>

        {/* Experience Tab Trigger */}
        <TabsTrigger
          value="experience"
          className="gap-1 text-[11px] sm:gap-1.5 sm:text-xs"
        >
          <Briefcase size={12} /> Experience
        </TabsTrigger>

        {/* Skills Tab Trigger */}
        <TabsTrigger
          value="skills"
          className="gap-1 text-[11px] sm:gap-1.5 sm:text-xs"
        >
          <GraduationCap size={12} /> Skills
        </TabsTrigger>
      </TabsList>

      {/* Tab Contents Section: Each scrolls independently */}
      <TabsContent
        value="personal"
        className="flex-1 overflow-y-auto mt-3 pr-1"
      >
        {/* Personal Info Tab Content */}
        <PersonalInfoTab register={props.register} control={props.control} />
      </TabsContent>

      <TabsContent
        value="experience"
        className="flex-1 overflow-y-auto mt-3 pr-1"
      >
        {/* Experience Tab Content */}
        <ExperienceTab register={props.register} control={props.control} />
      </TabsContent>

      <TabsContent value="skills" className="flex-1 overflow-y-auto mt-3 pr-1">
        {/* Skills Tab Content */}
        <SkillsEducationTab {...props} />
      </TabsContent>
    </Tabs>
  );
}
