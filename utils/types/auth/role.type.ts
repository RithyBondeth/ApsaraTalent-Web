import { USER_ROLE } from "@/utils/constants/auth.constant";

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
