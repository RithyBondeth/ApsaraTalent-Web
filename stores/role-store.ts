import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole } from "@/utils/types/role.type";

interface RoleState {
    role: UserRole,
    changeRole: (userRole: UserRole) => void,
}

export const useRoleStore = create<RoleState>()(persist((set) => ({
    role: 'employee',
    changeRole: (userRole: UserRole) => set({ role: userRole })
}),{
    name: 'role-storage'
}));