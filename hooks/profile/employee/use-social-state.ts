import { ISocialLink } from "@/utils/interfaces/user/social.interface";
import { useRef, useState } from "react";

/* ----------------------------------- Hook ----------------------------------- */
export function useSocialsState(initialSocials: ISocialLink[] = []) {
  /* -------------------------------- All States -------------------------------- */
  const [socialInput, setSocialInput] = useState<ISocialLink | null>(null);
  const [socials, setSocials] = useState<ISocialLink[]>(initialSocials);
  const [deleteSocialIds, setDeleteSocialIds] = useState<string[]>([]);
  const socialSelectPlatformRef = useRef<HTMLButtonElement>(null);

  /* --------------------------------- Methods ---------------------------------- */
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
