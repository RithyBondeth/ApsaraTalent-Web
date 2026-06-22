import { ISocialLink } from "@/utils/interfaces/user/social.interface";
import { useRef, useState } from "react";

/* ----------------------------------- Usage ------------------------------------ */
/**
 * Manages local state for the employee social-links list editor.
 *
 * Usage:
 *   const {
 *     socialInput, setSocialInput,
 *     socials, setSocials,
 *     deleteSocialIds, setDeleteSocialIds,
 *     socialSelectPlatformRef,   // ref to the platform <select> trigger
 *   } = useSocialsState(profile.socials);
 *
 *   // Pass current saved socials as the optional initialSocials arg.
 */

/* ------------------------------------ Hook ------------------------------------ */
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
