import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import Image from "next/image";
import feedWhiteSvg from "@/assets/svg/feed-white.svg";
import SearchBar from "@/components/search/search-bar";

export default function SearchPage() {
  return (
    <div className="w-full flex flex-col items-start gap-5">
      <div className="w-full flex items-center justify-between gap-10 laptop-sm:flex-col laptop-sm:items-center px-10 border-2 border-primary">
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
          className="laptop-sm:!w-full"
        />
      </div>
    </div>
  );
}
