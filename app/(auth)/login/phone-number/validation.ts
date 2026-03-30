import { khmerPhoneNumberValidation } from "@/utils/functions/validation/form-schemas";
import * as z from "zod";

export const phoneLoginSchema = z.object({
  phone: khmerPhoneNumberValidation(),
  rememberMe: z.boolean().optional(),
});

export type TPhoneLoginForm = z.infer<typeof phoneLoginSchema>;
