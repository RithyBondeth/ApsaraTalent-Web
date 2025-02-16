import Image from "next/image"
import BlackLogo from "@/assets/svg/logo-black.svg";
import WhiteLogo from "@/assets/svg/logo-white.svg";
import { ILogoProps } from "@/utils/interfaces/logo.interface";

export default function LogoComponent(props: ILogoProps) {
    const { isBlackLogo = true, height = 80, width = 160 }  = props;   
    return <Image src={isBlackLogo ? BlackLogo : WhiteLogo} alt="logo" height={height} width={width}/>
}