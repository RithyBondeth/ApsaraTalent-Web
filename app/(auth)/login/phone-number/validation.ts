import { khmerPhoneNumberValidation } from "@/utils/functions/validations";
import * as z from "zod";

export const phoneLoginSchema = z.object({
  phone: khmerPhoneNumberValidation(),
  rememberMe: z.boolean().optional(),
});

export type TPhoneLoginForm = z.infer<typeof phoneLoginSchema>;
