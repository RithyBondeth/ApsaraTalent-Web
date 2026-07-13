import { IBenefits } from "@/utils/interfaces/user/company.interface";
import { IValues } from "@/utils/interfaces/user/company.interface";
import { useState } from "react";

/* ----------------------------------- Usage ------------------------------------ */
/**
 * Manages the local state for company benefits and company values lists,
 * including popover open state and IDs to delete on save.
 *
 * Usage:
 *   const {
 *     benefitInput, setBenefitInput,
 *     benefits, setBenefits,
 *     deletedBenefitIds, setDeletedBenefitIds,
 *     openBenefitPopOver, setOpenBenefitPopOver,
 *     valueInput, setValueInput,
 *     values, setValues,
 *     deletedValueIds, setDeletedValueIds,
 *     openValuePopOver, setOpenValuePopOver,
 *   } = useCmpBenefitValueState();
 */

/* ----------------------------------- Hook ------------------------------------- */
export default function useCmpBenefitValueState() {
  /* -------------------------------- All States -------------------------------- */
  // ── Benefit States ─────────────────────────────────────────
  const [benefitInput, setBenefitInput] = useState<IBenefits | null>(null);
  const [benefits, setBenefits] = useState<IBenefits[]>([]);
  const [deletedBenefitIds, setDeletedBenefitIds] = useState<number[]>([]);
  const [openBenefitPopOver, setOpenBenefitPopOver] = useState<boolean>(false);

  // ── Value States ─────────────────────────────────────────
  const [valueInput, setValueInput] = useState<IValues | null>(null);
  const [values, setValues] = useState<IValues[]>([]);
  const [deletedValueIds, setDeletedValueIds] = useState<number[]>([]);
  const [openValuePopOver, setOpenValuePopOver] = useState<boolean>(false);

  /* --------------------------------- Methods ---------------------------------- */
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
