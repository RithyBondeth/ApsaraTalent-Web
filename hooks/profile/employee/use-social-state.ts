import { ISocialLink } from "@/utils/interfaces/social";
import { useRef, useState } from "react";

export function useSocialsState(initialSocials: ISocialLink[] = []) {
  const [socialInput, setSocialInput] = useState<ISocialLink | null>(null);
  const [socials, setSocials] = useState<ISocialLink[]>(initialSocials);
  const [deleteSocialIds, setDeleteSocialIds] = useState<string[]>([]);
  const socialSelectPlatformRef = useRef<HTMLButtonElement>(null);

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
