import { khmerPhoneNumberValidation, passwordValidation } from "@/utils/functions/validations";
import * as z from "zod";

export const phoneLoginSchema = z.object({
    phone: khmerPhoneNumberValidation,
    password: passwordValidation,
});

export type TPhoneLoginForm = z.infer<typeof phoneLoginSchema>;