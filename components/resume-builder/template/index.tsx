import { Button } from "@/components/ui/button";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideEye } from "lucide-react";
import Image from "next/image";
import { TTemplateCardProps } from "./props";
import ImagePopup from "@/components/utils/image-popup";
import { useState } from "react";

export default function TemplateCard(props: TTemplateCardProps) {
  const [popupResume, setPopupResume] = useState<boolean>(false);
  return (
    <div
      className={`h-fit w-full flex flex-col items-center rounded-lg cursor-pointer transition shadow-sm border ${
        props.selected
          ? "border-primary ring-2 ring-primary/30"
          : "border-muted"
      }`}
    >
      {/* <div className="w-full h-60 flex items-center justify-center bg-primary-foreground rounded-tr-lg rounded-tl-lg relative group">
        <div
          className={`absolute top-2 right-2 rounded-xl px-3 py-1 font-medium text-sm text-primary-foreground ${
            props.isPremium ? "bg-amber-500" : "bg-green-500"
          }`}
        >
          {props.isPremium ? "Premium" : "Free"}
        </div>
        <Image
          src={props.image}
          width={728}
          height={1024}
          alt={props.title}
          className="h-full w-1/2"
        />
        <div className="absolute inset-0 rounded-tr-lg rounded-tl-lg flex items-center justify-center bg-black/50 opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 group-hover:pointer-events-auto">
          <div className="p-3 rounded-full bg-secondary-foreground">
            <LucideEye
              className="text-secondary size-8"
              strokeWidth={"1.3px"}
              onClick={() => setPopupResume(true)}
            />
          </div>
        </div>
      </div> */}
      <div className="w-full p-3">
        <div>
          <TypographyH4 className="text-md">{props.title}</TypographyH4>
          <TypographyMuted className="leading-relaxed">
            {props.description}
          </TypographyMuted>
        </div>
        <div className="w-full flex justify-between items-center mt-3">
          <Button className="text-xs" onClick={props.onUseTemplate}>
            {props.isPremium ? `$${props.price}` : "Use Template"}
          </Button>
        </div>
      </div>
      <ImagePopup
        image={props.image}
        open={popupResume}
        setOpen={setPopupResume}
      />
    </div>
  );
}
