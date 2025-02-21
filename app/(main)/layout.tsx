import LeftSidebar from "@/components/sidebar/left-sidebar";
import RightSidebar from "@/components/sidebar/right-sidebar";

export default function MainLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex justify-between items-start p-5"> 
            <LeftSidebar className="h-[calc(100vh-40px)] w-[20%] rounded-lg"/>
            <div className="w-[55%] px-5">{children}</div>
            <RightSidebar className="w-[25%]"/>
        </div>       
    );
}