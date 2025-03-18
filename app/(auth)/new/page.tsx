import CollapseSidebar from "@/components/collapse-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function NewPage() {
    return (
        <div>
            <SidebarProvider>
                <CollapseSidebar/>
            </SidebarProvider>
        </div>
    )
}