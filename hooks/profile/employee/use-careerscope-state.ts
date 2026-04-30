import { ICareerScope } from "@/utils/interfaces/user/career.interface";
import { useState } from "react";

/* ----------------------------------- Hook ----------------------------------- */
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
