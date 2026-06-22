import { ISkill } from "@/utils/interfaces/user/employee.interface";
import { useState } from "react";

/* ----------------------------------- Usage ------------------------------------ */
/**
 * Manages local state for the employee skills list editor.
 *
 * Usage:
 *   const {
 *     skillInput, setSkillInput,   // string | null
 *     skills, setSkills,
 *     deleteSkillIds, setDeleteSkillIds,
 *     openSkillPopOver, setOpenSkillPopOver,
 *   } = useSkillsState(profile.skills);
 *
 *   // Pass current saved skills as the optional initialSkills arg.
 */

/* ------------------------------------ Hook ------------------------------------ */
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
