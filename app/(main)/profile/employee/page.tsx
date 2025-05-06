"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Divider from "@/components/utils/divider";
import LabelInput from "@/components/utils/label-input";
import { TypographyH3 } from "@/components/utils/typography/typography-h3";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  LucideAlarmCheck,
  LucideBriefcaseBusiness,
  LucideCalendarDays,
  LucideClock,
  LucideDownload,
  LucideEdit,
  LucideEye,
  LucideEyeClosed,
  LucideFileText,
  LucideGraduationCap,
  LucideLink2,
  LucideLock,
  LucideMail,
  LucidePhone,
  LucidePlus,
  LucideSchool,
  LucideUser,
  LucideXCircle,
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TGender } from "@/utils/types/gender.type";
import { TLocations } from "@/utils/types/location.type";
import {
  genderConstant,
  locationConstant,
  platformConstant,
} from "@/utils/constants/app.constant";
import { Textarea } from "@/components/ui/textarea";
import IconLabel from "@/components/utils/icon-label";
import { DatePicker } from "@/components/ui/date-picker";
import Tag from "@/components/utils/tag";
import { TPlatform } from "@/utils/types/platform.type";
import { userList } from "@/data/user-data";
import { useForm } from "react-hook-form";

export default function EmployeeProfilePage() {
  const employeeId = 1;
  const employee = userList.filter((user) => user.role === 'employee');
  const employeeList= employee[employeeId].employee;
  
  const [isEdit, setIsEdit] = useState<boolean>(false);  

  const [isShowPassword, setIsShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [selectedGender, setSelectedGender] = useState<TGender | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<TLocations | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedPlatform, setSelectedPlatform] = useState<TPlatform | null>(
    null
  );
 
  const form = useForm()

  return (
    <div className="!min-w-full flex flex-col gap-5">
      <div className="flex items-center justify-between border border-muted rounded-md p-5 tablet-sm:flex-col tablet-sm:[&>div]:w-full tablet-sm:gap-5">
        <div className="flex items-center justify-start gap-5 tablet-sm:flex-col">
          <Avatar className="size-36">
            <AvatarImage/>
            <AvatarFallback>BN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start gap-1 tablet-sm:items-center">
            <TypographyH3>{employeeList?.username}</TypographyH3>
            <TypographyMuted>{employeeList?.job}</TypographyMuted>
          </div>
        </div>
        {isEdit ? (
          <Button className="text-xs" onClick={() => setIsEdit(false)}>
            Cancel 
            <LucideXCircle/>
          </Button> 
        ) : (
          <Button className="text-xs" onClick={() => setIsEdit(true)}> 
            Edit Profile
            <LucideEdit/>
          </Button>
        )}
      </div>
      <div className="flex items-start gap-5 tablet-lg:flex-col tablet-lg:[&>div]:w-full">
        <div className="w-[60%] flex flex-col gap-5">
          {/* Personal Information Form Section */}
          <div className="w-full flex flex-col items-stretch gap-5 border border-muted rounded-md p-5">
            <div className="flex flex-col gap-1">
              <TypographyH4>Personal Information</TypographyH4>
              <Divider />
            </div>
            <form action="" className="flex flex-col items-start gap-5">
              <div className="w-full flex items-center justify-between gap-5 [&>div]:!w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:!w-full">
                <LabelInput
                  label="Firstname"
                  input={
                    <Input
                      placeholder="Firstname"
                      id="firstname"
                      name="firstname"
                    />
                  }
                />
                <LabelInput
                  label="Lastname"
                  input={
                    <Input
                      placeholder="Lastname"
                      id="lastname"
                      name="lastname"
                    />
                  }
                />
              </div>
              <LabelInput
                  label="Username"
                  input={
                    <Input placeholder="Username" id="username" name="username" />
                  }
              />
              <div className="w-full flex items-center justify-between gap-5 [&>div]:w-1/2">
                <div className="flex flex-col items-start gap-1">
                  <TypographyMuted className="text-xs">
                    Locations
                  </TypographyMuted>
                  <Select
                    onValueChange={(value: TLocations) =>
                      setSelectedLocation(value)
                    }
                    value={selectedLocation || ""}
                  >
                    <SelectTrigger className="h-12 text-muted-foreground">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationConstant.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <TypographyMuted className="text-xs">Gender</TypographyMuted>
                  <Select
                    onValueChange={(value: TGender) => setSelectedGender(value)}
                    value={selectedGender || ""}
                  >
                    <SelectTrigger className="h-12 text-muted-foreground">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderConstant.map((gender) => (
                        <SelectItem key={gender.id} value={gender.value}>
                          {gender.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <LabelInput
                label="Email"
                input={
                  <Input
                    placeholder="Email"
                    id="email"
                    name="email"
                    prefix={<LucideMail />}
                  />
                }
              />
              <LabelInput
                label="Phone Number"
                input={
                  <Input
                    placeholder="Phone Number"
                    id="phone"
                    name="phone"
                    prefix={<LucidePhone />}
                  />
                }
              />
            </form>
          </div>

          {/* Professional Information Form Section */}
          <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
            <div className="flex flex-col gap-1">
              <TypographyH4>Professional Information</TypographyH4>
              <Divider />
            </div>
            <form action="" className="flex flex-col items-start gap-5">
              <LabelInput
                label="Profession"
                input={
                  <Input
                    placeholder="Profession"
                    id="profession"
                    name="profession"
                    prefix={<LucideUser />}
                  />
                }
              />
              <div className="w-full flex justify-between items-center gap-5 [&>div]:w-1/2 tablet-md:flex-col tablet-md:[&>div]:w-full">
                <LabelInput
                  label="Year of Experience"
                  input={
                    <Input
                      placeholder="Year of Experience"
                      id="yearOfExperience"
                      name="yearOfExperience"
                      prefix={<LucideBriefcaseBusiness />}
                    />
                  }
                />
                <LabelInput
                  label="Availability"
                  input={
                    <Input
                      placeholder="Availability"
                      id="availability"
                      name="availability"
                      prefix={<LucideAlarmCheck />}
                    />
                  }
                />
              </div>
              <div className="w-full flex flex-col items-start gap-1">
                <TypographyMuted className="text-xs">
                  Description
                </TypographyMuted>
                <Textarea placeholder="Description" />
              </div>
            </form>
          </div>

          {/* Education Information Form Section */}
          <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <TypographyH4>Education Information</TypographyH4>
                <IconLabel
                  text="Add Education"
                  icon={<LucidePlus className="text-muted-foreground" />}
                  className="cursor-pointer"
                />
              </div>
              <Divider />
            </div>
            <form action="" className="flex flex-col items-start gap-5">
              <div className="w-full flex flex-col items-start gap-3">
                <TypographyMuted>Education 1</TypographyMuted>
                <div className="w-full flex flex-col items-start gap-5 p-5 border-[1px] border-muted rounded-md">
                  <LabelInput
                    label="School"
                    input={
                      <Input
                        placeholder="School"
                        id="school"
                        name="school"
                        prefix={<LucideSchool />}
                      />
                    }
                  />
                  <LabelInput
                    label="Degree"
                    input={
                      <Input
                        placeholder="Degree"
                        id="degree"
                        name="degree"
                        prefix={<LucideGraduationCap />}
                      />
                    }
                  />
                  <LabelInput
                    label="Graduation Year"
                    input={
                      <Input
                        placeholder="Year"
                        id="year"
                        name="year"
                        prefix={<LucideCalendarDays />}
                      />
                    }
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Experience Information Form Section */}
          <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <TypographyH4>Experience Information</TypographyH4>
                <IconLabel
                  text="Add Education"
                  icon={<LucidePlus className="text-muted-foreground" />}
                  className="cursor-pointer"
                />
              </div>
              <Divider />
            </div>
            <form action="" className="flex flex-col items-start gap-5">
              <div className="w-full flex flex-col items-start gap-3">
                <TypographyMuted>Experience 1</TypographyMuted>
                <div className="w-full flex flex-col items-start gap-5 p-5 border-[1px] border-muted rounded-md">
                  <div className="w-full flex justify-between items-center gap-5 [&>div]:w-1/2 tablet-md:flex-col tablet-md:[&>div]:w-full">
                    <LabelInput
                      label="Title"
                      input={
                        <Input
                          placeholder="Title"
                          id="title"
                          name="title"
                          prefix={<LucideBriefcaseBusiness />}
                        />
                      }
                    />
                    <LabelInput
                      label="Description"
                      input={
                        <Input
                          placeholder="Description"
                          id="description"
                          name="description"
                          prefix={<LucideGraduationCap />}
                        />
                      }
                    />
                  </div>
                  <div className="w-full flex justify-between items-center gap-5 tablet-sm:flex-col tablet-sm:[&>div]:!w-full">
                    <div className="w-1/2 flex flex-col items-start gap-1">
                      <TypographyMuted className="text-xs">
                        Start Date
                      </TypographyMuted>
                      <DatePicker
                        placeholder="Start Date"
                        date={selectedDate}
                        onDateChange={setSelectedDate}
                      />
                    </div>
                    <div className="w-1/2 flex flex-col items-start gap-1">
                      <TypographyMuted className="text-xs">
                        End Date
                      </TypographyMuted>
                      <DatePicker
                        placeholder="End Date"
                        date={selectedDate}
                        onDateChange={setSelectedDate}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="w-[40%] flex flex-col gap-5">
          <div className="flex flex-col items-stretch gap-5 border border-muted rounded-md p-5">
            <div className="flex flex-col gap-1">
              <TypographyH4>Account Settings</TypographyH4>
              <Divider />
            </div>
            <form action="" className="flex flex-col items-start gap-5">
              <LabelInput
                label="Current Password"
                input={
                  <Input
                    placeholder="Current Password"
                    id="current-password"
                    name="current-password"
                    type={isShowPassword.current ? "text" : "password"}
                    prefix={<LucideLock />}
                    suffix={
                      isShowPassword.current ? (
                        <LucideEyeClosed
                          onClick={() =>
                            setIsShowPassword({
                              ...isShowPassword,
                              current: false,
                            })
                          }
                        />
                      ) : (
                        <LucideEye
                          onClick={() =>
                            setIsShowPassword({
                              ...isShowPassword,
                              current: true,
                            })
                          }
                        />
                      )
                    }
                  />
                }
              />
              <LabelInput
                label="New Password"
                input={
                  <Input
                    placeholder="New Password"
                    id="new-password"
                    name="new-password"
                    type={isShowPassword.new ? "text" : "password"}
                    prefix={<LucideLock />}
                    suffix={
                      isShowPassword.new ? (
                        <LucideEyeClosed
                          onClick={() =>
                            setIsShowPassword({ ...isShowPassword, new: false })
                          }
                        />
                      ) : (
                        <LucideEye
                          onClick={() =>
                            setIsShowPassword({ ...isShowPassword, new: true })
                          }
                        />
                      )
                    }
                  />
                }
              />
              <LabelInput
                label="Confirm Password"
                input={
                  <Input
                    placeholder="Confirm Password"
                    id="confirm-password"
                    name="confirm-password"
                    type={isShowPassword.confirm ? "text" : "password"}
                    prefix={<LucideLock />}
                    suffix={
                      isShowPassword.confirm ? (
                        <LucideEyeClosed
                          onClick={() =>
                            setIsShowPassword({
                              ...isShowPassword,
                              confirm: false,
                            })
                          }
                        />
                      ) : (
                        <LucideEye
                          onClick={() =>
                            setIsShowPassword({
                              ...isShowPassword,
                              confirm: true,
                            })
                          }
                        />
                      )
                    }
                  />
                }
              />
            </form>
          </div>

          {/* Skill Section */}
          <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
            <div className="w-full flex flex-col gap-1">
              <div className="w-full flex justify-between items-center">
                <TypographyH4>Skills</TypographyH4>
                <IconLabel
                  text="Add Skill"
                  icon={<LucidePlus className="text-muted-foreground" />}
                  className="cursor-pointer"
                />
              </div>
              <Divider />
            </div>
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((skill) => (
                <Tag key={skill} label="Typescript" />
              ))}
            </div>
          </div>

          {/* CareerScopes Section */}
          <div className="border border-muted rounded-md p-5 flex flex-col items-start gap-5">
            <div className="w-full flex flex-col gap-1">
              <div className="w-full flex justify-between items-center">
                <TypographyH4>Career Scopes</TypographyH4>
                <IconLabel
                  text="Add Career"
                  icon={<LucidePlus className="text-muted-foreground" />}
                  className="cursor-pointer"
                />
              </div>
              <Divider />
            </div>
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((skill) => (
                <Tag key={skill} label="AI & Machine Learning" />
              ))}
            </div>
          </div>

          {/**/}
          <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
            <TypographyH4>Add your references</TypographyH4>
            <div className="w-full flex flex-col items-start gap-5 [&>div]:w-full">
              <div className="flex justify-between items-center px-3 py-2 bg-muted rounded-md">
                <div className="flex items-center text-muted-foreground gap-1">
                  <LucideFileText />
                  <TypographyMuted>Resume</TypographyMuted>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon">
                    <LucideEdit />
                  </Button>
                  <Button variant="outline" size="icon">
                    <LucideEye />
                  </Button>
                  <Button variant="outline" size="icon">
                    <LucideDownload />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center px-3 py-2 bg-muted rounded-md">
                <div className="flex items-center text-muted-foreground gap-1">
                  <LucideFileText />
                  <TypographyMuted>Cover Letter</TypographyMuted>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon">
                    <LucideEdit />
                  </Button>
                  <Button variant="outline" size="icon">
                    <LucideEye />
                  </Button>
                  <Button variant="outline" size="icon">
                    <LucideDownload />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Information Form Section */}
          <div className="w-full border border-muted rounded-md p-5 flex flex-col items-stretch gap-5">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <TypographyH4>Social Information</TypographyH4>
                <IconLabel
                  text="Add Social"
                  icon={<LucidePlus className="text-muted-foreground" />}
                  className="cursor-pointer"
                />
              </div>
              <Divider />
            </div>
            <form action="" className="flex flex-col items-start gap-5">
              <div className="w-full flex flex-col items-start gap-3">
                <TypographyMuted>Social 1</TypographyMuted>
                <div className="w-full flex flex-col items-start gap-5 p-5 border-[1px] border-muted rounded-md">
                  <div className="w-full flex justify-between items-center gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:!w-full">
                    <div className="flex flex-col items-start gap-1">
                      <TypographyMuted className="text-xs">
                        Platform
                      </TypographyMuted>
                      <Select
                        onValueChange={(value: TPlatform) =>
                          setSelectedPlatform(value)
                        }
                        value={selectedPlatform || ""}
                      >
                        <SelectTrigger className="h-12 text-muted-foreground">
                          <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {platformConstant.map((platform) => (
                            <SelectItem
                              key={platform.id}
                              value={platform.value}
                            >
                              {platform.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <LabelInput
                      label="Link"
                      input={
                        <Input
                          placeholder="Link"
                          id="link"
                          name="link"
                          prefix={<LucideLink2 />}
                        />
                      }
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
