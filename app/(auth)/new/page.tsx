import CollapseSidebar from "@/components/collapse-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function NewPage() {
    return (
        <div>
            <SidebarProvider>
                <CollapseSidebar/>
                <SidebarInset>
                    <SidebarTrigger/>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}