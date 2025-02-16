import { ReactNode } from "react"
import signupWhiteSvg from "@/assets/svg/signup-white.svg";
import Image from "next/image";

export default function SignupLayout({ children }: { children: ReactNode }) {
    return (
        <div className="h-screen w-screen flex justify-between items-stretch">
            <div className="h-screen w-1/2 flex justify-center items-center">{children}</div>
            <div className="w-1/2 flex justify-center items-center bg-primary">
                <Image src={signupWhiteSvg} alt="signup" height={undefined} width={600}/>
            </div>
        </div>
    )
}