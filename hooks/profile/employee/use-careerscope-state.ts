import { ICareerScope } from "@/utils/interfaces/user/career.interface";
import { useState } from "react";

/* ----------------------------------- Usage ------------------------------------ */
/**
 * Manages local state for the employee career-scopes list editor.
 *
 * Usage:
 *   const {
 *     careerScopeInput, setCareerScopeInput,
 *     careerScopes, setCareerScopes,
 *     deleteCareerScopeIds, setDeleteCareerScopeIds,
 *     openCareerScopePopOver, setOpenCareerScopePopOver,
 *   } = useCareerScopesState(profile.careerScopes);
 *
 *   // Pass current saved scopes as the optional initialCareerScopes arg.
 */

/* ----------------------------------- Hook ------------------------------------- */
export function useCareerScopesState(initialCareerScopes: ICareerScope[] = []) {
  /* -------------------------------- All States -------------------------------- */
  const [careerScopeInput, setCareerScopeInput] = useState<ICareerScope | null>(
    null,
  );
  const [careerScopes, setCareerScopes] =
    useState<ICareerScope[]>(initialCareerScopes);
  const [deleteCareerScopeIds, setDeleteCareerScopeIds] = useState<string[]>(
    [],
  );
  const [openCareerScopePopOver, setOpenCareerScopePopOver] =
    useState<boolean>(false);

  /* --------------------------------- Methods ---------------------------------- */
  return {
    careerScopeInput,
    setCareerScopeInput,
    careerScopes,
    setCareerScopes,
    deleteCareerScopeIds,
    setDeleteCareerScopeIds,
    openCareerScopePopOver,
    setOpenCareerScopePopOver,
  };
}
