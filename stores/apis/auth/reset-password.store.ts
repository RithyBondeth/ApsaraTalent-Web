type TResetPasswordResponse = {
    message: string | null;   
};

type TResetPasswordState = TResetPasswordResponse & {
    loading: boolean;
    error: string | null;
    resetPassword: (token: string, newPassword: string, confirmPassword: string) => Promise<void>;   
}