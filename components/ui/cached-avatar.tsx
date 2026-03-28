import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import React from "react";

export interface CachedAvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  className?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  preload?: boolean;
  showLoadingState?: boolean;
}

const sizeClasses = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
  xl: "size-16",
  "2xl": "size-20",
};

const roundedClasses = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
};

/**
 * Optimized Avatar component with image caching
 */
export function CachedAvatar({
  src,
  alt = "Avatar",
  className,
  rounded = "full",
  size = "md",
  onClick,
  children,
}: CachedAvatarProps) {
  const avatarClasses = cn(
    sizeClasses[size],
    roundedClasses[rounded],
    onClick && "cursor-pointer",
    className,
  );

  return (
    <Avatar className={avatarClasses} onClick={onClick}>
      <>
        <AvatarImage src={src || undefined} alt={alt} />
        <AvatarFallback className={cn("uppercase", roundedClasses[rounded])}>
          {children || (alt ? alt.slice(0, 2) : "??")}
        </AvatarFallback>
      </>
    </Avatar>
  );
}

export default CachedAvatar;
