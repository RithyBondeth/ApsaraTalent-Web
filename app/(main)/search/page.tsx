import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import Image from "next/image";
import feedWhiteSvg from "@/assets/svg/feed-white.svg";
import SearchBar from "@/components/search/search-bar";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { RadioGroup } from "@/components/ui/radio-group";
import SearchRelevantDropdown from "@/components/search/search-bar/search-relevant-dropdown";
import RadioGroupItemWithLabel from "@/components/ui/radio-group-item";
import SearchEmployeeCard from "@/components/search/search-employee-card";

export default function SearchPage() {
  return (
    <div className="w-full flex flex-col items-start gap-5 px-10">
      <div className="w-full flex items-center justify-between gap-10 laptop-sm:flex-col laptop-sm:items-center">
        <div className="w-full flex flex-col items-start gap-3 laptop-sm:py-5">
          <TypographyH2 className="leading-relaxed">
            Hire Smarter, Anywhere.
          </TypographyH2>
          <TypographyH4 className="leading-relaxed">
            Search top talent and connect instantly.
          </TypographyH4>
          <TypographyMuted className="leading-relaxed">
            Your next great hire is just a click away.
          </TypographyMuted>
          <SearchBar/>
        </div>
        <Image
          src={feedWhiteSvg}
          alt="feed"
          height={300}
          width={400}
          className="laptop-sm:hidden"
        />
      </div>
      <div className="w-full flex items-start gap-5 tablet-xl:!flex-col tablet-xl:[&>div]:w-full">
        <div className="w-1/4 flex flex-col items-start gap-5 p-5 shadow-md rounded-md">
          <TypographyH4 className="text-lg">Refine Result</TypographyH4>
          <div className="flex flex-col items-start gap-3">
            <TypographyP className="text-sm">Date Posted</TypographyP>
            <RadioGroup>
              <RadioGroupItemWithLabel id='r1' value="last 24 hours" htmlFor="r1">Last 2 Hours</RadioGroupItemWithLabel>
              <RadioGroupItemWithLabel id='r2' value="last 3 days" htmlFor="r2">Last 3 Days</RadioGroupItemWithLabel>
              <RadioGroupItemWithLabel id='r3' value="last week" htmlFor="r3">Last week</RadioGroupItemWithLabel>              
            </RadioGroup>
          </div>
          <div className="flex flex-col items-start gap-3">
            <TypographyP className="text-sm">Company Size</TypographyP>
            <RadioGroup>
              <RadioGroupItemWithLabel id='r1' value="last 24 hours" htmlFor="r1">Start up (1-50)</RadioGroupItemWithLabel>
              <RadioGroupItemWithLabel id='r2' value="last 3 days" htmlFor="r2">Medium (51-500)</RadioGroupItemWithLabel>
              <RadioGroupItemWithLabel id='r3' value="last week" htmlFor="r3">Large (500+)</RadioGroupItemWithLabel>              
            </RadioGroup>
          </div>
        </div>
        <div className="w-3/4 flex flex-col items-start gap-3">
          <div className="w-full flex justify-between items-center">
            <TypographyH4 className="text-lg">1,545 Jobs Found</TypographyH4>
            <SearchRelevantDropdown/>
          </div>
          <div className="w-full flex flex-col items-start gap-2">
            {[1, 2, 3, 4, 5, 6].map((item) => <SearchEmployeeCard key={item}/>)}
          </div>
        </div>
      </div>
    </div>
  );
}
