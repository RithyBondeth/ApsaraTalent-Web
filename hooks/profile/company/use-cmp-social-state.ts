import { ISocialLink } from "@/utils/interfaces/social";
import { useRef, useState } from "react";

export function useCmpSocialsState(initialSocials: ISocialLink[] = []) {
  /* --------------------------------- All States -------------------------------- */
  const [socialInput, setSocialInput] = useState<ISocialLink | null>(null);
  const [socials, setSocials] = useState<ISocialLink[]>(initialSocials);
  const [deleteSocialIds, setDeleteSocialIds] = useState<string[]>([]);
  const socialSelectPlatformRef = useRef<HTMLButtonElement>(null);

  /* ---------------------------------- Return ---------------------------------- */
  return {
    socialInput,
    setSocialInput,
    socials,
    setSocials,
    deleteSocialIds,
    setDeleteSocialIds,
    socialSelectPlatformRef,
  };
}
