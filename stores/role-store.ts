import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TUserRole } from "@/utils/types/role.type";

interface RoleState {
    role: TUserRole,
    changeRole: (userRole: TUserRole) => void,
}

export const useRoleStore = create<RoleState>()(persist((set) => ({
    role: 'employee',
    changeRole: (userRole: TUserRole) => set({ role: userRole })
}),{
    name: 'role-storage'
}));