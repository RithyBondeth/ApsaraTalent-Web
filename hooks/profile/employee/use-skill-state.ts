import { ISkill } from "@/utils/interfaces/user-interface/employee.interface";
import { useState } from "react";

export function useSkillsState(initialSkills: ISkill[] = []) {
  const [skillInput, setSkillInput] = useState<string | null>(null);
  const [skills, setSkills] = useState<ISkill[]>(initialSkills);
  const [deleteSkillIds, setDeleteSkillIds] = useState<string[]>([]);
  const [openSkillPopOver, setOpenSkillPopOver] = useState<boolean>(false);

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
