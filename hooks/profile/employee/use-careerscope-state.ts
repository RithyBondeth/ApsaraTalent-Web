import { ICareerScope } from "@/utils/interfaces/career-option.interface";
import { useState } from "react";

export function useCareerScopesState(initialCareerScopes: ICareerScope[] = []) {
  /* --------------------------------- All States -------------------------------- */
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

  /* ---------------------------------- Return ---------------------------------- */
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
