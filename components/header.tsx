import { Button } from "./ui/button";
import LogoComponent from "./utils/logo";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Header({ className }: { className?: string }) {
    return (
        <nav className={cn("flex justify-between items-center p-3", className)}>
            {/* Left Menu Section */}
            <div className="flex items-center gap-5">
                <LogoComponent/>
                <Button variant="ghost">Products</Button>
                <Button variant="ghost">Learn</Button>
                <Button variant="ghost">Safety</Button>
                <Button variant="ghost">Support</Button>
            </div>

            {/* Right Menu Section */}
            <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                    <Label>EN</Label>
                    <Switch/>
                    <Label>KH</Label>
                </div>
                <Link href="/login">
                    <Button>Login</Button>
                </Link>
            </div>
        </nav>
    )
}