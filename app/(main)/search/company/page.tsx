"use client";

import SearchBar from "@/components/search/search-bar";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { companySearchSchema, TCompanySearchSchema } from "./validation";
import CompanySearchSvg from "@/assets/svg/company-search.svg";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { LucideBriefcaseBusiness, LucideClock, LucideGraduationCap } from "lucide-react";
import { RadioGroup } from "@/components/ui/radio-group";
import RadioGroupItemWithLabel from "@/components/ui/radio-group-item";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllEmployeeStore } from "@/stores/apis/employee/get-all-emp.store";
import { SearchErrorCard } from "@/components/search/search-error-card";

import SearchEmployeeCard from "@/components/search/search-employee-card";

export default function CompanySearchPage() {
  const { error, loading, employeesData } = useGetAllEmployeeStore();

  const { register, setValue, control, handleSubmit } = useForm<TCompanySearchSchema>({
    resolver: zodResolver(companySearchSchema),
  });

  const onSubmit = (data: TCompanySearchSchema) => {}

  return (
    <form className="w-full flex flex-col items-start gap-5 px-10">
      <div className="w-full flex items-center justify-between gap-10 laptop-sm:flex-col laptop-sm:items-center">
        <div className="w-full flex flex-col items-start gap-3 laptop-sm:py-5">
          <TypographyH2 className="leading-relaxed">
            Hire Smarter, Anywhere.
          </TypographyH2>
          <TypographyH4 className="leading-relaxed">
            Search top talent and connect instantly.
          </TypographyH4>
          <TypographyH4 className="leading-relaxed">
            Search profiles, review resumes, and reach out directly — instantly.
          </TypographyH4>
          <TypographyMuted className="leading-relaxed">
            Your next great hire is just a click away.
          </TypographyMuted>
          <SearchBar
            isEmployee={false}
            register={register}
            setValue={setValue}
          />
        </div>
        <Image
          src={CompanySearchSvg}
          alt="company-search"
          height={300}
          width={400}
          className="laptop-sm:hidden"
        />
      </div>
      <div className="w-full flex items-start gap-5 tablet-xl:!flex-col tablet-xl:[&>div]:w-full">
        <div className="w-1/4 flex flex-col items-start gap-8 p-5 shadow-md rounded-md">
          <TypographyH4 className="text-lg">Refine Result</TypographyH4>
          <div className="flex flex-col items-start gap-3">
            <TypographyP className="text-sm font-medium flex items-center gap-1">
              <LucideGraduationCap strokeWidth={"1.5px"} />
              Education Level
            </TypographyP>
            <Controller
              name="keyword"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    //setValue("educationLevel", val);
                    handleSubmit(onSubmit)();
                  }}
                  className="ml-3"
                >
                  <RadioGroupItemWithLabel
                    id="Under Graduate"
                    value="Under Graduate"
                    htmlFor="edu-undergrad"
                  >
                    Under Graduate
                  </RadioGroupItemWithLabel>
                  <RadioGroupItemWithLabel
                    id="Bachelor"
                    value="Bachelor"
                    htmlFor="edu-bachelor"
                  >
                    Bachelor
                  </RadioGroupItemWithLabel>
                  <RadioGroupItemWithLabel
                    id="Master"
                    value="Master"
                    htmlFor="edu-master"
                  >
                    Master
                  </RadioGroupItemWithLabel>
                  <RadioGroupItemWithLabel
                    id="PHD"
                    value="PHD"
                    htmlFor="edu-phd"
                  >
                    PhD
                  </RadioGroupItemWithLabel>
                </RadioGroup>
              )}
            />
          </div>
          <div className="flex flex-col items-start gap-3">
            <TypographyP className="text-sm font-medium flex items-center gap-1">
              <LucideBriefcaseBusiness strokeWidth={"1.5px"} />
              Experience Level
            </TypographyP>
            <Controller
              name="keyword"
              control={control}
              render={({ field }) => {
                // const selectedValue =
                //   field.value?.min === 0 && field.value?.max === 1
                //     ? "<1"
                //     : field.value?.min === 1 && field.value?.max === 2
                //     ? "1-2"
                //     : field.value?.min === 2 && field.value?.max === 3
                //     ? "2-3"
                //     : field.value?.min === 3 && !field.value?.max
                //     ? ">3"
                //     : undefined;

                return (
                  <RadioGroup
                    value={null}
                    onValueChange={(val) => {
                      let min = 0,
                        max: number | undefined = undefined;
                      if (val === "0-300") {
                        min = 0;
                        max = 300;
                      } else if (val === "300-600") {
                        min = 300;
                        max = 600;
                      } else if (val === "600-1000") {
                        min = 600;
                        max = 1000;
                      } else if (val === "1000+") {
                        min = 1000;
                        max = undefined;
                      }
                      const updated = { min, max };
                      field.onChange(updated);
                      //setValue("salaryRange", updated);
                      handleSubmit(onSubmit)();
                    }}
                    className="ml-3"
                  >
                    <RadioGroupItemWithLabel
                      id="exp-less-1"
                      value="<1"
                      htmlFor="exp-less-1"
                    >
                      Less than 1 year
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="exp-1-2"
                      value="1-2"
                      htmlFor="exp-1-2"
                    >
                      1 - 2 years
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="exp-2-3"
                      value="2-3"
                      htmlFor="exp-2-3"
                    >
                      2 - 3 years
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="exp-more-3"
                      value=">3"
                      htmlFor="exp-more-3"
                    >
                      More than 3 years
                    </RadioGroupItemWithLabel>
                  </RadioGroup>
                );
              }}
            />
          </div>
          <div className="flex flex-col items-start gap-3">
            <TypographyP className="text-sm font-medium flex items-center gap-1">
              <LucideClock strokeWidth={"1.5px"} />
              Availability
            </TypographyP>
            <Controller
              name="keyword"
              control={control}
              render={({ field }) => {
                return (
                  <RadioGroup
                    value={null}
                    onValueChange={(val) => {
                      let min = 0,
                        max: number | undefined = undefined;
                      if (val === "0-300") {
                        min = 0;
                        max = 300;
                      } else if (val === "300-600") {
                        min = 300;
                        max = 600;
                      } else if (val === "600-1000") {
                        min = 600;
                        max = 1000;
                      } else if (val === "1000+") {
                        min = 1000;
                        max = undefined;
                      }
                      const updated = { min, max };
                      field.onChange(updated);
                      //setValue("salaryRange", updated);
                      handleSubmit(onSubmit)();
                    }}
                    className="ml-3"
                  >
                    <RadioGroupItemWithLabel
                      id="exp-less-1"
                      value="<1"
                      htmlFor="exp-less-1"
                    >
                      Less than 1 year
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="exp-1-2"
                      value="1-2"
                      htmlFor="exp-1-2"
                    >
                      1 - 2 years
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="exp-2-3"
                      value="2-3"
                      htmlFor="exp-2-3"
                    >
                      2 - 3 years
                    </RadioGroupItemWithLabel>
                    <RadioGroupItemWithLabel
                      id="exp-more-3"
                      value=">3"
                      htmlFor="exp-more-3"
                    >
                      More than 3 years
                    </RadioGroupItemWithLabel>
                  </RadioGroup>
                );
              }}
            />
          </div>
        </div>
        <div className="w-3/4 flex flex-col items-start gap-3">
          <div className="w-full flex justify-between items-center">
            <TypographyH4 className="text-lg">
              {loading ? (
                <Skeleton className="h-6 w-40 bg-muted" />
              ) : error ? (
                <span className="text-destructive">0 Employee Found</span>
              ) : employeesData && employeesData.length > 0 ? (
                employeesData.length === 1 ? (
                  `${employeesData.length} Employee Found`
                ) : (
                  `${employeesData.length} Employees Found`
                )
              ) : (
                <Skeleton className="h-6 w-40 bg-muted" />
              )}
            </TypographyH4>
          </div>
          <div className="w-full flex flex-col items-start gap-2">
            {loading ? (
              <div className="w-full mb-3">
                <SearchEmployeeCard />
              </div>
            ) : error ? (
              <div className="w-full mb-3">
                <SearchErrorCard
                  error={error}
                  errorDescription="Try adjusting your filters or search terms and try again."
                />
              </div>
            ) : employeesData && employeesData.length > 0 ? (
              employeesData.map((item, index) => (
                <SearchEmployeeCard key={index}/>
              ))
            ) : (
              <div className="w-full mb-3">
                <SearchEmployeeCard />
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
