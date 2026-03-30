import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import { useWatch, Path } from "react-hook-form";
import { IFormPanelProps } from "../props";
import { FieldLabel } from "./field-label";
import { capitalizeWords } from "@/utils/functions/text";

export function PersonalInfoTab({
  register,
  control,
}: Pick<IFormPanelProps, "register" | "control">) {
  /* -------------------------------- All States ------------------------------ */
  const socials = useWatch({ control, name: "personalInfo.socials" }) ?? {};

  /* ---------------------------------- Utils --------------------------------- */
  const socialKeys = Object.keys(socials);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col gap-4">
      {/* Full Name and Job Title Section */}
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

      {/* Email and Phone Section */}
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

      {/* Location and Age Section */}
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

      {/* Years of Experience and Availability Section */}
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

      {/* Professional Summary Section */}
      <div>
        <FieldLabel>Professional Summary</FieldLabel>
        <Textarea
          autoResize
          placeholder="A brief professional summary about yourself..."
          className="min-h-[80px]"
          {...register("summary")}
        />
      </div>

      {/* Social Links Section */}
      {socialKeys.length > 0 && (
        <div>
          <Separator className="mb-3" />
          <FieldLabel>Social Links</FieldLabel>
          <div className="flex flex-col gap-2">
            {socialKeys.map((key) => {
              const path = `personalInfo.socials.${key}` as Path<IBuildResume>;
              return (
                <div key={key}>
                  <FieldLabel>{capitalizeWords(key)}</FieldLabel>
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
