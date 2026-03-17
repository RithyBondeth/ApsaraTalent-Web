import { ICareerScopes } from "@/utils/interfaces/user-interface/employee.interface";
import { useState } from "react";

export function useCareerScopesState(
  initialCareerScopes: ICareerScopes[] = [],
) {
  const [careerScopeInput, setCareerScopeInput] =
    useState<ICareerScopes | null>(null);
  const [careerScopes, setCareerScopes] =
    useState<ICareerScopes[]>(initialCareerScopes);
  const [deleteCareerScopeIds, setDeleteCareerScopeIds] = useState<string[]>(
    [],
  );
  const [openCareerScopePopOver, setOpenCareerScopePopOver] =
    useState<boolean>(false);

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
