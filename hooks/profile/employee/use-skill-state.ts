import { ISkill } from "@/utils/interfaces/user";
import { useState } from "react";

export function useSkillsState(initialSkills: ISkill[] = []) {
  /* --------------------------------- All States -------------------------------- */
  const [skillInput, setSkillInput] = useState<string | null>(null);
  const [skills, setSkills] = useState<ISkill[]>(initialSkills);
  const [deleteSkillIds, setDeleteSkillIds] = useState<string[]>([]);
  const [openSkillPopOver, setOpenSkillPopOver] = useState<boolean>(false);

  /* ---------------------------------- Return ---------------------------------- */
  return {
    skillInput,
    setSkillInput,
    skills,
    setSkills,
    deleteSkillIds,
    setDeleteSkillIds,
    openSkillPopOver,
    setOpenSkillPopOver,
  };
}
