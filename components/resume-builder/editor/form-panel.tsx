import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  IBuildResume,
  IExperience as Experience,
} from "@/utils/interfaces/resume";
import {
  UseFormRegister,
  UseFormSetValue,
  Control,
  useFieldArray,
  useWatch,
  Path,
} from "react-hook-form";
import {
  PlusCircle,
  Trash2,
  User,
  Briefcase,
  GraduationCap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

/* ─── Types ─────────────────────────────────────────────────── */
interface FormPanelProps {
  register: UseFormRegister<IBuildResume>;
  control: Control<IBuildResume>;
  setValue: UseFormSetValue<IBuildResume>;
}

/* ─── Small helper label ─────────────────────────────────────── */
function FieldLabel({ children }: { children: React.ReactNode }) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <TypographyMuted className="text-xs font-medium mb-1">
      {children}
    </TypographyMuted>
  );
}

/* ─── Personal Info Tab ──────────────────────────────────────── */
function PersonalInfoTab({
  register,
  control,
}: Pick<FormPanelProps, "register" | "control">) {
  /* -------------------------------- All States ------------------------------ */
  const socials = useWatch({ control, name: "personalInfo.socials" }) ?? {};
  /* ---------------------------------- Utils --------------------------------- */
  const socialKeys = Object.keys(socials);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel>Full Name</FieldLabel>
          <Input
            placeholder="Full Name"
            {...register("personalInfo.fullName")}
          />
        </div>
        <div>
          <FieldLabel>Job Title</FieldLabel>
          <Input
            placeholder="e.g. Software Engineer"
            {...register("personalInfo.job")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel>Email</FieldLabel>
          <Input
            placeholder="email@example.com"
            {...register("personalInfo.email")}
          />
        </div>
        <div>
          <FieldLabel>Phone</FieldLabel>
          <Input
            placeholder="+1 234 567 890"
            {...register("personalInfo.phone")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel>Location</FieldLabel>
          <Input
            placeholder="City, Country"
            {...register("personalInfo.location")}
          />
        </div>
        <div>
          <FieldLabel>Age</FieldLabel>
          <Input
            type="number"
            placeholder="Age"
            {...register("personalInfo.age", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel>Years of Experience</FieldLabel>
          <Input
            placeholder="e.g. 5 years"
            {...register("yearsOfExperience")}
          />
        </div>
        <div>
          <FieldLabel>Availability</FieldLabel>
          <Input placeholder="e.g. Immediately" {...register("availability")} />
        </div>
      </div>

      <div>
        <FieldLabel>Professional Summary</FieldLabel>
        <Textarea
          autoResize
          placeholder="A brief professional summary about yourself..."
          className="min-h-[80px]"
          {...register("summary")}
        />
      </div>

      {/* Social links */}
      {socialKeys.length > 0 && (
        <div>
          <Separator className="mb-3" />
          <FieldLabel>Social Links</FieldLabel>
          <div className="flex flex-col gap-2">
            {socialKeys.map((key) => {
              const path = `personalInfo.socials.${key}` as Path<IBuildResume>;
              return (
                <div key={key}>
                  <FieldLabel>{capitalize(key)}</FieldLabel>
                  <Input
                    placeholder={`https://${key}.com/...`}
                    {...register(path)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Single Experience Card ─────────────────────────────────── */
function ExperienceCard({
  index,
  register,
  control,
  onRemove,
  showRemove,
}: {
  index: number;
  register: UseFormRegister<IBuildResume>;
  control: Control<IBuildResume>;
  onRemove: () => void;
  showRemove: boolean;
}) {
  /* -------------------------------- All States ------------------------------ */
  const [open, setOpen] = useState(true);
  const position = useWatch({
    control,
    name: `experience.${index}.position` as Path<IBuildResume>,
  });

  // Achievements nested field array
  /* ---------------------------------- Utils --------------------------------- */
  const achPath = `experience.${index}.achievements` as Path<IBuildResume>;
  /* ----------------------------- API Integration ---------------------------- */
  const {
    fields: achFields,
    append: achAppend,
    remove: achRemove,
  } = useFieldArray({ control, name: achPath as "experience" });

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Card header */}
      <div
        className="flex items-center justify-between px-3 py-2.5 bg-muted/40 cursor-pointer select-none"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-sm font-medium truncate">
          {(position as string) || `Experience ${index + 1}`}
        </span>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          {showRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 size={13} />
            </button>
          )}
          {open ? (
            <ChevronUp size={14} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={14} className="text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Card body */}
      {open && (
        <div className="p-3 flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel>Position / Role</FieldLabel>
              <Input
                placeholder="Software Engineer"
                {...register(`experience.${index}.position`)}
              />
            </div>
            <div>
              <FieldLabel>Company</FieldLabel>
              <Input
                placeholder="Company Name"
                {...register(`experience.${index}.company`)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel>Start Date</FieldLabel>
              <Input
                placeholder="January 2022"
                {...register(`experience.${index}.startDate`)}
              />
            </div>
            <div>
              <FieldLabel>End Date</FieldLabel>
              <Input
                placeholder="Present"
                {...register(`experience.${index}.endDate`)}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              autoResize
              placeholder="Brief description of your role..."
              className="min-h-[64px]"
              {...register(`experience.${index}.description`)}
            />
          </div>

          {/* Achievements */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <FieldLabel>Key Achievements</FieldLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => achAppend("" as unknown as Experience)}
              >
                <PlusCircle size={11} className="mr-1" /> Add
              </Button>
            </div>
            <div className="flex flex-col gap-1.5">
              {achFields.map((f, ai) => (
                <div key={f.id} className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-xs shrink-0">
                    •
                  </span>
                  <Input
                    placeholder="e.g. Increased revenue by 30%"
                    {...register(
                      `experience.${index}.achievements.${ai}` as Path<IBuildResume>,
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => achRemove(ai)}
                    className="p-1 shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              {achFields.length === 0 && (
                <TypographyMuted className="text-xs italic">
                  No achievements added.
                </TypographyMuted>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Experience Tab ─────────────────────────────────────────── */
function ExperienceTab({
  register,
  control,
}: Pick<FormPanelProps, "register" | "control">) {
  /* ----------------------------- API Integration ---------------------------- */
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  /* --------------------------------- Methods --------------------------------- */
  // ── Add Experience ─────────────────────────────────────────
  const addExperience = () => {
    append({
      company: "",
      position: "",
      startDate: "",
      endDate: "Present",
      description: "",
      achievements: [],
    } as Experience);
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col gap-3">
      {fields.map((f, i) => (
        <ExperienceCard
          key={f.id}
          index={i}
          register={register}
          control={control}
          onRemove={() => remove(i)}
          showRemove={fields.length > 1}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full text-xs border-dashed"
        onClick={addExperience}
      >
        <PlusCircle size={13} className="mr-1.5" />
        Add Experience
      </Button>
    </div>
  );
}

/* ─── Skills & Education Tab ─────────────────────────────────── */
function SkillsEducationTab({ register, control, setValue }: FormPanelProps) {
  /* -------------------------------- All States ------------------------------ */
  const skills = (useWatch({ control, name: "skills" }) ?? []) as string[];
  const careerScopes = (useWatch({ control, name: "careerScopes" }) ??
    []) as string[];
  const [newSkill, setNewSkill] = useState("");
  const [newScope, setNewScope] = useState("");

  /* --------------------------------- Methods --------------------------------- */
  // ── Add Skill ─────────────────────────────────────────
  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    setValue("skills", [...skills, trimmed], { shouldDirty: true });
    setNewSkill("");
  };

  const removeSkill = (i: number) => {
    setValue(
      "skills",
      skills.filter((_, idx) => idx !== i),
      { shouldDirty: true },
    );
  };

  const addScope = () => {
    const trimmed = newScope.trim();
    if (!trimmed) return;
    setValue("careerScopes", [...careerScopes, trimmed], {
      shouldDirty: true,
    });
    setNewScope("");
  };

  const removeScope = (i: number) => {
    setValue(
      "careerScopes",
      careerScopes.filter((_, idx) => idx !== i),
      { shouldDirty: true },
    );
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col gap-5">
      {/* Skills */}
      <div>
        <FieldLabel>Skills</FieldLabel>
        <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-0.5 rounded-full"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(i)}
                className="text-primary/60 hover:text-destructive transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Add a skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addSkill}
            className="sm:min-w-20"
          >
            Add
          </Button>
        </div>
      </div>

      <Separator />

      {/* Education */}
      <div>
        <FieldLabel>Education</FieldLabel>
        <Textarea
          autoResize
          placeholder="e.g. Bachelor of Science, Computer Science, MIT, 2020"
          className="min-h-[72px]"
          {...register("education")}
        />
        <TypographyMuted className="text-xs mt-1">
          Separate multiple degrees with{" "}
          <code className="text-xs bg-muted px-1 rounded">|</code>
        </TypographyMuted>
      </div>

      <Separator />

      {/* Career Scopes */}
      <div>
        <FieldLabel>Career Interests</FieldLabel>
        <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
          {careerScopes.map((scope, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs px-2.5 py-0.5 rounded-full"
            >
              {scope}
              <button
                type="button"
                onClick={() => removeScope(i)}
                className="text-emerald-500 hover:text-destructive transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Add a career interest..."
            value={newScope}
            onChange={(e) => setNewScope(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addScope();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addScope}
            className="sm:min-w-20"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main FormPanel ─────────────────────────────────────────── */
export default function ResumeEditorFormPanel(props: FormPanelProps) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Tabs defaultValue="personal" className="flex flex-col h-full">
      {/* Tab bar */}
      <TabsList className="grid w-full shrink-0 grid-cols-3">
        <TabsTrigger
          value="personal"
          className="gap-1 text-[11px] sm:gap-1.5 sm:text-xs"
        >
          <User size={12} /> Personal
        </TabsTrigger>
        <TabsTrigger
          value="experience"
          className="gap-1 text-[11px] sm:gap-1.5 sm:text-xs"
        >
          <Briefcase size={12} /> Experience
        </TabsTrigger>
        <TabsTrigger
          value="skills"
          className="gap-1 text-[11px] sm:gap-1.5 sm:text-xs"
        >
          <GraduationCap size={12} /> Skills
        </TabsTrigger>
      </TabsList>

      {/* Tab contents — each scrolls independently */}
      <TabsContent
        value="personal"
        className="flex-1 overflow-y-auto mt-3 pr-1"
      >
        <PersonalInfoTab register={props.register} control={props.control} />
      </TabsContent>

      <TabsContent
        value="experience"
        className="flex-1 overflow-y-auto mt-3 pr-1"
      >
        <ExperienceTab register={props.register} control={props.control} />
      </TabsContent>

      <TabsContent value="skills" className="flex-1 overflow-y-auto mt-3 pr-1">
        <SkillsEducationTab {...props} />
      </TabsContent>
    </Tabs>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
