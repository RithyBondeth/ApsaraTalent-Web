import { useRef, useState } from "react";
import { ISocial } from "@/utils/interfaces/user-interface/employee.interface";

export function useCmpSocialsState(initialSocials: ISocial[] = []) {
  const [socialInput, setSocialInput] = useState<ISocial | null>(null);
  const [socials, setSocials] = useState<ISocial[]>(initialSocials);
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
