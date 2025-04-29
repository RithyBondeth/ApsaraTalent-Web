import { TUserRole } from "../types/role.type";
import { ICompany } from "./company.interface";
import { IEmployee } from "./employee.interface";

export interface IUser {
    id: string;
    role: TUserRole;   
    email: string;
    password: string;
    phone?: string;
    otpCode?: string;
    otpCodeExpires?: Date,
    pushNotificationToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    refreshToken?: string;
    isEmailVerified?: boolean;
    emailVerificationToken?: string;
    isTwoFactorEnabled?: boolean;
    twoFactorSecret?: string;
    facebookId?: string;
    googleId?: string;
    linkedinId?: string;
    githubId?: string;
    employee: IEmployee | null;
    company: ICompany | null;
    createdAt: Date;
}