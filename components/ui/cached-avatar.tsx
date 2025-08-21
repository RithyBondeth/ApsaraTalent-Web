import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useCachedImage } from '@/hooks/use-cached-image';
import { cn } from '@/lib/utils';

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
  fallback,
  className,
  rounded = "full",
  size = "md",
  onClick,
  children,
  preload = true,
  showLoadingState = false,
}: CachedAvatarProps) {
  const { cachedUrl, isLoading } = useCachedImage(src, {
    fallback: fallback || undefined,
    preload,
  });

  const avatarClasses = cn(
    sizeClasses[size],
    roundedClasses[rounded],
    onClick && "cursor-pointer",
    className
  );

  return (
    <Avatar className={avatarClasses} onClick={onClick}>
      {showLoadingState && isLoading ? (
        <div className="w-full h-full bg-muted animate-pulse" />
      ) : (
        <>
          <AvatarImage src={cachedUrl} alt={alt} />
          <AvatarFallback className={cn("uppercase", roundedClasses[rounded])}>
            {children || (alt ? alt.slice(0, 2) : "??")}
          </AvatarFallback>
        </>
      )}
    </Avatar>
  );
}

export default CachedAvatar;