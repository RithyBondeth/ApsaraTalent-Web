import { ISkill } from "@/utils/interfaces/user/employee.interface";
import { useState } from "react";

/* ----------------------------------- Hook ----------------------------------- */
export function useSkillsState(initialSkills: ISkill[] = []) {
  /* -------------------------------- All States -------------------------------- */
  const [skillInput, setSkillInput] = useState<string | null>(null);
  const [skills, setSkills] = useState<ISkill[]>(initialSkills);
  const [deleteSkillIds, setDeleteSkillIds] = useState<string[]>([]);
  const [openSkillPopOver, setOpenSkillPopOver] = useState<boolean>(false);

  /* --------------------------------- Methods ---------------------------------- */
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
