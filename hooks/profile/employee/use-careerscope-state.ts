import { useState } from "react";
import { ICareerScopes } from "@/utils/interfaces/user-interface/employee.interface";

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
  const [openCareerScopePopOver, setOpenCareerScopePopOver] = useState(false);

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
