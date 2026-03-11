import {
    IBenefits,
    IValues
} from "@/utils/interfaces/user-interface/company.interface";
import { useState } from "react";

export default function useCmpBenefitValueState() {
  // Benefit States
  const [benefitInput, setBenefitInput] = useState<IBenefits | null>(null);
  const [benefits, setBenefits] = useState<IBenefits[]>([]);
  const [deletedBenefitIds, setDeletedBenefitIds] = useState<number[]>([]);
  const [openBenefitPopOver, setOpenBenefitPopOver] = useState<boolean>(false);

  // Value States
  const [valueInput, setValueInput] = useState<IValues | null>(null);
  const [values, setValues] = useState<IValues[]>([]);
  const [deletedValueIds, setDeletedValueIds] = useState<number[]>([]);
  const [openValuePopOver, setOpenValuePopOver] = useState<boolean>(false);

  return {
    benefitInput,
    setBenefitInput,
    benefits,
    setBenefits,
    deletedBenefitIds,
    setDeletedBenefitIds,
    openBenefitPopOver,
    setOpenBenefitPopOver,

    valueInput,
    setValueInput,
    values,
    setValues,
    deletedValueIds,
    setDeletedValueIds,
    openValuePopOver,
    setOpenValuePopOver,
  };
}
